using AutoMapper;
using MediatR;
using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.Org;
using Spd.Resource.Repository.Registration;
using Spd.Utilities.LogonUser;
using Spd.Utilities.Shared.Exceptions;
using System.Net;
using System.Security.Principal;

namespace Spd.Manager.Screening
{
    internal class OrgRegistrationManager :
        IRequestHandler<RegisterOrganizationCommand, OrgRegistrationCreateResponse>,
        IRequestHandler<GetOrgRegistrationStatusQuery, OrgRegistrationPortalStatusResponse>,
        IOrgRegistrationManager
    {
        private readonly IOrgRegistrationRepository _orgRegRepository;
        private readonly IOrgRepository _orgRepository;
        private readonly IMapper _mapper;
        private readonly IPrincipal _currentUser;
        public OrgRegistrationManager(IOrgRegistrationRepository orgRegRepository, IOrgRepository orgRepository, IMapper mapper, IPrincipal currentUser)
        {
            _orgRegRepository = orgRegRepository;
            _orgRepository = orgRepository;
            _mapper = mapper;
            _currentUser = currentUser;
        }

        public async Task<OrgRegistrationCreateResponse> Handle(RegisterOrganizationCommand request, CancellationToken cancellationToken)
        {
            OrgRegistrationCreateResponse response = null;
            if (request.CreateOrgRegistrationRequest.RequireDuplicateCheck)
            {
                response = await CheckDuplicate(request.CreateOrgRegistrationRequest, cancellationToken);
                response.IsDuplicateCheckRequired = true;
                if (response.HasPotentialDuplicate != null && (bool)response.HasPotentialDuplicate)
                {
                    response.CreateSuccess = false;
                    return response;
                }
            }

            if (response == null)
                response = new OrgRegistrationCreateResponse();

            var orgRegistration = _mapper.Map<Spd.Resource.Repository.Registration.OrgRegistration>(request.CreateOrgRegistrationRequest);
            if (_currentUser.IsAuthenticated())
            {
                var userIdentityInfo = _currentUser.GetBceidUserIdentityInfo();
                orgRegistration.IdentityProviderTypeCode = _currentUser.GetIdentityProvider() switch
                {
                    "bceidboth" or "bceidbusiness" => IdentityProviderType.BusinessBceId,
                    _ => null
                };
                orgRegistration.BCeIDUserGuid = userIdentityInfo.UserGuid;
                orgRegistration.BizIdentityGuid = userIdentityInfo.BizGuid;
            }
            await _orgRegRepository.AddRegistrationAsync(new CreateOrganizationRegistrationCommand(orgRegistration, request.HostUrl), cancellationToken);
            response.CreateSuccess = true;
            return response;
        }

        public async Task<OrgRegistrationPortalStatusResponse> Handle(GetOrgRegistrationStatusQuery query, CancellationToken cancellationToken)
        {
            var result = await _orgRegRepository.Query(new OrgRegistrationQuery(null, null, query.RegistrationNumber, true), cancellationToken);
            if (result == null || !result.OrgRegistrationResults.Any())
                throw new ApiException(HttpStatusCode.BadRequest, "Cannot find registration with the registration number.");
            var statusCode = result.OrgRegistrationResults.First().OrgRegistrationStatusStr switch
            {
                "New" => OrgRegistrationStatusCode.ApplicationSubmitted,
                "InProgress" => OrgRegistrationStatusCode.InProgress,
                "AwaitingOrganization" => OrgRegistrationStatusCode.InProgress,
                "Approved" => OrgRegistrationStatusCode.CompleteSuccess,
                "Cancelled" => OrgRegistrationStatusCode.CompleteFailed,
                _ => OrgRegistrationStatusCode.CompleteFailed,
            };
            return new OrgRegistrationPortalStatusResponse(statusCode);
        }

        private async Task<OrgRegistrationCreateResponse> CheckDuplicate(OrgRegistrationCreateRequest request, CancellationToken cancellationToken)
        {
            OrgRegistrationCreateResponse resp = new OrgRegistrationCreateResponse();
            var userIdentityInfo = _currentUser.GetBceidUserIdentityInfo();

            //duplicated in organization
            if (_currentUser.IsAuthenticated())
            {
                var org = (OrgsQryResult)await _orgRepository.QueryOrgAsync(
                    new OrgsQry(userIdentityInfo.BizGuid, ServiceTypes: IApplicationRepository.ScreeningServiceTypes),
                    cancellationToken);
                if (org != null && org.OrgResults.Any())
                {
                    resp.HasPotentialDuplicate = true;
                    resp.DuplicateFoundIn = OrgProcess.ExistingOrganization;
                    return resp;
                }
            }
            var searchOrgQry = _mapper.Map<SearchOrgQry>(request);
            bool hasDuplicateInOrg = await _orgRepository.CheckDuplicateAsync(searchOrgQry, cancellationToken);
            if (hasDuplicateInOrg)
            {
                resp.HasPotentialDuplicate = true;
                resp.DuplicateFoundIn = OrgProcess.ExistingOrganization;
                return resp;
            }

            //duplicated in org registration
            if (_currentUser.IsAuthenticated())
            {
                var orgReg = await _orgRegRepository.Query(new OrgRegistrationQuery(null, userIdentityInfo.BizGuid), cancellationToken);
                if (orgReg != null && orgReg.OrgRegistrationResults.Any())
                {
                    resp.HasPotentialDuplicate = true;
                    resp.DuplicateFoundIn = OrgProcess.Registration;
                    return resp;
                }
            }
            var searchQry = _mapper.Map<SearchRegistrationQry>(request);
            bool hasDuplicateInOrgReg = await _orgRegRepository.CheckDuplicateAsync(searchQry, cancellationToken);
            if (hasDuplicateInOrgReg)
            {
                resp.HasPotentialDuplicate = true;
                resp.DuplicateFoundIn = OrgProcess.Registration;
            }

            return resp;
        }


    }
}
