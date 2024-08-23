using AutoMapper;
using MediatR;
using Spd.Resource.Repository.BizLicApplication;
using Spd.Resource.Repository.ControllingMemberCrcApplication;
using Spd.Resource.Repository.Document;
using Spd.Manager.Licence;
using Spd.Utilities.Shared.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Spd.Resource.Repository.LicenceFee;
using Spd.Resource.Repository.Licence;
using Spd.Utilities.FileStorage;
using Spd.Resource.Repository.LicApp;

namespace Spd.Manager.Licence;
internal class ControllingMemberCrcAppManager : 
    LicenceAppManagerBase,
    IRequestHandler<ControllingMemberCrcAppSubmitRequestCommand, ControllingMemberCrcAppCommandResponse>,
    IControllingMemberCrcAppManager
{
    private readonly IControllingMemberCrcRepository _controllingMemberCrcRepository;

    public ControllingMemberCrcAppManager(IMapper mapper, 
        IDocumentRepository documentRepository, 
        ILicenceFeeRepository feeRepository, 
        ILicenceRepository licenceRepository, 
        IMainFileStorageService mainFileService, 
        ITransientFileStorageService transientFileService,
        IControllingMemberCrcRepository controllingMemberCrcRepository,
        ILicAppRepository licAppRepository) : base(
            mapper, 
            documentRepository, 
            feeRepository, 
            licenceRepository, 
            mainFileService, 
            transientFileService, 
            licAppRepository)
    {
        _controllingMemberCrcRepository = controllingMemberCrcRepository;
    }
    public async Task<ControllingMemberCrcAppCommandResponse> Handle(ControllingMemberCrcAppSubmitRequestCommand cmd, CancellationToken ct)
    {

        ControllingMemberCrcAppSubmitRequest request = cmd.ControllingMemberCrcAppSubmitRequest;
        ValidateFilesForNewApp(cmd);

        //save the application
        CreateControllingMemberCrcAppCmd createApp = _mapper.Map<CreateControllingMemberCrcAppCmd>(request);
        createApp.UploadedDocumentEnums = GetUploadedDocumentEnums(cmd.LicAppFileInfos, new List<LicAppFileInfo>());

        var response = await _controllingMemberCrcRepository.CreateControllingMemberCrcApplicationAsync(createApp, ct);
        
        await UploadNewDocsAsync(request.DocumentExpiredInfos, cmd.LicAppFileInfos, response.ControllingMemberCrcAppId, response.ContactId, null, null, null, null, null, ct);
        
        return new ControllingMemberCrcAppCommandResponse
        {
            ControllingMemberAppId = response.ControllingMemberCrcAppId
        };
    }
    private static void ValidateFilesForNewApp(ControllingMemberCrcAppSubmitRequestCommand cmd)
    {
        ControllingMemberCrcAppSubmitRequest request = cmd.ControllingMemberCrcAppSubmitRequest;
        IEnumerable<LicAppFileInfo> fileInfos = cmd.LicAppFileInfos;
        if (request.IsPoliceOrPeaceOfficer == true &&
            !fileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing PoliceBackgroundLetterOfNoConflict file");
        }

        if (request.IsTreatedForMHC == true &&
            !fileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.MentalHealthCondition))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing MentalHealthCondition file");
        }

        if (request.IsCanadianCitizen == true &&
            !fileInfos.Any(f => LicenceAppDocumentManager.CitizenshipProofCodes.Contains(f.LicenceDocumentTypeCode)))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing citizen proof file because you are canadian.");
        }
        
        if (request.IsCanadianCitizen == false &&
            fileInfos.Count(f => LicenceAppDocumentManager.GovernmentIssuedPhotoId_NoCitizens.Contains(f.LicenceDocumentTypeCode)) < 2)
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing government issued Id wth photo file because you are not canadian.");
        }

        if (!fileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.ProofOfFingerprint))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing ProofOfFingerprint file.");
        }

        if (!fileInfos.Any(f => f.LicenceDocumentTypeCode == LicenceDocumentTypeCode.PhotoOfYourself))
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Missing PhotoOfYourself file");
        }
    }

}
