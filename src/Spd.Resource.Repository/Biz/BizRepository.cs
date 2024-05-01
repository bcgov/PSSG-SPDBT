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
        private readonly DynamicsContext _dynaContext;
        private readonly IMapper _mapper;
        public BizRepository(IDynamicsContextFactory ctx, IMapper mapper, ILogger<BizRepository> logger)
        {
            _dynaContext = ctx.CreateChangeOverwrite();
            _mapper = mapper;
        }
        public async Task<IEnumerable<BizResult>> QueryBizAsync(BizsQry qry, CancellationToken ct)
        {
            IQueryable<account> accounts = _dynaContext.accounts.Expand(a => a.spd_account_spd_servicetype);
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
            IQueryable<account> accounts = _dynaContext.accounts.Expand(a => a.spd_Organization_Addresses)
                .Where(a => a.statecode != DynamicsConstants.StateCode_Inactive)
                .Where(a => a.accountid == accountId);

            account? Biz = await accounts.FirstOrDefaultAsync(ct);
            
            if (Biz == null) throw new ApiException(HttpStatusCode.NotFound);

            List<spd_account_spd_servicetype> serviceTypes = _dynaContext.spd_account_spd_servicetypeset
                .Where(so => so.accountid == Biz.accountid)
                .ToList();

            if (!serviceTypes.Any())
                throw new ApiException(HttpStatusCode.InternalServerError, $"Biz {Biz.name} does not have service type.");

            var response = _mapper.Map<BizResult>(Biz);
            response.ServiceTypes = serviceTypes.Select(s => Enum.Parse<ServiceTypeEnum>(DynamicsContextLookupHelpers.LookupServiceTypeKey(s.spd_servicetypeid)));
            return response;
        }

        public async Task<BizResult?> ManageBizAsync(BizCmd cmd, CancellationToken ct)
        {
            return cmd switch
            {
                BizUpdateCmd c => await BizUpdateAsync(c, ct),
                BizCreateCmd c => await BizCreateAsync(c, ct),
                BizAddServiceTypeCmd c => await BizAddServiceTypeAsync(c, ct),
                _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
            };
        }

        private async Task<BizResult?> BizUpdateAsync(BizUpdateCmd updateBizCmd, CancellationToken ct)
        {
            IQueryable<account> accounts = _dynaContext.accounts
                 .Where(a => a.statecode != DynamicsConstants.StateCode_Inactive)
                 .Where(a => a.accountid == updateBizCmd.Biz.Id);

            account? Biz = await accounts.FirstOrDefaultAsync(ct);
            var response = _mapper.Map<BizResult>(Biz);

            _mapper.Map(updateBizCmd.Biz, Biz);

            _dynaContext.UpdateObject(Biz);
            await _dynaContext.SaveChangesAsync(ct);

            return _mapper.Map<BizResult>(Biz);
        }

        private async Task<BizResult?> BizCreateAsync(BizCreateCmd createBizCmd, CancellationToken ct)
        {
            var account = _mapper.Map<account>(createBizCmd.Biz);
            _dynaContext.AddToaccounts(account);
            await _dynaContext.SaveChangesAsync(ct);

            return _mapper.Map<BizResult>(account);
        }

        private async Task<BizResult?> BizAddServiceTypeAsync(BizAddServiceTypeCmd bizAddServiceTypeCmd, CancellationToken ct)
        {
            spd_servicetype? st = _dynaContext.LookupServiceType(bizAddServiceTypeCmd.ServiceTypeEnum.ToString());
            IQueryable<account> accounts = _dynaContext.accounts
                .Expand(a => a.spd_account_spd_servicetype)
                .Where(a => a.statecode != DynamicsConstants.StateCode_Inactive)
                .Where(a => a.accountid == bizAddServiceTypeCmd.BizId);
            account? biz = await accounts.FirstOrDefaultAsync(ct);
            if (biz == null)
                throw new ApiException(HttpStatusCode.BadRequest, "cannot find the biz");
            if (!biz.spd_account_spd_servicetype.Any(s => s.spd_servicetypeid == st.spd_servicetypeid))
            {

                _dynaContext.AddLink(biz, nameof(biz.spd_account_spd_servicetype), st);
                await _dynaContext.SaveChangesAsync(ct);
            }
            return await GetBizAsync(bizAddServiceTypeCmd.BizId, ct);
        }

    }
}
