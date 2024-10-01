using Amazon.Runtime;
using AutoFixture;
using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Spd.Resource.Repository.Alias;
using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.LicApp;
using Spd.Resource.Repository.Licence;
using Spd.Utilities.Dynamics;
using Spd.Utilities.FileStorage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Spd.Resource.Repository.IntegrationTest;
public class DocumentRepositoryTest : IClassFixture<IntegrationTestSetup>
{
    private readonly DynamicsContext _context;
    private readonly IMainFileStorageService _fileStorageService;
    private readonly ITransientFileStorageService _transientFileStorageService;
    private readonly ITempFileStorageService _tempFileService;
    private readonly IDocumentRepository _documentRepository;
    private readonly IFixture fixture;
    public DocumentRepositoryTest(IntegrationTestSetup testSetup)
    {
        fixture = new Fixture();
        fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());
        fixture.Customize<DateOnly>(composer => composer.FromFactory<DateTime>(DateOnly.FromDateTime));

        _fileStorageService = testSetup.ServiceProvider.GetRequiredService<IMainFileStorageService>();
        _transientFileStorageService = testSetup.ServiceProvider.GetRequiredService<ITransientFileStorageService>();
        _tempFileService = testSetup.ServiceProvider.GetRequiredService<ITempFileStorageService>();
        _documentRepository = testSetup.ServiceProvider.GetRequiredService<IDocumentRepository>();
        _context = testSetup.ServiceProvider.GetRequiredService<IDynamicsContextFactory>().CreateChangeOverwrite();
    }
    [Fact]
    public async Task DocumentCreateAsync_Valid_Request_With_FileKey_ShouldCreateDocument()
    {

        Guid appId = Guid.NewGuid();
        Guid applicantId = Guid.NewGuid();

        Guid submittedByApplicantId = Guid.NewGuid();

        Guid accountId = Guid.NewGuid(); 

        //save file to cach, get key
        var saveCommand = new SaveTempFileCommand(new byte[1]);
        string fileKey = await _tempFileService.HandleCommand(saveCommand, CancellationToken.None);

        //add to context app, contact, task, submittedByApplicant, licence and account
        spd_application app = new() { spd_applicationid = appId };
        _context.AddTospd_applications(app);

        contact contact = new() { contactid = applicantId };
        _context.AddTocontacts(contact);

        contact submittedBycontact = new() { contactid = submittedByApplicantId };
        _context.AddTocontacts(submittedBycontact);
        await _context.SaveChangesAsync(CancellationToken.None);


        // Arrange
        var cmd =
            fixture.Build<CreateDocumentCmd>()
            .With(a => a.TempFile, fixture.Build<SpdTempFile>()
                .With(a => a.TempFileKey, fileKey)
                .With(a => a.ContentType, "text/plain")
                .With(a => a.FileName, IntegrationTestSetup.DataPrefix + "TestFile")
                .With(a => a.FileSize, 512).Create())
            .With(a => a.ApplicationId, appId)
            .With(a => a.ApplicantId, applicantId)
            .Without(a => a.TaskId)
            .Without(a => a.LicenceId)
            .Without(a => a.DocumentType2)
            .With(a => a.SubmittedByApplicantId, submittedByApplicantId)
            .Without(a => a.AccountId)
            .With(a => a.DocumentType, DocumentTypeEnum.DriverLicense)
            .With(a => a.ExpiryDate, DateOnly.FromDateTime(DateTime.Now.AddDays(10)))
            .With(a => a.ToTransientBucket, false).Create();

        try
        {
            // Action
            var result = await _documentRepository.ManageAsync(cmd, CancellationToken.None);
            var documenturl = _context.bcgov_documenturls
                .Where(d => d.bcgov_documenturlid == result.DocumentUrlId).FirstOrDefault();
            var downloadedFile = await _fileStorageService.HandleQuery(new FileQuery()
            {
                Folder = $"spd_application/{appId}",
                Key = result.DocumentUrlId.ToString()
            }, CancellationToken.None);
            // Assert
            Assert.NotNull(result);
            Assert.Equal(result.ApplicationId, appId);
            Assert.Equal(result.FileName, cmd.TempFile.FileName);
            Assert.Equal(result.ExpiryDate, cmd.ExpiryDate);
            //
            Assert.Equal(documenturl._bcgov_customer_value, cmd.ApplicantId);
            Assert.Equal(documenturl?._spd_submittedbyid_value, cmd.SubmittedByApplicantId);
            Assert.Equal(DynamicsContextLookupHelpers.BcGovTagDictionary
                .FirstOrDefault(t => t.Value == documenturl?._bcgov_tag1id_value).Key, DocumentTypeEnum.DriverLicense.ToString());
            Assert.NotNull(downloadedFile);
        }
        catch (Exception e)
        {
            throw e.GetBaseException();
        }
        finally
        {
            await CleanUpObject(appId, applicantId, submittedByApplicantId, accountId);
        }
    }
    [Fact]
    public async Task DocumentCreateAsync_Valid_Request_With_FilePath_ShouldCreateDocument()
    {

        Guid appId = Guid.NewGuid();
        Guid applicantId = Guid.NewGuid();

        Guid submittedByApplicantId = Guid.NewGuid();

        Guid accountId = Guid.NewGuid();

        // Create a temporary file
        string tempFilePath = Path.GetTempFileName();

        //add to context app, contact, task, submittedByApplicant, licence and account
        spd_application app = new() { spd_applicationid = appId };
        _context.AddTospd_applications(app);

        contact contact = new() { contactid = applicantId };
        _context.AddTocontacts(contact);

        contact submittedBycontact = new() { contactid = submittedByApplicantId };
        _context.AddTocontacts(submittedBycontact);
        await _context.SaveChangesAsync(CancellationToken.None);


        // Arrange
        var cmd =
            fixture.Build<CreateDocumentCmd>()
            .With(a => a.TempFile, fixture.Build<SpdTempFile>()
                .With(a => a.TempFilePath, tempFilePath)
                .Without(a => a.TempFileKey)
                .With(a => a.ContentType, "text/plain")
                .With(a => a.FileName, IntegrationTestSetup.DataPrefix + "TestFile")
                .With(a => a.FileSize, 512).Create())
            .With(a => a.ApplicationId, appId)
            .With(a => a.ApplicantId, applicantId)
            .Without(a => a.TaskId)
            .Without(a => a.LicenceId)
            .Without(a => a.DocumentType2)
            .With(a => a.SubmittedByApplicantId, submittedByApplicantId)
            .Without(a => a.AccountId)
            .With(a => a.DocumentType, DocumentTypeEnum.DriverLicense)
            .With(a => a.ExpiryDate, DateOnly.FromDateTime(DateTime.Now.AddDays(10)))
            .With(a => a.ToTransientBucket, false).Create();

        try
        {
            // Action
            var result = await _documentRepository.ManageAsync(cmd, CancellationToken.None);
            var documenturl = _context.bcgov_documenturls
                .Where(d => d.bcgov_documenturlid == result.DocumentUrlId).FirstOrDefault();

            var downloadedFile = await _fileStorageService.HandleQuery(new FileQuery()
            {
                Folder = $"spd_application/{appId}",
                Key = result.DocumentUrlId.ToString()
            }, CancellationToken.None);
            // Assert
            Assert.NotNull(result);
            Assert.Equal(result.ApplicationId, appId);
            Assert.Equal(result.FileName, cmd.TempFile.FileName);
            Assert.Equal(result.ExpiryDate, cmd.ExpiryDate);
            Assert.Equal(documenturl._bcgov_customer_value, cmd.ApplicantId);
            Assert.Equal(documenturl?._spd_submittedbyid_value, cmd.SubmittedByApplicantId);
            Assert.Equal(DynamicsContextLookupHelpers.BcGovTagDictionary
                .FirstOrDefault(t => t.Value == documenturl?._bcgov_tag1id_value).Key, DocumentTypeEnum.DriverLicense.ToString());
            Assert.NotNull(downloadedFile);
        }
        catch (Exception e)
        {
            throw e.GetBaseException();
        }
        finally
        {
            await CleanUpObject(appId, applicantId, submittedByApplicantId, accountId);
        }
    }
    [Fact]
    public async Task DocumentRemoveAsync_DocumentExists_DeletesDocumentAndReturnsResponse()
    {
        Guid appId = Guid.NewGuid();
        Guid applicantId = Guid.NewGuid();

        Guid submittedByApplicantId = Guid.NewGuid();

        Guid accountId = Guid.NewGuid();

        // Create a temporary file
        string tempFilePath = Path.GetTempFileName();

        //add to context app, contact, task, submittedByApplicant, licence and account
        spd_application app = new() { spd_applicationid = appId };
        _context.AddTospd_applications(app);

        contact contact = new() { contactid = applicantId };
        _context.AddTocontacts(contact);

        contact submittedBycontact = new() { contactid = submittedByApplicantId };
        _context.AddTocontacts(submittedBycontact);
        await _context.SaveChangesAsync(CancellationToken.None);


        // Arrange
        var cmd =
            fixture.Build<CreateDocumentCmd>()
            .With(a => a.TempFile, fixture.Build<SpdTempFile>()
                .With(a => a.TempFilePath, tempFilePath)
                .Without(a => a.TempFileKey)
                .With(a => a.ContentType, "text/plain")
                .With(a => a.FileName, IntegrationTestSetup.DataPrefix + "TestFile")
                .With(a => a.FileSize, 512).Create())
            .With(a => a.ApplicationId, appId)
            .With(a => a.ApplicantId, applicantId)
            .Without(a => a.TaskId)
            .Without(a => a.LicenceId)
            .Without(a => a.DocumentType2)
            .With(a => a.SubmittedByApplicantId, submittedByApplicantId)
            .Without(a => a.AccountId)
            .With(a => a.DocumentType, DocumentTypeEnum.DriverLicense)
            .With(a => a.ExpiryDate, DateOnly.FromDateTime(DateTime.Now.AddDays(10)))
            .With(a => a.ToTransientBucket, true).Create();

        try
        {
            // Action
            var result = await _documentRepository.ManageAsync(cmd, CancellationToken.None);
            var removeResponse = await _documentRepository.ManageAsync(new RemoveDocumentCmd(result.DocumentUrlId), CancellationToken.None);
            // Assert
            var documenturl = _context.bcgov_documenturls
                .Where(d => d.bcgov_documenturlid == removeResponse.DocumentUrlId).FirstOrDefault();
            Assert.NotNull(removeResponse);
            Assert.Equal(documenturl?.statecode, DynamicsConstants.StateCode_Inactive);
            Assert.Equal(documenturl?.statuscode, DynamicsConstants.StatusCode_Inactive);
        }
        catch (Exception e)
        {
            throw e.GetBaseException();
        }
        finally
        {
            await CleanUpObject(appId, applicantId, submittedByApplicantId, accountId);
        }
    }
    [Fact]
    public async Task DocumentReactiveAsync_Execute_Correctly()
    {
        Guid appId = Guid.NewGuid();
        Guid applicantId = Guid.NewGuid();

        Guid submittedByApplicantId = Guid.NewGuid();

        Guid accountId = Guid.NewGuid();

        //save file to cach, get key
        var saveCommand = new SaveTempFileCommand(new byte[1]);
        string fileKey = await _tempFileService.HandleCommand(saveCommand, CancellationToken.None);

        //add to context app, contact, task, submittedByApplicant, licence and account
        spd_application app = new() { spd_applicationid = appId };
        _context.AddTospd_applications(app);

        contact contact = new() { contactid = applicantId };
        _context.AddTocontacts(contact);

        contact submittedBycontact = new() { contactid = submittedByApplicantId };
        _context.AddTocontacts(submittedBycontact);
        await _context.SaveChangesAsync(CancellationToken.None);


        // Arrange
        var cmd =
            fixture.Build<CreateDocumentCmd>()
            .With(a => a.TempFile, fixture.Build<SpdTempFile>()
                .With(a => a.TempFileKey, fileKey)
                .With(a => a.ContentType, "text/plain")
                .With(a => a.FileName, IntegrationTestSetup.DataPrefix + "TestFile")
                .With(a => a.FileSize, 512).Create())
            .With(a => a.ApplicationId, appId)
            .With(a => a.ApplicantId, applicantId)
            .Without(a => a.TaskId)
            .Without(a => a.LicenceId)
            .Without(a => a.DocumentType2)
            .With(a => a.SubmittedByApplicantId, submittedByApplicantId)
            .Without(a => a.AccountId)
            .With(a => a.DocumentType, DocumentTypeEnum.DriverLicense)
            .With(a => a.ExpiryDate, DateOnly.FromDateTime(DateTime.Now.AddDays(10)))
            .With(a => a.ToTransientBucket, false).Create();

        try
        {
            // Action
            var result = await _documentRepository.ManageAsync(cmd, CancellationToken.None);
            var documenturl = _context.bcgov_documenturls
                .Where(d => d.bcgov_documenturlid == result.DocumentUrlId).FirstOrDefault();
            documenturl.statecode = DynamicsConstants.StateCode_Inactive;
            documenturl.statuscode = DynamicsConstants.StatusCode_Inactive;
            _context.UpdateObject(documenturl);
            _context.SaveChanges();
            var response = await _documentRepository.ManageAsync(new ReactivateDocumentCmd((Guid)documenturl.bcgov_documenturlid), CancellationToken.None);
            Assert.NotNull(response);
            documenturl = _context.bcgov_documenturls.Where(d => d.bcgov_documenturlid == response.DocumentUrlId).FirstOrDefault();
            Assert.Equal(documenturl?.statecode, DynamicsConstants.StateCode_Active);
            Assert.Equal(documenturl?.statuscode, DynamicsConstants.StatusCode_Active);
        }
        catch (Exception e)
        {
            throw e.GetBaseException();
        }
        finally
        {
            await CleanUpObject(appId, applicantId, submittedByApplicantId, accountId);
        }
    }
    [Fact]
    public async Task DocumentDeactiveAsync_Execute_Correctly()
    {
        Guid appId = Guid.NewGuid();
        Guid applicantId = Guid.NewGuid();

        Guid submittedByApplicantId = Guid.NewGuid();

        Guid accountId = Guid.NewGuid();

        // Create a temporary file
        string tempFilePath = Path.GetTempFileName();

        //add to context app, contact, task, submittedByApplicant, licence and account
        spd_application app = new() { spd_applicationid = appId };
        _context.AddTospd_applications(app);

        contact contact = new() { contactid = applicantId };
        _context.AddTocontacts(contact);

        contact submittedBycontact = new() { contactid = submittedByApplicantId };
        _context.AddTocontacts(submittedBycontact);
        await _context.SaveChangesAsync(CancellationToken.None);


        // Arrange
        var cmd =
            fixture.Build<CreateDocumentCmd>()
            .With(a => a.TempFile, fixture.Build<SpdTempFile>()
                .With(a => a.TempFilePath, tempFilePath)
                .Without(a => a.TempFileKey)
                .With(a => a.ContentType, "text/plain")
                .With(a => a.FileName, IntegrationTestSetup.DataPrefix + "TestFile")
                .With(a => a.FileSize, 512).Create())
            .With(a => a.ApplicationId, appId)
            .With(a => a.ApplicantId, applicantId)
            .Without(a => a.TaskId)
            .Without(a => a.LicenceId)
            .Without(a => a.DocumentType2)
            .With(a => a.SubmittedByApplicantId, submittedByApplicantId)
            .Without(a => a.AccountId)
            .With(a => a.DocumentType, DocumentTypeEnum.DriverLicense)
            .With(a => a.ExpiryDate, DateOnly.FromDateTime(DateTime.Now.AddDays(10)))
            .With(a => a.ToTransientBucket, true).Create();

        try
        {
            // Action
            var result = await _documentRepository.ManageAsync(cmd, CancellationToken.None);
            var removeResponse = await _documentRepository.ManageAsync(new DeactivateDocumentCmd(result.DocumentUrlId), CancellationToken.None);
            // Assert
            var documenturl = _context.bcgov_documenturls
                .Where(d => d.bcgov_documenturlid == removeResponse.DocumentUrlId).FirstOrDefault();
            Assert.NotNull(removeResponse);
            Assert.Equal(documenturl?.statecode, DynamicsConstants.StateCode_Inactive);
            Assert.Equal(documenturl?.statuscode, DynamicsConstants.StatusCode_Inactive);
        }
        catch (Exception e)
        {
            throw e.GetBaseException();
        }
        finally
        {
            await CleanUpObject(appId, applicantId, submittedByApplicantId, accountId);
        }
    }
    [Fact]
    public async Task DocumentUpdateAsync_Execute_Correctly()
    {
        Guid appId = Guid.NewGuid();
        Guid applicantId = Guid.NewGuid();

        Guid submittedByApplicantId = Guid.NewGuid();

        Guid accountId = Guid.NewGuid();

        //save file to cach, get key
        var saveCommand = new SaveTempFileCommand(new byte[1]);
        string fileKey = await _tempFileService.HandleCommand(saveCommand, CancellationToken.None);

        //add to context app, contact, task, submittedByApplicant, licence and account
        spd_application app = new() { spd_applicationid = appId };
        _context.AddTospd_applications(app);

        contact contact = new() { contactid = applicantId };
        _context.AddTocontacts(contact);

        contact submittedBycontact = new() { contactid = submittedByApplicantId };
        _context.AddTocontacts(submittedBycontact);
        await _context.SaveChangesAsync(CancellationToken.None);


        // Arrange
        var cmd =
            fixture.Build<CreateDocumentCmd>()
            .With(a => a.TempFile, fixture.Build<SpdTempFile>()
                .With(a => a.TempFileKey, fileKey)
                .With(a => a.ContentType, "text/plain")
                .With(a => a.FileName, IntegrationTestSetup.DataPrefix + "TestFile")
                .With(a => a.FileSize, 512).Create())
            .With(a => a.ApplicationId, appId)
            .With(a => a.ApplicantId, applicantId)
            .Without(a => a.TaskId)
            .Without(a => a.LicenceId)
            .Without(a => a.DocumentType2)
            .With(a => a.SubmittedByApplicantId, submittedByApplicantId)
            .Without(a => a.AccountId)
            .With(a => a.DocumentType, DocumentTypeEnum.DriverLicense)
            .With(a => a.ExpiryDate, DateOnly.FromDateTime(DateTime.Now.AddDays(10)))
            .With(a => a.ToTransientBucket, false).Create();

        try
        {
            // Action
            var createdDoc = await _documentRepository.ManageAsync(cmd, CancellationToken.None);
            UpdateDocumentCmd updateDocumentCmd = new UpdateDocumentCmd(createdDoc.DocumentUrlId, DateOnly.FromDateTime(DateTime.Now), DocumentTypeEnum.CanadianCitizenship);
            var response = await _documentRepository.ManageAsync(updateDocumentCmd, CancellationToken.None);
            Assert.NotNull(response);
            var updatedDocumenturl = _context.bcgov_documenturls.Where(d => d.bcgov_documenturlid == response.DocumentUrlId).FirstOrDefault();
            Assert.NotNull(createdDoc);
            Assert.Equal(createdDoc.ApplicationId, appId);
            Assert.Equal(response.ExpiryDate, updateDocumentCmd.ExpiryDate);
            Assert.Equal(DynamicsContextLookupHelpers.BcGovTagDictionary
                .FirstOrDefault(t => t.Value == updatedDocumenturl?._bcgov_tag1id_value).Key, updateDocumentCmd.Tag1.ToString());
        }
        catch (Exception e)
        {
            throw e.GetBaseException();
        }
        finally
        {
            await CleanUpObject(appId, applicantId, submittedByApplicantId, accountId);
        }
    }
    private async Task CleanUpObject(Guid appId, Guid applicantId, Guid submittedByApplicantId, Guid accountId)
    {
        spd_application? appToRemove = _context.spd_applications.Where(a => a.spd_applicationid == appId).FirstOrDefault();

        if (appToRemove != null)
        {
            _context.DeleteObject(appToRemove);
            await _context.SaveChangesAsync();
        }
        contact? contactToRemove = _context.contacts.Where(c => c.contactid == applicantId).FirstOrDefault();
        if (contactToRemove != null)
        {
            _context.DeleteObject(contactToRemove);
            await _context.SaveChangesAsync();
        }
        contact? submittedByApplicantToRemove = _context.contacts.Where(c => c.contactid == submittedByApplicantId).FirstOrDefault();
        if (submittedByApplicantToRemove != null)
        {
            _context.DeleteObject(submittedByApplicantToRemove);
            await _context.SaveChangesAsync();
        }
        account? accountToRemove = _context.accounts.Where(a => a.accountid == accountId).FirstOrDefault();
        if (accountToRemove != null)
        {
            _context.DeleteObject(accountToRemove);
            await _context.SaveChangesAsync();
        }
    }
}
