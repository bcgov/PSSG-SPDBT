using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Logging;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Applicants
{
    internal class ApplicationRepository : IApplicationRepository
    {
        private readonly DynamicsContext _dynaContext;
        private readonly IMapper _mapper;
        private readonly ILogger<ApplicationRepository> _logger;
        public ApplicationRepository(IDynamicsContextFactory ctx, IMapper mapper, ILogger<ApplicationRepository> logger)
        {
            _dynaContext = ctx.CreateChangeOverwrite();
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<bool> AddApplicationInvitesAsync(ApplicationInviteCreateCmd createInviteCmd, CancellationToken cancellationToken)
        {
            foreach (var item in createInviteCmd.ApplicationInviteCreateReqs)
            {
                spd_portalinvitation invitation = _mapper.Map<spd_portalinvitation>(item);
                _dynaContext.AddTospd_portalinvitations(invitation);
                await _dynaContext.SaveChangesAsync(cancellationToken);
            }
            return true;
        }

        public async Task<bool> CheckInviteDuplicateAsync(SearchInvitationQry searchInvitationQry, CancellationToken cancellationToken)
        {
            var orginvitation = _dynaContext.spd_portalinvitations.Where(o =>
                //o.spd_OrganizationId.accountid == searchInvitationQry.OrgSpdId &&
                o.spd_firstname == searchInvitationQry.FirstName &&
                o.spd_surname == searchInvitationQry.LastName &&
                o.statecode != DynamicsConstants.StateCode_Inactive
            ).FirstOrDefault();
            return orginvitation != null;
        }
    }
}
