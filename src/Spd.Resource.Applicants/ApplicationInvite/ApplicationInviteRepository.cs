using AutoMapper;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Logging;
using Microsoft.OData.Client;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.Exceptions;
using Spd.Utilities.Shared.ResourceContracts;
using System.Net;

namespace Spd.Resource.Applicants.ApplicationInvite
{
    internal class ApplicationInviteRepository : IApplicationInviteRepository
    {
        private readonly DynamicsContext _dynaContext;
        private readonly IMapper _mapper;
        private readonly ITimeLimitedDataProtector _dataProtector;
        public ApplicationInviteRepository(IDynamicsContextFactory ctx, IMapper mapper, ILogger<ApplicationInviteRepository> logger, IDataProtectionProvider dpProvider)
        {
            _dynaContext = ctx.CreateChangeOverwrite();
            _mapper = mapper;
            _dataProtector = dpProvider.CreateProtector(nameof(ApplicationInvitesCreateCmd)).ToTimeLimitedDataProtector();
        }

        public async Task<ApplicationInviteListResp> QueryAsync(ApplicationInviteQuery query, CancellationToken cancellationToken)
        {
            if (query == null || query.FilterBy?.OrgId == null)
                throw new ArgumentNullException("query.FilterBy.OrgId", "Must query applications by organization id.");

            var invites = _dynaContext.spd_portalinvitations
                    .Where(i => i.spd_invitationtype != null && i.spd_invitationtype == (int)InvitationTypeOptionSet.ScreeningRequest)
                    .Where(i => i._spd_organizationid_value == query.FilterBy.OrgId && i.statecode == DynamicsConstants.StateCode_Active);
            string? filterValue = query.FilterBy.EmailOrNameContains;
            if (!string.IsNullOrWhiteSpace(filterValue))
                invites = invites.Where(i => i.spd_firstname.Contains(filterValue) || i.spd_surname.Contains(filterValue) || i.spd_email.Contains(filterValue));
            if (query.SortBy == null)
                invites = invites.OrderByDescending(a => a.createdon);
            if (query.SortBy != null && query.SortBy.SubmittedDateDesc != null && (bool)query.SortBy.SubmittedDateDesc)
                invites = invites.OrderByDescending(a => a.createdon);
            if (query.SortBy != null && query.SortBy.SubmittedDateDesc != null && !(bool)query.SortBy.SubmittedDateDesc)
                invites = invites.OrderBy(a => a.createdon);
            if (query.Paging != null)
            {
                invites = invites
                    .Skip(query.Paging.Page * query.Paging.PageSize)
                    .Take(query.Paging.PageSize);
            }
            var q = ((DataServiceQuery<spd_portalinvitation>)invites).IncludeCount();
            var result = (QueryOperationResponse<spd_portalinvitation>)await q.ExecuteAsync(cancellationToken);
            var response = new ApplicationInviteListResp();
            response.ApplicationInvites = _mapper.Map<IEnumerable<ApplicationInviteResult>>(result);

            if (query.Paging != null)
            {
                response.Pagination = new PaginationResp();
                response.Pagination.PageSize = query.Paging.PageSize;
                response.Pagination.PageIndex = query.Paging.Page;
                response.Pagination.Length = (int)result.Count;
            }

            return response;
        }

        public async Task AddApplicationInvitesAsync(ApplicationInvitesCreateCmd createInviteCmd, CancellationToken ct)
        {
            account? org = await _dynaContext.GetOrgById(createInviteCmd.OrgId, ct);
            spd_portaluser? user = await _dynaContext.GetUserById(createInviteCmd.CreatedByUserId, ct);

            foreach (var item in createInviteCmd.ApplicationInvites)
            {
                spd_portalinvitation invitation = _mapper.Map<spd_portalinvitation>(item);
                var encryptedInviteId = WebUtility.UrlEncode(_dataProtector.Protect(invitation.spd_portalinvitationid.ToString(), DateTimeOffset.UtcNow.AddDays(SpdConstants.APPLICATION_INVITE_VALID_DAYS)));
                invitation.spd_invitationlink = $"{createInviteCmd.HostUrl}{SpdConstants.APPLICATION_INVITE_LINK}{encryptedInviteId}";
                _dynaContext.AddTospd_portalinvitations(invitation);
                _dynaContext.SetLink(invitation, nameof(spd_portalinvitation.spd_OrganizationId), org);
                _dynaContext.SetLink(invitation, nameof(spd_portalinvitation.spd_PortalUserId), user);
                spd_servicetype? servicetype = _dynaContext.LookupServiceType(item.ServiceType.ToString());
                if (servicetype != null)
                {
                    _dynaContext.SetLink(invitation, nameof(spd_portalinvitation.spd_ServiceTypeId), servicetype);
                }
            }
            await _dynaContext.SaveChangesAsync(ct);
        }

        public async Task DeleteApplicationInvitesAsync(ApplicationInviteDeleteCmd applicationInviteDeleteCmd, CancellationToken cancellationToken)
        {
            spd_portalinvitation? invite = await GetPortalInvitationById(applicationInviteDeleteCmd.OrgId, applicationInviteDeleteCmd.ApplicationInviteId);

            if (invite == null)
                throw new ApiException(HttpStatusCode.BadRequest, "Invalid OrgId or ApplicationInviteId");

            // Inactivate the invite
            invite.statecode = DynamicsConstants.StateCode_Inactive;
            invite.statuscode = DynamicsConstants.StatusCode_Inactive;
            _dynaContext.UpdateObject(invite);

            await _dynaContext.SaveChangesAsync(cancellationToken);
        }

        public async Task<AppInviteVerifyResp> VerifyApplicationInvitesAsync(ApplicationInviteVerifyCmd verifyInviteCmd, CancellationToken ct)
        {
            Guid inviteId;
            try
            {
                string inviteIdStr = _dataProtector.Unprotect(WebUtility.UrlDecode(verifyInviteCmd.InviteEncryptedCode));
                inviteId = Guid.Parse(inviteIdStr);
            }
            catch
            {
                throw new ApiException(HttpStatusCode.Accepted, "The invitation link is no longer valid.");
            }
            var invite = await _dynaContext.spd_portalinvitations
                .Expand(i => i.spd_OrganizationId)
                .Where(i => i.spd_portalinvitationid == inviteId)
                .Where(i => i.spd_invitationtype == (int)InvitationTypeOptionSet.ScreeningRequest)
                .Where(i => i.statecode != DynamicsConstants.StateCode_Inactive)
                .FirstOrDefaultAsync(ct);
            if (invite == null)
                throw new ApiException(HttpStatusCode.Accepted, "The invitation link is no longer valid.");

            //set invite views
            invite.spd_views = (invite.spd_views ?? 0) + 1;
            _dynaContext.UpdateObject(invite);
            await _dynaContext.SaveChangesAsync(ct);
            return _mapper.Map<AppInviteVerifyResp>(invite);
        }

        private async Task<spd_portalinvitation?> GetPortalInvitationById(Guid organizationId, Guid portalInvitationId)
           => await _dynaContext.spd_portalinvitations
                .Where(a => a.spd_portalinvitationid == portalInvitationId && a._spd_organizationid_value == organizationId).SingleOrDefaultAsync();
    }
}
