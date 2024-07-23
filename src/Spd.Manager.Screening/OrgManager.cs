using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.Caching.Distributed;
using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.Org;
using Spd.Utilities.Cache;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

namespace Spd.Manager.Screening
{
    internal class OrgManager :
        IRequestHandler<OrgUpdateCommand, OrgResponse>,
        IRequestHandler<OrgGetQuery, OrgResponse>,
        IRequestHandler<OrgInvitationLinkCreateCommand, OrgInvitationLinkResponse>,
        IRequestHandler<OrgInvitationLinkVerifyCommand, OrgInviteVerifyResponse>,
        IOrgManager
    {
        private readonly IOrgRepository _orgRepository;
        private readonly IMapper _mapper;
        private readonly IDistributedCache _cache;
        private readonly ITimeLimitedDataProtector _dataProtector;

        public OrgManager(IOrgRepository orgRepository, IMapper mapper, IDistributedCache cache, IDataProtectionProvider dpProvider)
        {
            _orgRepository = orgRepository;
            _mapper = mapper;
            _cache = cache;
            _dataProtector = dpProvider.CreateProtector(nameof(OrgInvitationLinkCreateCommand)).ToTimeLimitedDataProtector();
        }

        public async Task<OrgResponse> Handle(OrgUpdateCommand request, CancellationToken cancellationToken)
        {
            var updateOrg = _mapper.Map<Resource.Repository.Org.Org>(request.OrgUpdateRequest);
            var result = await _orgRepository.ManageOrgAsync(new OrgUpdateCmd(updateOrg), cancellationToken);
            return _mapper.Map<OrgResponse>(result.Org);
        }

        public async Task<OrgResponse?> Handle(OrgGetQuery request, CancellationToken cancellationToken)
        {
            OrgResponse response;
            if (request.AccessCode != null)
            {
                response = await _cache.Get<OrgResponse>($"org-response-{request.AccessCode}");
                if (response != null) return response;
            }
            var result = (OrgQryResult)await _orgRepository.QueryOrgAsync(new OrgByIdentifierQry(request.OrgId, request.AccessCode), cancellationToken);
            if (result == null) return null;

            response = _mapper.Map<OrgResponse>(result.OrgResult);
            await _cache.Set<OrgResponse>($"org-response-{response.AccessCode}", response, new TimeSpan(0, 30, 0));
            return response;
        }

        public async Task<OrgInvitationLinkResponse?> Handle(OrgInvitationLinkCreateCommand cmd, CancellationToken cancellationToken)
        {
            OrgQryResult org = (OrgQryResult)await _orgRepository.QueryOrgAsync(new OrgByIdentifierQry(cmd.OrgId), cancellationToken);
            if (org == null)
                throw new ApiException(HttpStatusCode.BadRequest, "Organization does not exist.");

            //business said we just use the same value as user invite valid days
            var encryptedOrgId = WebUtility.UrlEncode(_dataProtector.Protect(cmd.OrgId.ToString(), DateTimeOffset.UtcNow.AddDays(SpdConstants.UserInviteValidDays)));

            if (org.OrgResult.ServiceTypes.Any(s => IApplicationRepository.ScreeningServiceTypes.Contains(s)))
            {
                //if it is screening org
                return new OrgInvitationLinkResponse($"{cmd.ScreeningAppOrgUrl}/{encryptedOrgId}");
            }
            return null;
        }

        public async Task<OrgInviteVerifyResponse?> Handle(OrgInvitationLinkVerifyCommand cmd, CancellationToken cancellationToken)
        {
            Guid orgId;
            try
            {
                string orgIdStr = _dataProtector.Unprotect(WebUtility.UrlDecode(cmd.EncodedOrgId));
                orgId = Guid.Parse(orgIdStr);
            }
            catch
            {
                return new OrgInviteVerifyResponse(null, false, "the link is not valid");
            }

            OrgQryResult org = (OrgQryResult)await _orgRepository.QueryOrgAsync(new OrgByIdentifierQry(orgId), cancellationToken);
            if (!org.OrgResult.ServiceTypes.Any(s => IApplicationRepository.ScreeningServiceTypes.Contains(s)))
            {
                //if it is not a screening org
                return new OrgInviteVerifyResponse(null, false, "the organization is not a screening org");
            }

            return new OrgInviteVerifyResponse(orgId, true);
        }
    }
}
