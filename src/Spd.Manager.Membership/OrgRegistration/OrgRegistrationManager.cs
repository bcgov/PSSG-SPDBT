using AutoMapper;
using MediatR;
using Spd.Resource.Organizations.Org;
using Spd.Resource.Organizations.Registration;
using Spd.Utilities.LogonUser;
using System.Security.Principal;

namespace Spd.Manager.Membership.OrgRegistration
{
    internal class OrgRegistrationManager : 
        IRequestHandler<RegisterOrganizationCommand, Unit>,
        IRequestHandler<CheckOrgRegistrationDuplicateQuery, CheckDuplicateResponse>,
        IOrgRegistrationManager
    {
        private readonly IOrgRegistrationRepository _orgRegRepository;
        private readonly IOrgRepository _orgRepository;
        private readonly IMapper _mapper;
        private readonly IPrincipal _currentUser;
        public OrgRegistrationManager(IOrgRegistrationRepository orgRegRepository,IOrgRepository orgRepository, IMapper mapper, IPrincipal currentUser)
        {
            _orgRegRepository = orgRegRepository;
            _orgRepository = orgRepository;
            _mapper = mapper;
            _currentUser = currentUser;
        }

        public async Task<Unit> Handle(RegisterOrganizationCommand request, CancellationToken cancellationToken)
        {
            var orgRegistration = _mapper.Map<Spd.Resource.Organizations.Registration.OrgRegistration>(request.CreateOrgRegistrationRequest);
            if (_currentUser.IsAuthenticated())
            {
                orgRegistration.IdentityProviderTypeCode = _currentUser.GetIdentityProvider() switch
                {
                    "bceidboth" or "bceidbusiness" or "bceidbasic" => IdentityProviderTypeCode.BusinessBceId,
                    _ => null
                };
                orgRegistration.BCeIDUserGuid = _currentUser.GetUserGuid();
                orgRegistration.BizIdentityGuid = _currentUser.GetBizGuid();
            }
            await _orgRegRepository.AddRegistrationAsync(new CreateOrganizationRegistrationCommand(orgRegistration), cancellationToken);

            return default;
        }

        public async Task<CheckDuplicateResponse> Handle(CheckOrgRegistrationDuplicateQuery request, CancellationToken cancellationToken)
        {
            CheckDuplicateResponse resp = new CheckDuplicateResponse();

            //duplicated in organization
            var searchOrgQry = _mapper.Map<SearchOrgQry>(request.CreateOrgRegistrationRequest);
            bool hasDuplicateInOrg = await _orgRepository.CheckDuplicateAsync(searchOrgQry, cancellationToken);
            if (hasDuplicateInOrg)
            {
                resp.HasPotentialDuplicate = true;
                resp.DuplicateFoundIn = OrgProcess.ExistingOrganization;
                return resp;
            }

            //duplicated in org registration
            var searchQry = _mapper.Map<SearchRegistrationQry>(request.CreateOrgRegistrationRequest);
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
