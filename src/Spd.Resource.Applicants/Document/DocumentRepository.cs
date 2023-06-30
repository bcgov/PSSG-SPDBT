using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Resource.Applicants.Application;
using Spd.Utilities.Dynamics;
using Spd.Utilities.FileStorage;
using Spd.Utilities.Shared.Tools;
using Spd.Utilities.TempFileStorage;

namespace Spd.Resource.Applicants.Document;
internal class DocumentRepository : IDocumentRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;
    private readonly IFileStorageService _fileStorageService;
    private readonly ITempFileStorageService _tempFileService;

    public DocumentRepository(IDynamicsContextFactory ctx,
        IMapper mapper,
        IFileStorageService fileStorageService,
        ITempFileStorageService tempFileService)
    {
        _context = ctx.Create();
        _mapper = mapper;
        _fileStorageService = fileStorageService;
        _tempFileService = tempFileService;
    }
    public async Task<DocumentListResp> QueryAsync(DocumentQry qry, CancellationToken ct)
    {
        var documents = _context.bcgov_documenturls.Where(d => d.statecode != DynamicsConstants.StateCode_Inactive);
        if (qry.ApplicantId != null)
            documents = documents.Where(d => d._spd_submittedbyid_value == qry.ApplicantId);

        if (qry.ApplicationId != null)
            documents = documents.Where(d => d._spd_applicationid_value == qry.ApplicationId);

        if (qry.ClearanceId != null)
            documents = documents.Where(d => d._spd_clearanceid_value == qry.ClearanceId);

        if (qry.ReportId != null)
            documents = documents.Where(d => d._spd_pdfreportid_value == qry.ReportId);

        if (qry.FileType != null)
        {
            DynamicsContextLookupHelpers.BcGovTagDictionary.TryGetValue(qry.FileType.ToString(), out Guid tagId);
            documents = documents.Where(d => d._bcgov_tag1id_value == tagId || d._bcgov_tag2id_value == tagId || d._bcgov_tag3id_value == tagId);
        }

        var result = await documents.GetAllPagesAsync(ct);
        return new DocumentListResp
        {
            Items = _mapper.Map<IEnumerable<DocumentResp>>(result)
        };
    }
    public async Task<DocumentResp> ManageAsync(DocumentCmd cmd, CancellationToken ct)
    {
        return cmd switch
        {
            CreateDocumentCmd c => await DocumentCreateAsync(c, ct),
            _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
        };
    }

    private async Task<DocumentResp> DocumentCreateAsync(CreateDocumentCmd cmd, CancellationToken ct)
    {
        spd_application? application = await _context.GetApplicationById(cmd.ApplicationId, ct);
        if (application == null)
            throw new ArgumentException("invalid application id");

        bcgov_documenturl documenturl = _mapper.Map<bcgov_documenturl>(cmd.TempFile);
        var tag = _context.LookupTag(cmd.DocumentType.ToString());
        documenturl.bcgov_url = $"spd_application/{cmd.ApplicationId}";
        _context.AddTobcgov_documenturls(documenturl);
        _context.SetLink(documenturl, nameof(documenturl.spd_ApplicationId), application);
        _context.SetLink(documenturl, nameof(documenturl.bcgov_Tag1Id), tag);
        if (cmd.SubmittedByApplicantId != null)
        {
            contact? contact = await _context.GetContactById((Guid)cmd.SubmittedByApplicantId, ct);
            _context.SetLink(documenturl, nameof(documenturl.spd_SubmittedById), contact);
        }

        await UploadFileAsync(cmd.TempFile, application.spd_applicationid, documenturl.bcgov_documenturlid, cmd.DocumentType, ct);
        await _context.SaveChangesAsync(ct);
        documenturl._spd_applicationid_value = application.spd_applicationid;
        return _mapper.Map<DocumentResp>(documenturl);
    }

    private async Task UploadFileAsync(SpdTempFile tempFile, Guid? applicationId, Guid? docUrlId, DocumentTypeEnum documentType, CancellationToken ct)
    {
        if (applicationId == null) return;
        if (docUrlId == null) return;
        byte[]? consentFileContent = await _tempFileService.HandleQuery(
            new GetTempFileQuery(tempFile.TempFileKey), ct);
        if (consentFileContent == null) return;

        Utilities.FileStorage.File file = new()
        {
            Content = consentFileContent,
            ContentType = tempFile.ContentType,
            FileName = tempFile.FileName,
        };
        FileTag fileTag = new FileTag()
        {
            Tags = new List<Tag>
            {
                new Tag("file-classification", "Unclassified"),
                new Tag("file-tag", documentType.GetDescription())
            }
        };
        await _fileStorageService.HandleCommand(new UploadFileCommand(
                    Key: ((Guid)docUrlId).ToString(),
                    Folder: $"spd_application/{applicationId}",
                    File: file,
                    FileTag: fileTag
                    ), ct);
    }
}


