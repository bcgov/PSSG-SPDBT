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
        IRequestHandler<ApplicantTermAgreeCommand, Unit>,
        IRequestHandler<ApplicantSearchCommand, IEnumerable<ApplicantListResponse>>,
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
            ContactResp? contactResp = null;
            var result = await _idRepository.Query(new IdentityQry(cmd.BcscIdentityInfo.Sub, null, IdentityProviderTypeEnum.BcServicesCard), ct);

            if (result != null && result.Items.Any())
            {
                Identity? id = result.Items.FirstOrDefault();
                if (id?.ContactId != null)
                {
                    //contact exists
                    UpdateContactCmd updateContactCmd = _mapper.Map<UpdateContactCmd>(cmd);
                    updateContactCmd.Id = (Guid)id.ContactId;
                    updateContactCmd.IdentityId = id.Id;
                    contactResp = await _contactRepository.ManageAsync(updateContactCmd, ct);
                    return _mapper.Map<ApplicantLoginResponse>(contactResp);
                }
            }
            //no contact or identity found
            return new ApplicantLoginResponse
            {
                ApplicantId = Guid.Empty,
                FirstName = cmd.BcscIdentityInfo?.FirstName,
                LastName = cmd.BcscIdentityInfo?.LastName,
                IsFirstTimeLogin = true,
                EmailAddress = cmd.BcscIdentityInfo?.Email,
                MiddleName1 = cmd.BcscIdentityInfo?.MiddleName1,
                MiddleName2 = cmd.BcscIdentityInfo?.MiddleName2
            };
        }

        public async Task<Unit> Handle(ApplicantTermAgreeCommand cmd, CancellationToken ct)
        {
            await _contactRepository.ManageAsync(new TermAgreementCmd(cmd.ApplicantId), ct);
            return default;
        }

        public async Task<IEnumerable<ApplicantListResponse>> Handle(ApplicantSearchCommand cmd, CancellationToken ct)
        {
            var results = await _contactRepository.QueryAsync(new ContactQry
            {
                FirstName = cmd.BcscIdentityInfo.FirstName,
                LastName = cmd.BcscIdentityInfo.LastName,
                MiddleName1 = cmd.BcscIdentityInfo.MiddleName1,
                MiddleName2 = cmd.BcscIdentityInfo.MiddleName2,
                BirthDate = cmd.BcscIdentityInfo.BirthDate,
                IncludeInactive = false,
                ReturnLicenceInfo = true,
                IdentityId = Guid.Empty, //mean no identity connected with the contact
            }, ct);

            return _mapper.Map<IEnumerable<ApplicantListResponse>>(results.Items.Where(i => i.LicenceInfos.Any())); //if no licence, no return
        }
    }
}

