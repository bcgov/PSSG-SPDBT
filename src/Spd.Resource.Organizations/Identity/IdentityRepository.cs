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

        public IdentityRepository(IDynamicsContextFactory ctx, IMapper mapper, ILogger<IdentityRepository> logger)
        {
            _dynaContext = ctx.Create();
            _mapper = mapper;
        }

        public async Task<IdentityQueryResult?> Query(IdentityQuery query, CancellationToken ct)
        {
            return query switch
            {
                IdentityQuery q => await HandleQuery(q, ct),
                _ => throw new NotSupportedException($"{query.GetType().Name} is not supported")
            };
        }
        private async Task<IdentityQueryResult?> HandleQuery(IdentityQuery queryRequest, CancellationToken ct)
        {
            var identities = _dynaContext.spd_identities
                .Where(i => i.spd_userguid == queryRequest.UserGuid.ToString())
                .Where(i => i.statecode == DynamicsConstants.StateCode_Active);

            if (queryRequest.OrgGuid != null)
            {
                identities = identities
                    .Where(i => i.spd_orgguid == queryRequest.OrgGuid.ToString());
            }

            return new IdentityQueryResult(_mapper.Map<IEnumerable<Identity>>(identities.ToList()));
        }
    }
}
