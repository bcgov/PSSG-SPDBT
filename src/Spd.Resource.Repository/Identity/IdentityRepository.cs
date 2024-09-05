using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Logging;
using Spd.Resource.Repository.Registration;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.Identity
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

        public async Task<IdentityQueryResult> Query(IdentityQry query, CancellationToken ct)
        {
            return query switch
            {
                IdentityQry q => await HandleIdentityQry(q, ct),
                _ => throw new NotSupportedException($"{query.GetType().Name} is not supported")
            };
        }

        public async Task<IdentityCmdResult?> Manage(IdentityCmd cmd, CancellationToken ct)
        {
            return cmd switch
            {
                CreateIdentityCmd c => await HandleCreateIdentityCmd(c, ct),
                _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
            };
        }

        private async Task<IdentityQueryResult> HandleIdentityQry(IdentityQry qry, CancellationToken ct)
        {
            IQueryable<spd_identity> identities;
            if (qry.IdentityProviderType != null && qry.IdentityProviderType == IdentityProviderType.BcServicesCard)
            {
                identities = _dynaContext.spd_identities.Expand(i => i.spd_ContactId);
            }
            else
            {
                identities = _dynaContext.spd_identities;
            }

            if (qry.IdentityProviderType != null)
            {
                int type = (int)Enum.Parse<IdentityTypeOptionSet>(qry.IdentityProviderType.ToString());
                identities = identities.Where(i => i.spd_type == type);
            }

            if (!qry.includeInactive) identities = identities.Where(i => i.statecode == DynamicsConstants.StateCode_Active);
            if (qry.UserGuid != null) identities = identities.Where(i => i.spd_userguid == qry.UserGuid);
            if (qry.OrgGuid != null) identities = identities.Where(i => i.spd_orgguid == qry.OrgGuid.ToString());


            return new IdentityQueryResult(_mapper.Map<IEnumerable<Identity>>(identities.ToList()));
        }

        private async Task<IdentityCmdResult> HandleCreateIdentityCmd(CreateIdentityCmd cmd, CancellationToken ct)
        {
            spd_identity identity = _mapper.Map<spd_identity>(cmd);
            _dynaContext.AddTospd_identities(identity);
            await _dynaContext.SaveChangesAsync(ct);

            return _mapper.Map<IdentityCmdResult>(identity);
        }
    }
}
