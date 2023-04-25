using AutoMapper;
using MediatR;
using Spd.Resource.Organizations.Org;
using Spd.Resource.Organizations.Registration;
using Spd.Utilities.LogonUser;
using System.Security.Principal;

namespace Spd.Manager.Membership.OrgRegistration
{
    internal class OrgRegistrationManager :
        IRequestHandler<RegisterOrganizationCommand, OrgRegistrationCreateResponse>,
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

            var orgRegistration = _mapper.Map<Spd.Resource.Organizations.Registration.OrgRegistration>(request.CreateOrgRegistrationRequest);
            if (_currentUser.IsAuthenticated())
            {
                orgRegistration.IdentityProviderTypeCode = _currentUser.GetIdentityProvider() switch
                {
                    "bceidboth" or "bceidbusiness" => IdentityProviderTypeCode.BusinessBceId,
                    _ => null
                };
                orgRegistration.BCeIDUserGuid = _currentUser.GetUserGuid();
                orgRegistration.BizIdentityGuid = _currentUser.GetBizGuid();
            }
            await _orgRegRepository.AddRegistrationAsync(new CreateOrganizationRegistrationCommand(orgRegistration), cancellationToken);
            response.CreateSuccess = true;
            return response;
        }

        private async Task<OrgRegistrationCreateResponse> CheckDuplicate(OrgRegistrationCreateRequest request, CancellationToken cancellationToken)
        {
            OrgRegistrationCreateResponse resp = new OrgRegistrationCreateResponse();

            //duplicated in organization
            if (_currentUser.IsAuthenticated())
            {
                var org = await _orgRepository.QueryOrgAsync(new OrgByOrgGuidQry(_currentUser.GetBizGuid()), cancellationToken);
                if(org != null)
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
                var orgReg = await _orgRegRepository.Query(new OrgRegistrationQuery(null, _currentUser.GetBizGuid()), cancellationToken);
                if (orgReg != null)
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
