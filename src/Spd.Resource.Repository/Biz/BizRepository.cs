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
        private readonly List<BizTypeEnum> soleProprietorTypes = new()
        {
            BizTypeEnum.RegisteredSoleProprietor,
            BizTypeEnum.NonRegisteredSoleProprietor
        };

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

        public async Task<BizResult?> GetBizAsync(Guid accountId, CancellationToken ct, bool includeMainOffice = false)
        {
            IQueryable<account> accounts = _context.accounts
                .Expand(a => a.spd_Organization_Addresses)
                .Expand(a => a.spd_organization_spd_licence_soleproprietor)
                .Expand(a => a.spd_account_spd_servicetype)
                .Where(a => a.statecode != DynamicsConstants.StateCode_Inactive)
                .Where(a => a.accountid == accountId);

            account? biz = await accounts.FirstOrDefaultAsync(ct);

            if (biz == null) throw new ApiException(HttpStatusCode.NotFound);

            spd_licence? swl = biz.spd_organization_spd_licence_soleproprietor
              .Where(a => a.statecode == DynamicsConstants.StateCode_Active)
              .OrderByDescending(a => a.createdon)
              .FirstOrDefault();

            //spdbt-3952: portal do not want main office, bcmp printing want mainOffice
            var response = _mapper.Map<BizResult>(biz, opt =>
            {
                opt.Items["includeMainOffice"] = includeMainOffice;
            });

            response.SoleProprietorSwlContactInfo.LicenceId = swl?.spd_licenceid;
            response.SoleProprietorSwlExpiryDate = SharedMappingFuncs.GetDateOnlyFromDateTimeOffset(swl?.spd_expirydate);
            return response;
        }

        public async Task<BizResult?> ManageBizAsync(BizCmd cmd, CancellationToken ct)
        {
            return cmd switch
            {
                UpdateBizCmd c => await UpdateBizAsync(c, ct),
                CreateBizCmd c => await CreateBizAsync(c, ct),
                MergeBizsCmd c => await MergeBizAsync(c, ct),
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
            if (updateBizCmd.UpdateSoleProprietor && IsSoleProprietor(updateBizCmd.BizType))
            {
                UpdateSPLicenceLink(biz, updateBizCmd.SoleProprietorSwlContactInfo?.LicenceId, updateBizCmd.BizType);
                await UpdateSPBizContact(biz, updateBizCmd.SoleProprietorSwlContactInfo?.LicenceId, ct);
            }
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
                var serviceTypeCode = DynamicsContextLookupHelpers.GetServiceTypeName(serviceType.spd_servicetypeid);
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

        private async Task<BizResult?> MergeBizAsync(MergeBizsCmd mergeBizCmd, CancellationToken ct)
        {
            account? oldBiz = await _context.GetOrgById(mergeBizCmd.OldBizId, ct);
            account? newBiz = await _context.GetOrgById(mergeBizCmd.NewBizId, ct);
            if (oldBiz == null || newBiz == null)
            {
                _logger.LogError($"Merge bizs cannot find at least one of the bizs");
                throw new ArgumentException("cannot find business for merging");
            }

            var result = await _context.spd_MergeOrgs(oldBiz, newBiz).GetValueAsync(ct);
            await _context.SaveChangesAsync(ct);
            if (result.IsSuccess == null || !(result.IsSuccess.Value))
            {
                _logger.LogError($"Merge bizs failed for merging oldBiz {mergeBizCmd.OldBizId} to newContact {mergeBizCmd.NewBizId}");
                throw new ApiException(System.Net.HttpStatusCode.InternalServerError, "merge accounts failed.");
            }
            return null;
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

        private void UpdateSPLicenceLink(account account, Guid? licenceId, BizTypeEnum? bizType)
        {
            spd_licence? existingLicence = account.spd_organization_spd_licence_soleproprietor
                .FirstOrDefault(a => a.statecode == DynamicsConstants.StateCode_Active);

            if (existingLicence != null && existingLicence.spd_licenceid == licenceId && IsSoleProprietor(bizType))
                return;
            if (!IsSoleProprietor(bizType) && IsSoleProprietor(SharedMappingFuncs.GetBizTypeEnum(account.spd_licensingbusinesstype)))
                throw new ApiException(HttpStatusCode.BadRequest, "Biz type can only be changed from sole proprietor to non-sole proprietor");
            if (!IsSoleProprietor(bizType))
                return;

            // Remove link with current licence
            if (existingLicence != null)
            {
                _context.DeleteLink(account, nameof(account.spd_organization_spd_licence_soleproprietor), existingLicence);
            }
            // Add link with new licence
            spd_licence? newLicence = _context.spd_licences
                .Where(l => l.spd_licenceid == licenceId)
                .Where(l => l.statecode == DynamicsConstants.StateCode_Active)
                .FirstOrDefault();

            if (newLicence != null)
            {
                _context.AddLink(account, nameof(account.spd_organization_spd_licence_soleproprietor), newLicence);
            }
        }

        private async Task UpdateSPBizContact(account account, Guid? licenceId, CancellationToken ct)
        {
            if (licenceId == null) return;
            IQueryable<spd_businesscontact> bizExistingContacts = _context.spd_businesscontacts
                .Where(b => b._spd_organizationid_value == account.accountid)
                .Where(a => a.statecode != DynamicsConstants.StateCode_Inactive);

            spd_businesscontact? validSpContact = bizExistingContacts.FirstOrDefault(
                c => c.spd_role == (int)BizContactRoleOptionSet.ControllingMember && c._spd_swlnumber_value == licenceId
                );

            if (validSpContact == null)
            {
                //add a bizcontact
                spd_licence? newLicence = await _context.spd_licences
                    .Expand(l => l.spd_LicenceHolder_contact)
                    .Where(l => l.spd_licenceid == licenceId)
                    .Where(l => l.statecode == DynamicsConstants.StateCode_Active)
                    .FirstOrDefaultAsync(ct);
                contact? contact = await _context.contacts.Where(c => c.contactid == newLicence.spd_LicenceHolder_contact.contactid).FirstOrDefaultAsync(ct);
                spd_businesscontact bizContact = new spd_businesscontact();
                bizContact.spd_businesscontactid = Guid.NewGuid();
                bizContact.spd_role = (int)BizContactRoleOptionSet.ControllingMember;
                _context.AddTospd_businesscontacts(bizContact);
                _context.SetLink(bizContact, nameof(bizContact.spd_ContactId), contact);
                _context.SetLink(bizContact, nameof(bizContact.spd_OrganizationId), account);
                _context.SetLink(bizContact, nameof(bizContact.spd_SWLNumber), newLicence);
            }
        }

        private bool IsSoleProprietor(BizTypeEnum? bizType)
        {
            if (bizType == null) return false;

            return soleProprietorTypes.Contains((BizTypeEnum)bizType);
        }
    }
}
