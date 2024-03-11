using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using Spd.Resource.Repository.Contact;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.Identity;
using Spd.Resource.Repository.LicenceApplication;
using Spd.Resource.Repository.LicenceFee;
using Spd.Resource.Repository.Registration;

namespace Spd.Manager.Licence
{
    internal class ApplicantProfileManager :
        LicenceAppManagerBase,
        IRequestHandler<GetApplicantProfileQuery, ApplicantProfileResponse>,
        IRequestHandler<ApplicantLoginCommand, ApplicantLoginResponse>,
        IRequestHandler<ApplicantTermAgreeCommand, Unit>,
        IRequestHandler<ApplicantSearchCommand, IEnumerable<ApplicantListResponse>>,
        IRequestHandler<ApplicantUpdateCommand, Unit>,
        IApplicantProfileManager
    {
        private readonly IIdentityRepository _idRepository;
        private readonly IContactRepository _contactRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<IApplicantProfileManager> _logger;
        private readonly IDocumentRepository _documentRepository;

        public ApplicantProfileManager(
            IIdentityRepository idRepository,
            IContactRepository contactRepository,
            IMapper mapper,
            ILogger<IApplicantProfileManager> logger,
            IDocumentRepository documentRepository,
            ILicenceFeeRepository feeRepository,
            ILicenceApplicationRepository licenceAppRepository) : base(mapper, documentRepository, feeRepository, licenceAppRepository)
        {
            _idRepository = idRepository;
            _mapper = mapper;
            _logger = logger;
            _contactRepository = contactRepository;
            _documentRepository = documentRepository;
        }

        public async Task<ApplicantProfileResponse> Handle(GetApplicantProfileQuery request, CancellationToken ct)
        {
            var response = await _contactRepository.GetAsync(request.ApplicantId, ct);
            ApplicantProfileResponse result = _mapper.Map<ApplicantProfileResponse>(response);

            var existingDocs = await _documentRepository.QueryAsync(new DocumentQry(ApplicantId: request.ApplicantId), ct);
            result.DocumentInfos = _mapper.Map<Document[]>(existingDocs.Items).Where(d => d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.MentalHealthCondition ||
                d.LicenceDocumentTypeCode == LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict).ToList();

            return result;
        }

        public async Task<ApplicantLoginResponse> Handle(ApplicantLoginCommand cmd, CancellationToken ct)
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
                    contactResp = await _contactRepository.ManageAsync(updateContactCmd, ct);
                }
                else
                {
                    //there is identity, but no contact
                    CreateContactCmd createContactCmd = _mapper.Map<CreateContactCmd>(cmd);
                    createContactCmd.IdentityId = id.Id;
                    contactResp = await _contactRepository.ManageAsync(createContactCmd, ct);
                }
            }
            return _mapper.Map<ApplicantLoginResponse>(contactResp);
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

        public async Task<Unit> Handle(ApplicantUpdateCommand cmd, CancellationToken ct)
        {
            ContactResp contact = await _contactRepository.GetAsync(cmd.ApplicantId, ct);

            UpdateContactCmd updateContactCmd = _mapper.Map<UpdateContactCmd>(cmd.ApplicantUpdateRequest);
            updateContactCmd.Id = contact.Id;
            await _contactRepository.ManageAsync(updateContactCmd, ct);

            if ((cmd.ApplicantUpdateRequest.IsTreatedForMHC.Value && cmd.LicAppFileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.MentalHealthCondition)) || 
                (cmd.ApplicantUpdateRequest.IsPoliceOrPeaceOfficer.Value && cmd.LicAppFileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict)))
                await UploadNewDocsAsync(null,
                    cmd.LicAppFileInfos,
                    null,
                    contact.Id,
                    null,
                    null,
                    null,
                    ct);

            // Remove documents that are not in previous document ids
            DocumentListResp docListResps = await _documentRepository.QueryAsync(new DocumentQry(ApplicantId: cmd.ApplicantId), ct);
            List<Guid> previousDocumentIds = (List<Guid>)cmd.ApplicantUpdateRequest?.PreviousDocumentIds ?? [];
            List<Guid> documentsToRemove = docListResps.Items
                .Where(d => !previousDocumentIds.Contains(d.DocumentUrlId) && (d.DocumentType == DocumentTypeEnum.MentalHealthConditionForm || d.DocumentType == DocumentTypeEnum.LetterOfNoConflict))
                .Select(d => d.DocumentUrlId)
                .ToList();
            
            foreach (var documentUrlId in documentsToRemove)
                await _documentRepository.ManageAsync(new RemoveDocumentCmd(documentUrlId), ct);

            return default;
        }
    }
}
