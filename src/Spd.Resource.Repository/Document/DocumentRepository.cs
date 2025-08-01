using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Resource.Repository.Application;
using Spd.Utilities.Dynamics;
using Spd.Utilities.FileStorage;
using System.Collections.Immutable;

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
            documents = documents.Where(d => d._bcgov_customer_value == qry.ApplicantId);

        if (qry.AccountId != null)
            documents = documents.Where(d => d._bcgov_customer_value == qry.AccountId);

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

        var results = await documents.GetAllPagesAsync(ct);
        IEnumerable<DocumentResp> resp = null;
        if (qry.MultiFileTypes != null)
        {
            List<Guid> tagIds = qry.MultiFileTypes.Select(f => DynamicsContextLookupHelpers.BcGovTagDictionary.GetValueOrDefault(f.ToString())).ToList();
            List<bcgov_documenturl> result = results
                .Where(d => d._bcgov_tag1id_value.HasValue && tagIds.Contains(d._bcgov_tag1id_value.Value)).ToList();
            resp = _mapper.Map<IEnumerable<DocumentResp>>(result.OrderByDescending(a => a.createdon));
        }
        else
        {
            results = results.OrderByDescending(a => a.createdon);
            resp = _mapper.Map<IEnumerable<DocumentResp>>(results);
        }
        return qry.OnlyReturnLatestSet ? new DocumentListResp { Items = GetLatestSet(resp) } : new DocumentListResp { Items = resp };
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

    //if the documents are in the same application, then we use applicationId to indicate its set.
    //if the documents are in the same licence, then we use licenceId to indicate its set.
    //Or we use uploadedDatetime
    private IEnumerable<DocumentResp> GetLatestSet(IEnumerable<DocumentResp> resp)
    {
        if (resp.Any())
        {
            DocumentResp? doc = resp.FirstOrDefault();
            if (doc?.LicenceId != null)
                return resp.Where(i => i.LicenceId == doc.LicenceId).ToList();
            else if (doc?.ApplicationId != null)
                return resp.Where(i => i.ApplicationId == doc.ApplicationId).ToList();
            else
                return resp.Where(i => i.CreatedOn == doc?.CreatedOn).ToList();
            //else
            //    return resp.Where(i => i.UploadedDateTime == doc.UploadedDateTime).ToList();
        }
        return resp;
    }

    private async Task<DocumentResp> DocumentCreateAsync(CreateDocumentCmd cmd, CancellationToken ct)
    {
        bcgov_documenturl documenturl = _mapper.Map<bcgov_documenturl>(cmd.TempFile);
        if (cmd.ApplicationId != null)
            documenturl.bcgov_url = $"spd_application/{cmd.ApplicationId}";
        else if (cmd.ApplicantId != null)
            documenturl.bcgov_url = $"contact/{cmd.ApplicantId}";
        else if (cmd.OrgRegistrationId != null)
            documenturl.bcgov_url = $"spd_orgregistration/{cmd.OrgRegistrationId}";

        if (cmd.ExpiryDate != null && cmd.ExpiryDate < new DateOnly(1800, 1, 1))
            throw new ArgumentException("Invalid Document Expiry Date");
        if (cmd.ExpiryDate != null) documenturl.spd_expirydate = SharedMappingFuncs.GetDateFromDateOnly(cmd.ExpiryDate);
        documenturl.spd_documentid = cmd.DocumentIdNumber;
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
        if (cmd.OrgRegistrationId != null)
        {
            spd_orgregistration? registration = await _context.GetOrgRegistrationById((Guid)cmd.OrgRegistrationId, ct);
            if (registration == null)
                throw new ArgumentException("invalid org registration id");
            _context.SetLink(documenturl, nameof(documenturl.spd_OrgRegistrationId), registration);
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
        destDoc.spd_documentid = sourceDoc.spd_documentid;
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
            SourceFolder: sourceDoc.bcgov_url,
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
        if (cmd.ExpiryDate != null && cmd.ExpiryDate < new DateOnly(1800, 1, 1))
            throw new ArgumentException("Invalid Document Expiry Date");
        documenturl.spd_expirydate = cmd.ExpiryDate == null ? null :
            new Microsoft.OData.Edm.Date(cmd.ExpiryDate.Value.Year, cmd.ExpiryDate.Value.Month, cmd.ExpiryDate.Value.Day);
        documenturl.spd_documentid = cmd.DocumentIdNumber;
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