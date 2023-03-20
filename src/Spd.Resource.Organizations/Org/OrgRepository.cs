using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Logging;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Exceptions;

namespace Spd.Resource.Organizations.Org
{
    internal class OrgRepository : IOrgRepository
    {
        private readonly DynamicsContext _dynaContext;
        private readonly IMapper _mapper;
        private readonly ILogger<OrgRepository> _logger;
        public OrgRepository(IDynamicsContextFactory ctx, IMapper mapper, ILogger<OrgRepository> logger)
        {
            _dynaContext = ctx.Create();
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<OrgResp> OrgUpdateAsync(OrgUpdateCmd updateOrgCmd, CancellationToken cancellationToken)
        {
            var org = GetOrgById(updateOrgCmd.Id);
            _mapper.Map(updateOrgCmd, org);

            _dynaContext.UpdateObject(org);
            await _dynaContext.SaveChangesAsync(cancellationToken);

            return _mapper.Map<OrgResp>(org);
        }

        public async Task<OrgResp> OrgGetAsync(Guid orgId, CancellationToken cancellationToken)
        {
            var org = GetOrgById(orgId);
            var response = _mapper.Map<OrgResp>(org);
            return response;
        }

        private account GetOrgById(Guid organizationId)
        {
            var account = _dynaContext.accounts
                .Where(a => a.accountid == organizationId)
                .FirstOrDefault();

            if (account?.statecode == DynamicsConstants.StateCode_Inactive)
                throw new InactiveException(System.Net.HttpStatusCode.BadRequest, $"Organization {organizationId} is inactive.");
            return account;
        }
    }
}
