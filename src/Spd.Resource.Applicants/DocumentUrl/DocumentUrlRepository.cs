using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Resource.Applicants.Application;
using Spd.Utilities.Dynamics;
using Spd.Utilities.FileStorage;
using Spd.Utilities.Shared.Tools;
using Spd.Utilities.TempFileStorage;
using static System.Net.Mime.MediaTypeNames;

namespace Spd.Resource.Applicants.DocumentUrl;
internal class DocumentUrlRepository : IDocumentUrlRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;

    public DocumentUrlRepository(IDynamicsContextFactory ctx, IMapper mapper)
    {
        _context = ctx.Create();
        _mapper = mapper;
    }
    public async Task<DocumentUrlListResp> QueryAsync(DocumentUrlQry qry, CancellationToken ct)
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
        return new DocumentUrlListResp
        {
            Items = _mapper.Map<IEnumerable<DocumentUrlResp>>(result)
        };
    }
    public async Task<DocumentUrlResp> ManageAsync(DocumentUrlCmd cmd, CancellationToken ct)
    {
        return cmd switch
        {
            CreateDocumentUrlCmd c => await DocumentUrlCreateAsync(c, ct),
            _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
        };
    }

    private async Task<DocumentUrlResp> DocumentUrlCreateAsync(CreateDocumentUrlCmd cmd, CancellationToken ct)
    {
        spd_application application = await _context.GetApplicationById(cmd.ApplicationId, ct);
        bcgov_documenturl documenturl = _mapper.Map<bcgov_documenturl>(cmd.TempFile);
        var tag = _context.LookupTag(cmd.DocumentType.ToString());
        documenturl.bcgov_url = $"spd_application/{cmd.ApplicationId}";         
        _context.AddTobcgov_documenturls(documenturl);
        _context.SetLink(documenturl, nameof(documenturl.spd_ApplicationId), application);
        _context.SetLink(documenturl, nameof(documenturl.bcgov_Tag1Id), tag);

        await UploadFileAsync(createApplicationCmd, application.spd_applicationid, documenturl.bcgov_documenturlid, ct);
        await _context.SaveChangesAsync(ct);
        return _mapper.Map<DocumentUrlResp>(documenturl);
    }

    private async Task UploadFileAsync(ApplicationCreateCmd cmd, Guid? applicationId, Guid? docUrlId, CancellationToken ct)
    {
        if (applicationId == null) return;
        if (docUrlId == null) return;
        byte[]? consentFileContent = await _tempFile.HandleQuery(
            new GetTempFileQuery(cmd.ConsentFormTempFile.TempFileKey), ct);
        if (consentFileContent == null) return;

        Utilities.FileStorage.File file = new()
        {
            Content = consentFileContent,
            ContentType = cmd.ConsentFormTempFile.ContentType,
            FileName = cmd.ConsentFormTempFile.FileName,
        };
        FileTag fileTag = new FileTag()
        {
            Tags = new List<Tag>
            {
                new Tag("file-classification", "Unclassified"),
                new Tag("file-tag", DocumentTypeEnum.ApplicantConsentForm.GetDescription())
            }
        };
        await _fileStorage.HandleCommand(new UploadFileCommand(
                    Key: ((Guid)docUrlId).ToString(),
                    Folder: $"spd_application/{applicationId}",
                    File: file,
                    FileTag: fileTag
                    ), ct);
    }
}


