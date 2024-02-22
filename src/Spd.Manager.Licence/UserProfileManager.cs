using AutoMapper;
using MediatR;
using Spd.Resource.Repository.Contact;
using Spd.Resource.Repository.Identity;
using Spd.Resource.Repository.Registration;

namespace Spd.Manager.Licence
{
    internal class UserProfileManager :
        IRequestHandler<GetApplicantProfileQuery, ApplicantProfileResponse>,
        IRequestHandler<ManageApplicantProfileCommand, ApplicantProfileResponse>,
        IUserProfileManager
    {

        private readonly IIdentityRepository _idRepository;
        private readonly IContactRepository _contactRepository;
        private readonly IMapper _mapper;

        public UserProfileManager(
            IIdentityRepository idRepository,
            IContactRepository contactRepository,
            IMapper mapper)
        {
            _idRepository = idRepository;
            _mapper = mapper;
            _contactRepository = contactRepository;
        }

        public async Task<ApplicantProfileResponse> Handle(GetApplicantProfileQuery request, CancellationToken ct)
        {
            var result = await _idRepository.Query(new IdentityQry(request.BcscSub, null, IdentityProviderTypeEnum.BcServicesCard), ct);
            return _mapper.Map<ApplicantProfileResponse>(result.Items.FirstOrDefault());
        }

        public async Task<ApplicantProfileResponse> Handle(ManageApplicantProfileCommand cmd, CancellationToken ct)
        {
            ContactResp? contactResp = null;
            var result = await _idRepository.Query(new IdentityQry(cmd.BcscIdentityInfo.Sub, null, IdentityProviderTypeEnum.BcServicesCard), ct);

            if (result == null || !result.Items.Any()) //first time to use system
            {
                //add identity
                var id = await _idRepository.Manage(new CreateIdentityCmd(cmd.BcscIdentityInfo.Sub, null, IdentityProviderTypeEnum.BcServicesCard), ct);
                CreateContactCmd createContactCmd = _mapper.Map<CreateContactCmd>(cmd);
                createContactCmd.IdentityId = id.Id;
                contactResp = await _contactRepository.ManageAsync(createContactCmd, ct);
                ApplicantProfileResponse response = _mapper.Map<ApplicantProfileResponse>(contactResp);
                response.IsFirstTimeLogin = true;
                return response;
            }
            else
            {
                Identity? id = result.Items.FirstOrDefault();
                if (id?.ContactId != null)
                {
                    //depends on requirement, probably update later when user select "yes" in user profile for licensing portal.
                    UpdateContactCmd updateContactCmd = _mapper.Map<UpdateContactCmd>(cmd);
                    updateContactCmd.Id = (Guid)id.ContactId;
                    updateContactCmd.IdentityId = id.Id;
                    contactResp = await _contactRepository.ManageAsync(updateContactCmd, ct);
                }
                else
                {
                    //there is identity, but no contact
                    CreateContactCmd createContactCmd = _mapper.Map<CreateContactCmd>(cmd);
                    createContactCmd.IdentityId = id?.Id;
                    contactResp = await _contactRepository.ManageAsync(createContactCmd, ct);
                }
                return _mapper.Map<ApplicantProfileResponse>(contactResp);
            }
        }
    }
}

