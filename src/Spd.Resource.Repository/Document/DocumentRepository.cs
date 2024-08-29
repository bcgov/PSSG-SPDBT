using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Resource.Repository.Application;
using Spd.Utilities.Dynamics;
using Spd.Utilities.FileStorage;
using Spd.Utilities.TempFileStorage;

namespace Spd.Resource.Repository.Document;
internal class DocumentRepository : IDocumentRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;
    private readonly IMainFileStorageService _fileStorageService;
    private readonly ITransientFileStorageService _transientFileStorageService;
    private readonly ITempFileStorageService _tempFileService;

    public DocumentRepository(IDynamicsContextFactory ctx,
        IMapper mapper,
        IMainFileStorageService fileStorageService,
        ITempFileStorageService tempFileService,
        ITransientFileStorageService transientFileStorageService)
    {
        _context = ctx.Create();
        _mapper = mapper;
        _fileStorageService = fileStorageService;
        _tempFileService = tempFileService;
        _transientFileStorageService = transientFileStorageService;
    }

    public async Task<DocumentResp> GetAsync(Guid docUrlId, CancellationToken ct)
    {
        var document = await _context.bcgov_documenturls
            .Where(d => d.bcgov_documenturlid == docUrlId)
            .FirstOrDefaultAsync(ct);
        return _mapper.Map<DocumentResp>(document);
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

        if (qry.LicenceId != null)
            documents = documents.Where(d => d._spd_licenceid_value == qry.LicenceId);

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
            CopyDocumentCmd c => await DocumentCopyAsync(c, ct),
            DeactivateDocumentCmd c => await DocumentDeactivateAsync(c, ct),
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
        bcgov_documenturl documenturl = _mapper.Map<bcgov_documenturl>(cmd.TempFile);
        documenturl.bcgov_url = cmd.ApplicationId == null ? $"contact/{cmd.ApplicantId}" : $"spd_application/{cmd.ApplicationId}";
        if (cmd.ExpiryDate != null) documenturl.spd_expirydate = SharedMappingFuncs.GetDateFromDateOnly(cmd.ExpiryDate);
        _context.AddTobcgov_documenturls(documenturl);
        if (cmd.ApplicationId != null)
        {
            spd_application? application = await _context.GetApplicationById((Guid)cmd.ApplicationId, ct);
            if (application == null)
                throw new ArgumentException("invalid application id");
            _context.SetLink(documenturl, nameof(documenturl.spd_ApplicationId), application);
        }
        if (cmd.ApplicantId != null)
        {
            contact? contact = await _context.GetContactById((Guid)cmd.ApplicantId, ct);
            if (contact == null)
                throw new ArgumentException("invalid contact id");
            _context.SetLink(documenturl, nameof(documenturl.bcgov_Customer_contact), contact);
        }
        if (cmd.TaskId != null)
        {
            task? task = await _context.GetTaskById((Guid)cmd.TaskId, ct);
            if (task == null)
                throw new ArgumentException("invalid task id");
            _context.SetLink(documenturl, nameof(documenturl.bcgov_TaskId), task);
        }
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
        if (cmd.LicenceId != null)
        {
            spd_licence? lic = await _context.spd_licences.Where(l => l.spd_licenceid == cmd.LicenceId).FirstOrDefaultAsync(ct);
            _context.SetLink(documenturl, nameof(documenturl.spd_LicenceId), lic);
        }
        if (cmd.AccountId != null)
        {
            account? account = await _context.accounts.Where(a => a.accountid == cmd.AccountId).FirstOrDefaultAsync(ct);
            _context.SetLink(documenturl, nameof(documenturl.bcgov_Customer_account), account);
        }

        await UploadFileAsync(cmd.TempFile, cmd.ApplicationId, cmd.ApplicantId, documenturl.bcgov_documenturlid, null, ct, cmd.ToTransientBucket);
        await _context.SaveChangesAsync(ct);
        documenturl._spd_applicationid_value = cmd.ApplicationId;
        return _mapper.Map<DocumentResp>(documenturl);
    }

    private async Task<DocumentResp> DocumentCopyAsync(CopyDocumentCmd cmd, CancellationToken ct)
    {
        spd_application? application = await _context.GetApplicationById(cmd.DestApplicationId, ct);
        if (application == null)
            throw new ArgumentException("invalid application id");

        bcgov_documenturl sourceDoc = _context.bcgov_documenturls.Where(d => d.bcgov_documenturlid == cmd.SourceDocumentUrlId).FirstOrDefault();
        if (sourceDoc == null)
            throw new ArgumentException("cannot find the source documenturl for copying");
        bcgov_documenturl destDoc = new();
        destDoc.bcgov_documenturlid = Guid.NewGuid();
        destDoc.bcgov_url = $"spd_application/{cmd.DestApplicationId}";
        destDoc.bcgov_filename = sourceDoc.bcgov_filename;
        destDoc.bcgov_filesize = sourceDoc.bcgov_filesize;
        destDoc.bcgov_origincode = (int)BcGovOriginCode.Web;
        destDoc.bcgov_receiveddate = sourceDoc.bcgov_receiveddate;
        destDoc.bcgov_fileextension = sourceDoc.bcgov_fileextension;
        destDoc.spd_expirydate = sourceDoc.spd_expirydate;
        _context.AddTobcgov_documenturls(destDoc);
        _context.SetLink(destDoc, nameof(destDoc.spd_ApplicationId), application);
        if (sourceDoc._bcgov_tag1id_value != null)
        {
            var tag1 = _context.bcgov_tags.Where(t => t.bcgov_tagid == sourceDoc._bcgov_tag1id_value).FirstOrDefault();
            _context.SetLink(destDoc, nameof(destDoc.bcgov_Tag1Id), tag1);
        }
        if (sourceDoc._bcgov_tag2id_value != null)
        {
            var tag2 = _context.bcgov_tags.Where(t => t.bcgov_tagid == sourceDoc._bcgov_tag2id_value).FirstOrDefault();
            _context.SetLink(destDoc, nameof(destDoc.bcgov_Tag2Id), tag2);
        }
        if (sourceDoc._bcgov_tag3id_value != null)
        {
            var tag3 = _context.bcgov_tags.Where(t => t.bcgov_tagid == sourceDoc._bcgov_tag3id_value).FirstOrDefault();
            _context.SetLink(destDoc, nameof(destDoc.bcgov_Tag3Id), tag3);
        }
        if (cmd.SubmittedByApplicantId != null)
        {
            contact? contact = await _context.GetContactById((Guid)cmd.SubmittedByApplicantId, ct);
            _context.SetLink(destDoc, nameof(destDoc.spd_SubmittedById), contact);
            _context.SetLink(destDoc, nameof(destDoc.bcgov_Customer_contact), contact);
        }

        await _fileStorageService.HandleCommand(new CopyFileCommand(
            SourceKey: cmd.SourceDocumentUrlId.ToString(),
            SourceFolder: $"spd_application/{sourceDoc._spd_applicationid_value}",
            DestKey: destDoc.bcgov_documenturlid.ToString(),
            DestFolder: $"spd_application/{cmd.DestApplicationId}"
            ), ct);

        await _context.SaveChangesAsync(ct);
        destDoc._spd_applicationid_value = application.spd_applicationid;
        return _mapper.Map<DocumentResp>(destDoc);
    }

    private async Task<DocumentResp> DocumentRemoveAsync(RemoveDocumentCmd cmd, CancellationToken ct)
    {
        bcgov_documenturl? documenturl = _context.bcgov_documenturls.Where(d => d.bcgov_documenturlid == cmd.DocumentUrlId).FirstOrDefault();
        if (documenturl == null) { return null; }
        documenturl.statecode = DynamicsConstants.StateCode_Inactive;
        documenturl.statuscode = DynamicsConstants.StatusCode_Inactive;
        await DeleteFileAsync((Guid)documenturl.bcgov_documenturlid, (Guid)documenturl._spd_applicationid_value, ct);
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
            // Have to detach and save, then do update again because of "The version of the existing record doesn't match the RowVersion property provided."
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

    private async Task UploadFileAsync(SpdTempFile tempFile, Guid? applicationId, Guid? contactId, Guid? docUrlId, bcgov_tag? tag, CancellationToken ct, bool toTransientBucket = false)
    {
        if (applicationId == null && contactId == null) return;
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
                new FileTag() { Tags = new List<Tag> { new("file-classification", "Unclassified") } } :
                new FileTag()
                {
                    Tags = new List<Tag>
                    {
                    new("file-classification", "Unclassified"),
                    new("file-tag", tag.bcgov_name)
                    }
                };

            string folder = applicationId == null ? $"contact/{contactId}" : $"spd_application/{applicationId}";
            UploadFileCommand uploadFileCmd = new(
                        Key: ((Guid)docUrlId).ToString(),
                        Folder: folder,
                        File: file,
                        FileTag: fileTag);
            if (toTransientBucket)
            {
                await _transientFileStorageService.HandleCommand(uploadFileCmd, ct);
            }
            else
            {
                await _fileStorageService.HandleCommand(uploadFileCmd, ct);
            }
        }
        else
        {
            Utilities.FileStorage.FileContent fileStream = new()
            {
                FileContentStream = System.IO.File.OpenRead(tempFile.TempFilePath),
                ContentType = tempFile.ContentType,
                FileName = tempFile.FileName,
            };
            FileTag fileTag = tag == null ?
                new FileTag() { Tags = new List<Tag> { new("file-classification", "Unclassified") } } :
                new FileTag()
                {
                    Tags = new List<Tag>
                    {
                    new("file-classification", "Unclassified"),
                    new("file-tag", tag.bcgov_name)
                    }
                };

            UploadFileStreamCommand uploadFileCmd = new(
                Key: ((Guid)docUrlId).ToString(),
                Folder: $"spd_application/{applicationId}",
                FileStream: fileStream,
                FileTag: fileTag);
            if (toTransientBucket)
            {
                await _transientFileStorageService.HandleCommand(uploadFileCmd, ct);
            }
            else
            {
                await _fileStorageService.HandleCommand(uploadFileCmd, ct);
            }
        }
    }

    private async Task DeleteFileAsync(Guid docUrlId, Guid applicationId, CancellationToken ct)
    {
        await _transientFileStorageService.HandleDeleteCommand(new StorageDeleteCommand(
            Key: docUrlId.ToString(),
            Folder: $"spd_application/{applicationId}"), ct);
    }

    private async Task<DocumentResp> DocumentDeactivateAsync(DeactivateDocumentCmd cmd, CancellationToken ct)
    {
        bcgov_documenturl? documenturl = _context.bcgov_documenturls.Where(d => d.bcgov_documenturlid == cmd.DocumentUrlId).FirstOrDefault();
        if (documenturl == null) { return null; }
        documenturl.statecode = DynamicsConstants.StateCode_Inactive;
        documenturl.statuscode = DynamicsConstants.StatusCode_Inactive;
        _context.UpdateObject(documenturl);
        await _context.SaveChangesAsync(ct);
        return _mapper.Map<DocumentResp>(documenturl);
    }
}


