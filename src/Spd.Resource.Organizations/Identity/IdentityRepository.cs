using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Logging;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Organizations.Identity
{
    internal class IdentityRepository : IIdentityRepository
    {
        private readonly DynamicsContext _dynaContext;
        private readonly IMapper _mapper;
        private readonly ILogger<IdentityRepository> _logger;
        public IdentityRepository(IDynamicsContextFactory ctx, IMapper mapper, ILogger<IdentityRepository> logger)
        {
            _dynaContext = ctx.Create();
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<IdentityQueryResult?> QueryIdentity(IdentityQuery query, CancellationToken ct)
        {
            return query switch
            {
                IdentityByUserGuidOrgGuidQuery q => await HandleQuery(q, ct),
                _ => throw new NotSupportedException($"{query.GetType().Name} is not supported")
            };
        }
        private async Task<IdentityQueryResult?> HandleQuery(IdentityByUserGuidOrgGuidQuery queryRequest, CancellationToken ct)
        {
            spd_identity? identity = _dynaContext.spd_identities
                .Where(i => i.spd_userguid == queryRequest.UserGuid.ToString() && i.spd_orgguid == queryRequest.OrgGuid.ToString())
                .Where(i => i.statecode != DynamicsConstants.StateCode_Inactive)
                .FirstOrDefault();
            if (identity == null) return null;
            return new IdentityQueryResult(_mapper.Map<IdentityInfo>(identity));
        }
    }
}
