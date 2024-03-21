using MediatR;
using Spd.Engine.Validation;
using Spd.Resource.Repository.ApplicationInvite;
using Spd.Resource.Repository.Org;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

namespace Spd.Manager.Screening
{
    internal partial class ApplicationManager
    {
        public async Task<ApplicationInvitesCreateResponse> Handle(ApplicationInviteCreateCommand createCmd, CancellationToken ct)
        {
            var org = (OrgQryResult)await _orgRepository.QueryOrgAsync(new OrgByIdentifierQry(createCmd.OrgId), ct);

            // If not a volunteer org or PSSO, then the payee type is required
            if (org != null &&
                org.OrgResult.VolunteerOrganizationTypeCode == null &&
                org.OrgResult.ParentOrgId != SpdConstants.BcGovOrgId &&
                org.OrgResult.Id != SpdConstants.BcGovOrgId)
            {
                if (createCmd.ApplicationInvitesCreateRequest.ApplicationInviteCreateRequests.Any(a => a.PayeeType == null))
                {
                    throw new ApiException(HttpStatusCode.BadRequest, "Payee Type is required");
                }
            }

            ApplicationInvitesCreateResponse resp = new(createCmd.OrgId);
            if (createCmd.ApplicationInvitesCreateRequest.RequireDuplicateCheck)
            {
                var checks = _mapper.Map<IEnumerable<AppInviteDuplicateCheck>>(createCmd.ApplicationInvitesCreateRequest.ApplicationInviteCreateRequests);
                var duplicateResp = (AppInviteDuplicateCheckResponse)await _duplicateCheckEngine.DuplicateCheckAsync(
                    new AppInviteDuplicateCheckRequest(checks, createCmd.OrgId),
                    ct
                    );
                resp.IsDuplicateCheckRequired = createCmd.ApplicationInvitesCreateRequest.RequireDuplicateCheck;
                resp.DuplicateResponses = _mapper.Map<IEnumerable<ApplicationInviteDuplicateResponse>>(duplicateResp.AppInviteCheckResults);
                if (duplicateResp.AppInviteCheckResults.Any(r => r.HasPotentialDuplicate))
                {
                    resp.CreateSuccess = false;
                    return resp;
                }
            }
            var cmd = _mapper.Map<ApplicationInvitesCreateCmd>(createCmd.ApplicationInvitesCreateRequest);
            if (createCmd.IsPSA || org.OrgResult.ParentOrgId == SpdConstants.BcGovOrgId)
                cmd.OrgId = SpdConstants.BcGovOrgId;
            else
                cmd.OrgId = createCmd.OrgId;
            cmd.CreatedByUserId = createCmd.UserId;
            await _applicationInviteRepository.ManageAsync(cmd, ct);
            resp.CreateSuccess = true;
            return resp;
        }
        public async Task<ApplicationInviteListResponse> Handle(ApplicationInviteListQuery request, CancellationToken ct)
        {
            ApplicationInviteQuery query = _mapper.Map<ApplicationInviteQuery>(request);
            if (request.IsPSSO)
            {
                //psso, use parent orgId to filter.
                if (request.IsPSA)
                {
                    //return all psso invites
                    query.FilterBy = new AppInviteFilterBy(null, request.FilterBy?.EmailOrNameContains, SpdConstants.BcGovOrgId);
                }
                else
                {
                    //return all created by invites.
                    query.FilterBy = new AppInviteFilterBy(null, request.FilterBy?.EmailOrNameContains, SpdConstants.BcGovOrgId, CreatedByUserId: request.UserId);
                }
            }
            var response = await _applicationInviteRepository.QueryAsync(
                query,
                ct);
            return _mapper.Map<ApplicationInviteListResponse>(response);
        }
        public async Task<Unit> Handle(ApplicationInviteDeleteCommand request, CancellationToken ct)
        {
            var cmd = _mapper.Map<ApplicationInviteUpdateCmd>(request);
            cmd.ApplicationInviteStatusEnum = ApplicationInviteStatusEnum.Cancelled;
            await _applicationInviteRepository.ManageAsync(cmd, ct);
            return default;
        }
        public async Task<AppOrgResponse> Handle(ApplicationInviteVerifyCommand request, CancellationToken ct)
        {
            var result = await _applicationInviteRepository.VerifyApplicationInvitesAsync(
                 new ApplicationInviteVerifyCmd(request.AppInvitesVerifyRequest.InviteEncryptedCode),
                 ct);
            return _mapper.Map<AppOrgResponse>(result);
        }
    }
}