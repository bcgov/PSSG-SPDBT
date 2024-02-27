using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using Spd.Resource.Repository.Contact;
using Spd.Resource.Repository.Identity;
using Spd.Resource.Repository.Registration;

namespace Spd.Manager.Licence
{
    internal class ApplicantProfileManager :
        IRequestHandler<GetApplicantProfileQuery, ApplicantProfileResponse>,
        IRequestHandler<ApplicantLoginCommand, ApplicantLoginResponse>,
        IApplicantProfileManager
    {
        private readonly IIdentityRepository _idRepository;
        private readonly IContactRepository _contactRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<IApplicantProfileManager> _logger;

        public ApplicantProfileManager(
            IIdentityRepository idRepository,
            IContactRepository contactRepository,
            IMapper mapper,
            ILogger<IApplicantProfileManager> logger)
        {
            _idRepository = idRepository;
            _mapper = mapper;
            _logger = logger;
            _contactRepository = contactRepository;
        }

        public async Task<ApplicantProfileResponse> Handle(GetApplicantProfileQuery request, CancellationToken ct)
        {
            var result = await _contactRepository.GetAsync(request.ApplicantId, ct);
            //todo: add read document here.
            //only get document for mental health and police officer.
            return _mapper.Map<ApplicantProfileResponse>(result);
        }

        public async Task<ApplicantLoginResponse> Handle(ApplicantLoginCommand cmd, CancellationToken ct)
        {
            ContactResp contactResp = null;
            var result = await _idRepository.Query(new IdentityQry(cmd.BcscIdentityInfo.Sub, null, IdentityProviderTypeEnum.BcServicesCard), ct);

            if (result == null || !result.Items.Any()) //first time to use system
            {
                //add identity
                var id = await _idRepository.Manage(new CreateIdentityCmd(cmd.BcscIdentityInfo.Sub, null, IdentityProviderTypeEnum.BcServicesCard), ct);
                CreateContactCmd createContactCmd = _mapper.Map<CreateContactCmd>(cmd);
                createContactCmd.IdentityId = id.Id;
                createContactCmd.Source = SourceEnum.LICENSING;
                contactResp = await _contactRepository.ManageAsync(createContactCmd, ct);
            }
            else
            {
                Identity? id = result.Items.FirstOrDefault();
                if (id?.ContactId != null)
                {
                    //contact exists
                    UpdateContactCmd updateContactCmd = _mapper.Map<UpdateContactCmd>(cmd);
                    updateContactCmd.Id = (Guid)id.ContactId;
                    updateContactCmd.IdentityId = id.Id;
                    updateContactCmd.Source = SourceEnum.LICENSING;
                    contactResp = await _contactRepository.ManageAsync(updateContactCmd, ct);
                }
                else
                {
                    //there is identity, but no contact
                    CreateContactCmd createContactCmd = _mapper.Map<CreateContactCmd>(cmd);
                    createContactCmd.IdentityId = id.Id;
                    createContactCmd.Source = SourceEnum.LICENSING;
                    contactResp = await _contactRepository.ManageAsync(createContactCmd, ct);
                }
            }

            return _mapper.Map<ApplicantLoginResponse>(contactResp);
        }
    }
}

