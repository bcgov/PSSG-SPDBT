using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Resource.Applicants.Application;
using Spd.Utilities.Dynamics;
using Spd.Utilities.FileStorage;
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

        if (qry.CaseId != null)
            documents = documents.Where(d => d._bcgov_caseid_value == qry.CaseId);

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
        result = result.OrderByDescending(a => a.createdon);

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
            RemoveDocumentCmd c => await DocumentRemoveAsync(c, ct),
            ReactivateDocumentCmd c => await DocumentReactivateAsync(c, ct),
            UpdateDocumentCmd c => await DocumentUpdateAsync(c, ct),
            _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
        };
    }

    private async Task<DocumentResp> DocumentReactivateAsync(ReactivateDocumentCmd cmd, CancellationToken ct)
    {
        bcgov_documenturl? documenturl = _context.bcgov_documenturls.Where(d => d.bcgov_documenturlid == cmd.DocumentUrlId).FirstOrDefault();
        if (documenturl == null) { return null; }
        documenturl.statecode = DynamicsConstants.StateCode_Active;
        documenturl.statuscode = DynamicsConstants.StatusCode_Active;
        _context.UpdateObject(documenturl);
        await _context.SaveChangesAsync(ct);
        return _mapper.Map<DocumentResp>(documenturl);
    }

    private async Task<DocumentResp> DocumentCreateAsync(CreateDocumentCmd cmd, CancellationToken ct)
    {
        spd_application? application = await _context.GetApplicationById(cmd.ApplicationId, ct);
        if (application == null)
            throw new ArgumentException("invalid application id");

        bcgov_documenturl documenturl = _mapper.Map<bcgov_documenturl>(cmd.TempFile);
        documenturl.bcgov_url = $"spd_application/{cmd.ApplicationId}";
        _context.AddTobcgov_documenturls(documenturl);
        _context.SetLink(documenturl, nameof(documenturl.spd_ApplicationId), application);
        if (cmd.DocumentType != null)
        {
            var tag = _context.LookupTag(cmd.DocumentType.ToString());
            _context.SetLink(documenturl, nameof(documenturl.bcgov_Tag1Id), tag);
        }
        if (cmd.DocumentType2 != null)
        {
            var tag2 = _context.LookupTag(cmd.DocumentType2.ToString());
            _context.SetLink(documenturl, nameof(documenturl.bcgov_Tag2Id), tag2);
        }
        if (cmd.SubmittedByApplicantId != null)
        {
            contact? contact = await _context.GetContactById((Guid)cmd.SubmittedByApplicantId, ct);
            _context.SetLink(documenturl, nameof(documenturl.spd_SubmittedById), contact);
        }

        await UploadFileAsync(cmd.TempFile, application.spd_applicationid, documenturl.bcgov_documenturlid, null, ct);
        await _context.SaveChangesAsync(ct);
        documenturl._spd_applicationid_value = application.spd_applicationid;
        return _mapper.Map<DocumentResp>(documenturl);
    }

    private async Task<DocumentResp> DocumentRemoveAsync(RemoveDocumentCmd cmd, CancellationToken ct)
    {
        bcgov_documenturl? documenturl = _context.bcgov_documenturls.Where(d => d.bcgov_documenturlid == cmd.DocumentUrlId).FirstOrDefault();
        if (documenturl == null) { return null; }
        documenturl.statecode = DynamicsConstants.StateCode_Inactive;
        documenturl.statuscode = DynamicsConstants.StatusCode_Inactive;
        await DeleteFileAsync((Guid)documenturl.bcgov_documenturlid, (Guid)(documenturl._spd_applicationid_value), ct);
        _context.UpdateObject(documenturl);
        await _context.SaveChangesAsync(ct);
        return _mapper.Map<DocumentResp>(documenturl);
    }

    private async Task<DocumentResp> DocumentUpdateAsync(UpdateDocumentCmd cmd, CancellationToken ct)
    {
        bcgov_documenturl? documenturl = _context.bcgov_documenturls
            .Expand(d => d.bcgov_Tag1Id)
            .Expand(d => d.bcgov_Tag2Id)
            .Where(d => d.bcgov_documenturlid == cmd.DocumentUrlId).FirstOrDefault();
        if (documenturl == null) { return null; }
        documenturl.spd_expirydate = cmd.ExpiryDate == null ? null :
            new Microsoft.OData.Edm.Date(cmd.ExpiryDate.Value.Year, cmd.ExpiryDate.Value.Month, cmd.ExpiryDate.Value.Day);
        if (cmd.Tag1 != null)
        {
            //have to detach and save, then do update again. becuase of "The version of the existing record doesn't match the RowVersion property provided."
            _context.DetachLink(documenturl, nameof(documenturl.bcgov_Tag1Id), documenturl.bcgov_Tag1Id);
            _context.UpdateObject(documenturl);
            await _context.SaveChangesAsync(ct);
            var tag1 = _context.LookupTag(cmd.Tag1.ToString());
            _context.SetLink(documenturl, nameof(documenturl.bcgov_Tag1Id), tag1);
        }
        if (cmd.Tag2 != null)
        {
            _context.DetachLink(documenturl, nameof(documenturl.bcgov_Tag2Id), documenturl.bcgov_Tag2Id);
            _context.UpdateObject(documenturl);
            await _context.SaveChangesAsync(ct);
            var tag2 = _context.LookupTag(cmd.Tag2.ToString());
            _context.SetLink(documenturl, nameof(documenturl.bcgov_Tag2Id), tag2);
        }
        _context.UpdateObject(documenturl);
        await _context.SaveChangesAsync(ct);
        return _mapper.Map<DocumentResp>(documenturl);
    }

    private async Task UploadFileAsync(SpdTempFile tempFile, Guid? applicationId, Guid? docUrlId, bcgov_tag? tag, CancellationToken ct)
    {
        if (applicationId == null) return;
        if (docUrlId == null) return;

        if (tempFile.TempFileKey != null)
        {
            byte[]? fileContent = await _tempFileService.HandleQuery(
                new GetTempFileQuery(tempFile.TempFileKey), ct);
            if (fileContent == null) return;

            Utilities.FileStorage.File file = new()
            {
                Content = fileContent,
                ContentType = tempFile.ContentType,
                FileName = tempFile.FileName,
            };
            FileTag fileTag = tag == null ?
                new FileTag() { Tags = new List<Tag> { new Tag("file-classification", "Unclassified") } } :
                new FileTag()
                {
                    Tags = new List<Tag>
                    {
                    new Tag("file-classification", "Unclassified"),
                    new Tag("file-tag", tag.bcgov_name)
                    }
                };

            await _fileStorageService.HandleCommand(new UploadFileCommand(
                        Key: ((Guid)docUrlId).ToString(),
                        Folder: $"spd_application/{applicationId}",
                        File: file,
                        FileTag: fileTag
                        ), ct);
        }
        else
        {
            Utilities.FileStorage.FileStream fileStream = new()
            {
                FileContentStream = System.IO.File.OpenRead(tempFile.TempFileName),
                ContentType = tempFile.ContentType,
                FileName = tempFile.FileName,
            };
            FileTag fileTag = tag == null ?
                new FileTag() { Tags = new List<Tag> { new Tag("file-classification", "Unclassified") } } :
                new FileTag()
                {
                    Tags = new List<Tag>
                    {
                    new Tag("file-classification", "Unclassified"),
                    new Tag("file-tag", tag.bcgov_name)
                    }
                };

            await _fileStorageService.HandleCommand(new UploadFileStreamCommand(
                        Key: ((Guid)docUrlId).ToString(),
                        Folder: $"spd_application/{applicationId}",
                        FileStream: fileStream,
                        FileTag: fileTag
                        ), ct);
        }
    }

    private async Task DeleteFileAsync(Guid docUrlId, Guid applicationId, CancellationToken ct)
    {
        //set file-classification tag to be deleted
        FileTag fileTag =
            new FileTag()
            {
                Tags = new List<Utilities.FileStorage.Tag>
                {
                    new Utilities.FileStorage.Tag("file-classification", "deleted"),
                }
            };
        await _fileStorageService.HandleCommand(new UpdateTagsCommand(
            Key: ((Guid)docUrlId).ToString(),
            Folder: $"spd_application/{applicationId}",
            FileTag: fileTag
            ), ct);

    }
}


