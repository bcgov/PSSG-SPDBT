using AutoMapper;
using Microsoft.Extensions.Logging;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Exceptions;

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
                UserIdentityQuery q => await HandleUserIdentityQuery(q, ct),
                ApplicantIdentityQuery q => await HandleApplicantIdentityQuery(q, ct),
                _ => throw new NotSupportedException($"{query.GetType().Name} is not supported")
            };
        }
        private async Task<UserIdentityQueryResult?> HandleUserIdentityQuery(UserIdentityQuery queryRequest, CancellationToken ct)
        {
            var identities = _dynaContext.spd_identities
                .Where(i => i.spd_userguid == queryRequest.UserGuid.ToString())
                .Where(i => i.statecode == DynamicsConstants.StateCode_Active);

            if (queryRequest.OrgGuid != null)
            {
                identities = identities
                    .Where(i => i.spd_orgguid == queryRequest.OrgGuid.ToString());
            }

            return new UserIdentityQueryResult(_mapper.Map<IEnumerable<Identity>>(identities.ToList()));
        }

        private async Task<ApplicantIdentityQueryResult> HandleApplicantIdentityQuery(ApplicantIdentityQuery queryRequest, CancellationToken ct)
        {
            var applicantIdentity = await _dynaContext.spd_identities
                .Expand(i => i.spd_ContactId)
                .Where(i => i.spd_userguid == queryRequest.UserGuid)
                .Where(i => i.spd_type == (int)IdentityTypeOptionSet.BcServicesCard)
                .Where(i => i.statecode == DynamicsConstants.StateCode_Active)
                .FirstOrDefaultAsync(ct);

            if (applicantIdentity == null)
            {
                throw new ApiException(System.Net.HttpStatusCode.Unauthorized, "Applicant is not found");
            }

            return _mapper.Map<ApplicantIdentityQueryResult>(applicantIdentity);
        }
    }
}
