using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Logging;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Exceptions;
using System.Collections.Immutable;
using System.Net;

namespace Spd.Resource.Repository.Biz
{
    internal class BizRepository : IBizRepository
    {
        private readonly DynamicsContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<BizRepository> _logger;

        public BizRepository(IDynamicsContextFactory ctx, 
            IMapper mapper, 
            ILogger<BizRepository> logger)
        {
            _context = ctx.CreateChangeOverwrite();
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<IEnumerable<BizResult>> QueryBizAsync(BizsQry qry, CancellationToken ct)
        {
            IQueryable<account> accounts = _context.accounts.Expand(a => a.spd_account_spd_servicetype);
            if (!qry.IncludeInactive)
                accounts = accounts.Where(a => a.statecode != DynamicsConstants.StateCode_Inactive);
            if (qry.BizGuid != null)
                accounts = accounts.Where(a => a.spd_orgguid == qry.BizGuid.ToString());
            if (qry.BizCode != null)
                accounts = accounts.Where(a => a.spd_orgcode == qry.BizCode);
            if (qry.ServiceTypes != null && qry.ServiceTypes.Any())
            {
                IEnumerable<Guid> stIds = qry.ServiceTypes.Select(t => DynamicsContextLookupHelpers.ServiceTypeGuidDictionary.GetValueOrDefault(t.ToString()));
                var accountsList = accounts
                    .AsEnumerable()
                    .Where(a => stIds.Any(t => a.spd_account_spd_servicetype.Any(st => st.spd_servicetypeid == t)));
                return _mapper.Map<IEnumerable<BizResult>>(accountsList);
            }

            return _mapper.Map<IEnumerable<BizResult>>(accounts.ToList());
        }

        public async Task<BizResult?> GetBizAsync(Guid accountId, CancellationToken ct)
        {
            IQueryable<account> accounts = _context.accounts
                .Expand(a => a.spd_Organization_Addresses)
                .Expand(a => a.spd_organization_spd_licence_soleproprietor)
                .Where(a => a.statecode != DynamicsConstants.StateCode_Inactive)
                .Where(a => a.accountid == accountId);

            account? Biz = await accounts.FirstOrDefaultAsync(ct);
            
            if (Biz == null) throw new ApiException(HttpStatusCode.NotFound);

            List<spd_account_spd_servicetype> serviceTypes = _context.spd_account_spd_servicetypeset
                .Where(so => so.accountid == Biz.accountid)
                .ToList();

            Guid? licHolderId = Biz.spd_organization_spd_licence_soleproprietor
                .FirstOrDefault(l => l.statecode == DynamicsConstants.StateCode_Active)
                ._spd_licenceholder_value;

            spd_licence? licHolderContact = _context.spd_licences
                .Expand(l => l.spd_LicenceHolder_contact)
                .Where(l => l.statecode != DynamicsConstants.StateCode_Inactive)
                .Where(l => l._spd_licenceholder_value == licHolderId)
                .FirstOrDefault();

            if (!serviceTypes.Any())
                throw new ApiException(HttpStatusCode.InternalServerError, $"Biz {Biz.name} does not have service type.");

            var response = _mapper.Map<BizResult>(Biz);
            response.ServiceTypes = serviceTypes.Select(s => Enum.Parse<ServiceTypeEnum>(DynamicsContextLookupHelpers.LookupServiceTypeKey(s.spd_servicetypeid)));

            if (licHolderContact != null)
            {
                response.SoleProprietorSwlContactInfo.LicenceId = licHolderContact.spd_licenceid;
                response.SoleProprietorSwlContactInfo.ContactId = licHolderContact.spd_LicenceHolder_contact.contactid;
                response.SoleProprietorSwlEmailAddress = licHolderContact.spd_LicenceHolder_contact.emailaddress1;
                response.SoleProprietorSwlPhoneNumber = licHolderContact.spd_LicenceHolder_contact.telephone1;
            }

            return response;
        }

        public async Task<BizResult?> ManageBizAsync(BizCmd cmd, CancellationToken ct)
        {
            return cmd switch
            {
                UpdateBizCmd c => await UpdateBizAsync(c, ct),
                CreateBizCmd c => await CreateBizAsync(c, ct),
                AddBizServiceTypeCmd c => await AddBizServiceTypeAsync(c, ct),
                UpdateBizServiceTypeCmd c => await UpdateBizServiceTypeAsync(c, ct),
                _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
            };
        }

        private async Task<BizResult?> UpdateBizAsync(UpdateBizCmd updateBizCmd, CancellationToken ct)
        {
            IQueryable<account> accounts = _context.accounts
                .Expand(a => a.spd_Organization_Addresses)
                .Expand(a => a.spd_organization_spd_licence_soleproprietor)
                .Where(a => a.statecode != DynamicsConstants.StateCode_Inactive)
                .Where(a => a.accountid == updateBizCmd.Id);

            account? biz = await accounts.FirstOrDefaultAsync(ct);

            if (biz == null) throw new ApiException(HttpStatusCode.NotFound);

            _mapper.Map(updateBizCmd, biz);
            _context.UpdateObject(biz);

            UpdateLicenceLink(biz, (Guid)(updateBizCmd.SoleProprietorSwlContactInfo?.LicenceId));

            await _context.SaveChangesAsync(ct);

            return _mapper.Map<BizResult>(biz);
        }

        private async Task<BizResult?> UpdateBizServiceTypeAsync(UpdateBizServiceTypeCmd updateBizServiceTypeCmd, CancellationToken ct)
        {
            spd_servicetype? st = _context.LookupServiceType(updateBizServiceTypeCmd.ServiceTypeEnum.ToString());
            IQueryable<account> accounts = _context.accounts
                .Expand(a => a.spd_account_spd_servicetype)
                .Where(a => a.statecode != DynamicsConstants.StateCode_Inactive)
                .Where(a => a.accountid == updateBizServiceTypeCmd.BizId);
            account? biz = await accounts.FirstOrDefaultAsync(ct);

            if (biz == null)
                throw new ApiException(HttpStatusCode.BadRequest, "cannot find the biz");

            if (!biz.spd_account_spd_servicetype.Any(s => s.spd_servicetypeid == st.spd_servicetypeid))
                _context.AddLink(biz, nameof(biz.spd_account_spd_servicetype), st);

            foreach (spd_servicetype serviceType in biz.spd_account_spd_servicetype)
            {
                var serviceTypeCode = DynamicsContextLookupHelpers.LookupServiceTypeKey(serviceType.spd_servicetypeid);
                if (updateBizServiceTypeCmd.ServiceTypeEnum.ToString() != serviceTypeCode)
                    _context.DeleteLink(biz, nameof(biz.spd_account_spd_servicetype), serviceType);
            }
            
            await _context.SaveChangesAsync(ct);
            return await GetBizAsync(updateBizServiceTypeCmd.BizId, ct);
        }

        private async Task<BizResult?> CreateBizAsync(CreateBizCmd createBizCmd, CancellationToken ct)
        {
            var account = _mapper.Map<account>(createBizCmd);
            _context.AddToaccounts(account);

            foreach (ServiceTypeEnum serviceType in createBizCmd.ServiceTypes)
            {
                spd_servicetype? st = _context.LookupServiceType(serviceType.ToString());
                _context.AddLink(account, nameof(account.spd_account_spd_servicetype), st);
            }
            
            await _context.SaveChangesAsync(ct);

            return _mapper.Map<BizResult>(account);
        }

        private async Task<BizResult?> AddBizServiceTypeAsync(AddBizServiceTypeCmd addBizServiceTypeCmd, CancellationToken ct)
        {
            spd_servicetype? st = _context.LookupServiceType(addBizServiceTypeCmd.ServiceTypeEnum.ToString());
            IQueryable<account> accounts = _context.accounts
                .Expand(a => a.spd_account_spd_servicetype)
                .Where(a => a.statecode != DynamicsConstants.StateCode_Inactive)
                .Where(a => a.accountid == addBizServiceTypeCmd.BizId);
            account? biz = await accounts.FirstOrDefaultAsync(ct);
            if (biz == null)
                throw new ApiException(HttpStatusCode.BadRequest, "cannot find the biz");
            if (!biz.spd_account_spd_servicetype.Any(s => s.spd_servicetypeid == st.spd_servicetypeid))
            {
                _context.AddLink(biz, nameof(biz.spd_account_spd_servicetype), st);
                await _context.SaveChangesAsync(ct);
            }
            return await GetBizAsync(addBizServiceTypeCmd.BizId, ct);
        }

        private void UpdateLicenceLink(account account, Guid licenceId)
        {
            // Remove link with current licence
            spd_licence? licence = account.spd_organization_spd_licence_soleproprietor.FirstOrDefault();

            if (licence != null)
            {
                _context.DeleteLink(account, nameof(account.spd_organization_spd_licence_soleproprietor), licence);
            }

            // Add link with new licence
            spd_licence? newLicence = account.spd_organization_spd_licence_soleproprietor.Where(l => l.spd_licenceid == licenceId).FirstOrDefault();

            if (newLicence != null)
            {
                _context.AddLink(account, nameof(account.spd_organization_spd_licence_soleproprietor), newLicence);
            }
        }
    }
}
