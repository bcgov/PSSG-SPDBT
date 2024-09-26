using AutoFixture;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.DependencyInjection;
using Spd.Resource.Repository.Alias;
using Spd.Resource.Repository.ControllingMemberCrcApplication;
using Spd.Resource.Repository.LicApp;
using Spd.Resource.Repository.PersonLicApplication;
using Spd.Utilities.Dynamics;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Spd.Resource.Repository.IntegrationTest;
public class ControllingMemberCrcRepositoryTest : IClassFixture<IntegrationTestSetup>
{
    private DynamicsContext _context;
    private readonly IFixture fixture;
    private readonly IControllingMemberCrcRepository _controllingMemberCrcRepository;
    public ControllingMemberCrcRepositoryTest(IntegrationTestSetup testSetup)
    {
        fixture = new Fixture();
        fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());
        fixture.Customize<DateOnly>(composer => composer.FromFactory<DateTime>(DateOnly.FromDateTime));
        _controllingMemberCrcRepository = testSetup.ServiceProvider.GetRequiredService<IControllingMemberCrcRepository>();
        _context = testSetup.ServiceProvider.GetRequiredService<IDynamicsContextFactory>().CreateChangeOverwrite();
    }
    [Fact]
    public async Task SaveControllingMemberCrcApplicationAsync_Run_Correctly()
    {
        // Arrange
        Guid contactId = Guid.NewGuid();
        Guid accountid = Guid.NewGuid();
        Guid bizlicAppId = Guid.NewGuid();
        Guid bizContactId = Guid.NewGuid();
        Guid? controllingMemberAppId = null;
        SaveControllingMemberCrcAppCmd cmd = fixture.Build<SaveControllingMemberCrcAppCmd>()
            .With(a => a.BcDriversLicenceNumber, "1234567")
            .With(a => a.PhoneNumber, "1234567")
            .With(a => a.GivenName, IntegrationTestSetup.DataPrefix + "GiveName")
            .With(a => a.Surname, IntegrationTestSetup.DataPrefix + "Surname")
            .With(a => a.MiddleName1, IntegrationTestSetup.DataPrefix + "MiddleName1")
            .With(a => a.MiddleName2, IntegrationTestSetup.DataPrefix + "MiddleName2")
            .With(a => a.OtherOfficerRole, IntegrationTestSetup.DataPrefix + "role")
            .With(a => a.ResidentialAddressData, fixture.Build<ResidentialAddr>()
                .With(a => a.PostalCode, "V9N 5J2")
                .With(a => a.AddressLine1, IntegrationTestSetup.DataPrefix + "AdressLine1").Create())
            .With(a => a.Aliases, new List<AliasResp> { })
            .With(a => a.UploadedDocumentEnums, new List<UploadedDocumentEnum> { UploadedDocumentEnum.Fingerprint })
            .With(a => a.ContactId, contactId)
            .With(a => a.BizContactId, bizContactId)
            .With(a => a.ParentBizLicApplicationId, bizlicAppId)
            .With(a => a.ControllingMemberAppId, controllingMemberAppId)
            .Create();
        contact? contact = new contact()
        {
            contactid = cmd.ContactId,
        };
        _context.AddTocontacts(contact);
        // Create Account, then set biz app's account
        account account = new account()
        {
            accountid = accountid,
        };
        _context.AddToaccounts(account);
        // Create Biz Licence app
        spd_application bizApp = new spd_application()
        {
            spd_applicationid = bizlicAppId
        };
        _context.AddTospd_applications(bizApp);
        _context.SetLink(bizApp, nameof(spd_application.spd_ApplicantId_account), account);
        await _context.SaveChangesAsync();
        // Create Biz Contact
        spd_businesscontact bizContact = new spd_businesscontact()
        {
            spd_businesscontactid = bizContactId,
            statecode = DynamicsConstants.StateCode_Active
        };
        _context.AddTospd_businesscontacts(bizContact);
        _context.AddLink(bizContact, nameof(bizContact.spd_businesscontact_spd_application), bizApp);
        await _context.SaveChangesAsync();



        // Action
        try
        {
            ControllingMemberCrcApplicationCmdResp? resp = await _controllingMemberCrcRepository.SaveControllingMemberCrcApplicationAsync(cmd, CancellationToken.None);
            controllingMemberAppId = resp.ControllingMemberAppId;
            // Assert
            Assert.NotNull(resp);

            contact? updatedApplicantContact = _context.contacts.Where(c => c.contactid == cmd.ContactId).FirstOrDefault();
            spd_application? app = _context.spd_applications.Where(a => a.spd_applicationid == resp.ControllingMemberAppId).FirstOrDefault();
            spd_businesscontact? updatedbizContact = _context.spd_businesscontacts
                .Expand(b => b.spd_businesscontact_spd_application)
                .Where(b => b.spd_businesscontactid == cmd.BizContactId).FirstOrDefault();

            spd_application? updatedBizLicApp = _context.spd_applications
                .Expand(a => a.spd_businessapplication_spd_workerapplication)
                .Where(a => a.spd_applicationid == cmd.ParentBizLicApplicationId).FirstOrDefault();

            Assert.Equal(updatedbizContact?._spd_contactid_value, updatedApplicantContact?.contactid);
            Assert.True(updatedbizContact.spd_businesscontact_spd_application.Any(a => a.spd_applicationid == resp.ControllingMemberAppId));
            Assert.True(updatedBizLicApp.spd_businessapplication_spd_workerapplication.Any(a => a.spd_applicationid == resp.ControllingMemberAppId));

            Assert.True(string.Equals(updatedApplicantContact?.firstname, cmd.GivenName, StringComparison.OrdinalIgnoreCase));
            Assert.True(string.Equals(updatedApplicantContact?.lastname, cmd.Surname, StringComparison.OrdinalIgnoreCase));
            Assert.True(string.Equals(updatedApplicantContact?.spd_middlename1, cmd.MiddleName1, StringComparison.OrdinalIgnoreCase));
            Assert.True(string.Equals(updatedApplicantContact?.spd_middlename2, cmd.MiddleName2, StringComparison.OrdinalIgnoreCase));
            Assert.True(string.Equals(updatedApplicantContact?.address2_postalcode, cmd.ResidentialAddressData?.PostalCode, StringComparison.OrdinalIgnoreCase));
            Assert.True(string.Equals(updatedApplicantContact?.address2_line1, cmd.ResidentialAddressData?.AddressLine1, StringComparison.OrdinalIgnoreCase));

            Assert.Equal(app._spd_applicantid_value, updatedApplicantContact?.contactid);
            Assert.Equal("100000000", app.spd_uploadeddocuments);
            Assert.NotNull(app.spd_portalmodifiedon);
        }
        catch (Exception e)
        {
            throw e.GetBaseException();
        }
        finally
        {
            //Clean up objects
            await CleanUpObject(contactId, accountid, bizlicAppId, bizContactId, controllingMemberAppId);
        }
    }
    [Fact]
    public async Task SaveControllingMemberCrcApplicationAsync_Without_Parent_BizLic_Throw_Exception()
    {
        // Arrange
        Guid contactId = Guid.NewGuid();
        Guid accountid = Guid.NewGuid();
        Guid? bizlicAppId = null;
        Guid bizContactId = Guid.NewGuid();
        Guid? controllingMemberAppId = null;
        SaveControllingMemberCrcAppCmd cmd = fixture.Build<SaveControllingMemberCrcAppCmd>()
            .With(a => a.BcDriversLicenceNumber, "1234567")
            .With(a => a.PhoneNumber, "1234567")
            .With(a => a.GivenName, IntegrationTestSetup.DataPrefix + "GiveName")
            .With(a => a.Surname, IntegrationTestSetup.DataPrefix + "Surname")
            .With(a => a.MiddleName1, IntegrationTestSetup.DataPrefix + "MiddleName1")
            .With(a => a.MiddleName2, IntegrationTestSetup.DataPrefix + "MiddleName2")
            .With(a => a.OtherOfficerRole, IntegrationTestSetup.DataPrefix + "role")
            .With(a => a.ResidentialAddressData, fixture.Build<ResidentialAddr>()
                .With(a => a.PostalCode, "V9N 5J2")
                .With(a => a.AddressLine1, IntegrationTestSetup.DataPrefix + "AdressLine1").Create())
            .With(a => a.Aliases, new List<AliasResp> { })
            .With(a => a.UploadedDocumentEnums, new List<UploadedDocumentEnum> { UploadedDocumentEnum.Fingerprint })
            .With(a => a.ContactId, contactId)
            .With(a => a.BizContactId, bizContactId)
            .With(a => a.ParentBizLicApplicationId, bizlicAppId)
            .With(a => a.ControllingMemberAppId, controllingMemberAppId)
            .Create();
        contact? contact = new contact()
        {
            contactid = cmd.ContactId,
        };
        _context.AddTocontacts(contact);
        // Create Account, then set biz app's account
        account account = new account()
        {
            accountid = accountid,
        };
        _context.AddToaccounts(account);
        // Create Biz Licence app
        spd_application bizApp = new spd_application()
        {
            spd_applicationid = bizlicAppId
        };
        _context.AddTospd_applications(bizApp);
        _context.SetLink(bizApp, nameof(spd_application.spd_ApplicantId_account), account);
        await _context.SaveChangesAsync();
        // Create Biz Contact
        spd_businesscontact bizContact = new spd_businesscontact()
        {
            spd_businesscontactid = bizContactId,
            statecode = DynamicsConstants.StateCode_Active
        };
        _context.AddTospd_businesscontacts(bizContact);
        _context.AddLink(bizContact, nameof(bizContact.spd_businesscontact_spd_application), bizApp);
        await _context.SaveChangesAsync();


        // Action
        try
        {
            await Assert.ThrowsAsync<ArgumentException>(async () => await _controllingMemberCrcRepository.SaveControllingMemberCrcApplicationAsync(cmd, CancellationToken.None));
        }
        catch (Exception e)
        {
            throw e.GetBaseException();
        }
        finally
        {
            //Clean up objects
            await CleanUpObject(contactId, accountid, bizlicAppId, bizContactId, controllingMemberAppId);
        }
    }

    [Fact]
    public async Task SaveControllingMemberCrcApplicationAsync_Without_Applicant_ContactInfo_Throw_Exception()
    {
        // Arrange
        Guid? contactId = null;
        Guid accountid = Guid.NewGuid();
        Guid? bizlicAppId = Guid.NewGuid();
        Guid bizContactId = Guid.NewGuid();
        Guid? controllingMemberAppId = null;
        SaveControllingMemberCrcAppCmd cmd = fixture.Build<SaveControllingMemberCrcAppCmd>()
            .With(a => a.BcDriversLicenceNumber, "1234567")
            .With(a => a.PhoneNumber, "1234567")
            .With(a => a.GivenName, IntegrationTestSetup.DataPrefix + "GiveName")
            .With(a => a.Surname, IntegrationTestSetup.DataPrefix + "Surname")
            .With(a => a.MiddleName1, IntegrationTestSetup.DataPrefix + "MiddleName1")
            .With(a => a.MiddleName2, IntegrationTestSetup.DataPrefix + "MiddleName2")
            .With(a => a.OtherOfficerRole, IntegrationTestSetup.DataPrefix + "role")
            .With(a => a.ResidentialAddressData, fixture.Build<ResidentialAddr>()
                .With(a => a.PostalCode, "V9N 5J2")
                .With(a => a.AddressLine1, IntegrationTestSetup.DataPrefix + "AdressLine1").Create())
            .With(a => a.Aliases, new List<AliasResp> { })
            .With(a => a.UploadedDocumentEnums, new List<UploadedDocumentEnum> { UploadedDocumentEnum.Fingerprint })
            .With(a => a.ContactId, contactId)
            .With(a => a.BizContactId, bizContactId)
            .With(a => a.ParentBizLicApplicationId, bizlicAppId)
            .With(a => a.ControllingMemberAppId, controllingMemberAppId)
            .Create();

        // Create Account, then set biz app's account
        account account = new account()
        {
            accountid = accountid,
        };
        _context.AddToaccounts(account);
        // Create Biz Licence app
        spd_application bizApp = new spd_application()
        {
            spd_applicationid = bizlicAppId
        };
        _context.AddTospd_applications(bizApp);
        _context.SetLink(bizApp, nameof(spd_application.spd_ApplicantId_account), account);
        await _context.SaveChangesAsync();
        // Create Biz Contact
        spd_businesscontact bizContact = new spd_businesscontact()
        {
            spd_businesscontactid = bizContactId,
            statecode = DynamicsConstants.StateCode_Active
        };
        _context.AddTospd_businesscontacts(bizContact);
        _context.AddLink(bizContact, nameof(bizContact.spd_businesscontact_spd_application), bizApp);
        await _context.SaveChangesAsync();

        // Action
        try
        {
            await Assert.ThrowsAsync<ArgumentException>(async () => await _controllingMemberCrcRepository.SaveControllingMemberCrcApplicationAsync(cmd, CancellationToken.None));
        }
        catch (Exception e)
        {
            throw e.GetBaseException();
        }
        finally
        {
            //Clean up objects
            await CleanUpObject(contactId, accountid, bizlicAppId, bizContactId, controllingMemberAppId);
        }
    }
    [Fact]
    public async Task GetCrcApplicationAsync_Run_Correctly()
    {

        // Arrange
        Guid contactId = Guid.NewGuid();
        Guid accountid = Guid.NewGuid();
        Guid bizlicAppId = Guid.NewGuid();
        Guid bizContactId = Guid.NewGuid();
        Guid? controllingMemberAppId = null;
        SaveControllingMemberCrcAppCmd cmd = fixture.Build<SaveControllingMemberCrcAppCmd>()
            .With(a => a.BcDriversLicenceNumber, "1234567")
            .With(a => a.PhoneNumber, "1234567")
            .With(a => a.GivenName, IntegrationTestSetup.DataPrefix + "GiveName")
            .With(a => a.Surname, IntegrationTestSetup.DataPrefix + "Surname")
            .With(a => a.MiddleName1, IntegrationTestSetup.DataPrefix + "MiddleName1")
            .With(a => a.MiddleName2, IntegrationTestSetup.DataPrefix + "MiddleName2")
            .With(a => a.DateOfBirth, DateOnly.FromDateTime(DateTime.Now))
            .With(a => a.OtherOfficerRole, IntegrationTestSetup.DataPrefix + "role")
            .With(a => a.ResidentialAddressData, fixture.Build<ResidentialAddr>()
                .With(a => a.PostalCode, "V9N 5J2")
                .With(a => a.AddressLine1, IntegrationTestSetup.DataPrefix + "AdressLine1").Create())
            .With(a => a.Aliases, new List<AliasResp> { })
            .With(a => a.UploadedDocumentEnums, new List<UploadedDocumentEnum> { UploadedDocumentEnum.Fingerprint })
            .With(a => a.ContactId, contactId)
            .With(a => a.BizContactId, bizContactId)
            .With(a => a.ParentBizLicApplicationId, bizlicAppId)
            .With(a => a.ControllingMemberAppId, controllingMemberAppId)
            .Create();
        contact? contact = new contact()
        {
            contactid = cmd.ContactId,
        };
        _context.AddTocontacts(contact);
        // Create Account, then set biz app's account
        account account = new account()
        {
            accountid = accountid,
        };
        _context.AddToaccounts(account);
        // Create Biz Licence app
        spd_application bizApp = new spd_application()
        {
            spd_applicationid = bizlicAppId
        };
        _context.AddTospd_applications(bizApp);
        _context.SetLink(bizApp, nameof(spd_application.spd_ApplicantId_account), account);
        await _context.SaveChangesAsync();
        // Create Biz Contact
        spd_businesscontact bizContact = new spd_businesscontact()
        {
            spd_businesscontactid = bizContactId,
            statecode = DynamicsConstants.StateCode_Active
        };
        _context.AddTospd_businesscontacts(bizContact);
        _context.AddLink(bizContact, nameof(bizContact.spd_businesscontact_spd_application), bizApp);
        await _context.SaveChangesAsync();

        // Action
        try
        {
            ControllingMemberCrcApplicationCmdResp? resp = await _controllingMemberCrcRepository.SaveControllingMemberCrcApplicationAsync(cmd, CancellationToken.None);
            controllingMemberAppId = resp.ControllingMemberAppId;
            // Assert
            ControllingMemberCrcApplicationResp getResult = await _controllingMemberCrcRepository.GetCrcApplicationAsync(resp.ControllingMemberAppId, CancellationToken.None);
            Assert.NotNull(getResult);
            Assert.Equal(getResult.GivenName, cmd.GivenName);
            Assert.Equal(getResult.Surname, cmd.Surname);
            Assert.Equal(getResult.DateOfBirth, cmd.DateOfBirth);
            Assert.Equal(getResult.MiddleName1, cmd.MiddleName1);
            Assert.Equal(getResult.GenderCode, cmd.GenderCode);
            Assert.Equal(getResult.PhoneNumber, cmd.PhoneNumber);
            Assert.Equal(getResult.Aliases, cmd.Aliases);
            Assert.Equal(getResult.OrganizationId, accountid);
            Assert.NotNull(getResult.CaseNumber);
        }
        catch (Exception e)
        {
            throw e.GetBaseException();
        }
        finally
        {
            //Clean up objects
            await CleanUpObject(contactId, accountid, bizlicAppId, bizContactId, controllingMemberAppId);
        }
    }
    [Fact]
    public async Task CreateControllingMemberCrcApplicationAsync_Run_Correctly()
    {
        // Arrange
        Guid accountid = Guid.NewGuid();
        Guid bizlicAppId = Guid.NewGuid();
        Guid bizContactId = Guid.NewGuid();
        Guid? controllingMemberAppId = null;
        Guid? contactId = null;
        SaveControllingMemberCrcAppCmd cmd = fixture.Build<SaveControllingMemberCrcAppCmd>()
            .With(a => a.BcDriversLicenceNumber, "1234567")
            .With(a => a.PhoneNumber, "1234567")
            .With(a => a.GivenName, IntegrationTestSetup.DataPrefix + "GiveName")
            .With(a => a.Surname, IntegrationTestSetup.DataPrefix + "Surname")
            .With(a => a.MiddleName1, IntegrationTestSetup.DataPrefix + "MiddleName1")
            .With(a => a.MiddleName2, IntegrationTestSetup.DataPrefix + "MiddleName2")
            .With(a => a.OtherOfficerRole, IntegrationTestSetup.DataPrefix + "role")
            .With(a => a.ResidentialAddressData, fixture.Build<ResidentialAddr>()
                .With(a => a.PostalCode, "V9N 5J2")
                .With(a => a.AddressLine1, IntegrationTestSetup.DataPrefix + "AdressLine1").Create())
            .With(a => a.Aliases, new List<AliasResp> { })
            .With(a => a.UploadedDocumentEnums, new List<UploadedDocumentEnum> { UploadedDocumentEnum.Fingerprint })
            .With(a => a.BizContactId, bizContactId)
            .With(a => a.ParentBizLicApplicationId, bizlicAppId)
            .With(a => a.ControllingMemberAppId, controllingMemberAppId)
            .Create();
        // Create Account, then set biz app's account
        account account = new account()
        {
            accountid = accountid,
        };
        _context.AddToaccounts(account);
        // Create Biz Licence app
        spd_application bizApp = new spd_application()
        {
            spd_applicationid = bizlicAppId
        };
        _context.AddTospd_applications(bizApp);
        _context.SetLink(bizApp, nameof(spd_application.spd_ApplicantId_account), account);
        await _context.SaveChangesAsync();
        // Create Biz Contact
        spd_businesscontact bizContact = new spd_businesscontact()
        {
            spd_businesscontactid = bizContactId,
            statecode = DynamicsConstants.StateCode_Active
        };
        _context.AddTospd_businesscontacts(bizContact);
        _context.AddLink(bizContact, nameof(bizContact.spd_businesscontact_spd_application), bizApp);
        await _context.SaveChangesAsync();



        // Action
        try
        {
            ControllingMemberCrcApplicationCmdResp? resp = await _controllingMemberCrcRepository.CreateControllingMemberCrcApplicationAsync(cmd, CancellationToken.None);
            controllingMemberAppId = resp.ControllingMemberAppId;
            contactId = resp.ContactId;
            // Assert
            Assert.NotNull(resp);

            spd_application? app = _context.spd_applications.Where(a => a.spd_applicationid == resp.ControllingMemberAppId).FirstOrDefault();
            contact? updatedApplicantContact = _context.contacts.Where(c => c.contactid == contactId).FirstOrDefault();
            spd_businesscontact? updatedbizContact = _context.spd_businesscontacts
                .Expand(b => b.spd_businesscontact_spd_application)
                .Where(b => b.spd_businesscontactid == cmd.BizContactId).FirstOrDefault();

            spd_application? updatedBizLicApp = _context.spd_applications
                .Expand(a => a.spd_businessapplication_spd_workerapplication)
                .Where(a => a.spd_applicationid == cmd.ParentBizLicApplicationId).FirstOrDefault();

            Assert.Equal(updatedbizContact?._spd_contactid_value, updatedApplicantContact?.contactid);
            Assert.True(updatedbizContact.spd_businesscontact_spd_application.Any(a => a.spd_applicationid == resp.ControllingMemberAppId));
            Assert.True(updatedBizLicApp.spd_businessapplication_spd_workerapplication.Any(a => a.spd_applicationid == resp.ControllingMemberAppId));

            Assert.True(string.Equals(updatedApplicantContact?.firstname, cmd.GivenName, StringComparison.OrdinalIgnoreCase));
            Assert.True(string.Equals(updatedApplicantContact?.lastname, cmd.Surname, StringComparison.OrdinalIgnoreCase));
            Assert.True(string.Equals(updatedApplicantContact?.spd_middlename1, cmd.MiddleName1, StringComparison.OrdinalIgnoreCase));
            Assert.True(string.Equals(updatedApplicantContact?.spd_middlename2, cmd.MiddleName2, StringComparison.OrdinalIgnoreCase));
            Assert.True(string.Equals(updatedApplicantContact?.address2_postalcode, cmd.ResidentialAddressData?.PostalCode, StringComparison.OrdinalIgnoreCase));
            Assert.True(string.Equals(updatedApplicantContact?.address2_line1, cmd.ResidentialAddressData?.AddressLine1, StringComparison.OrdinalIgnoreCase));

            Assert.Equal(app._spd_applicantid_value, updatedApplicantContact?.contactid);
            Assert.Equal("100000000", app.spd_uploadeddocuments);
            Assert.NotNull(app.spd_portalmodifiedon);
        }
        catch (Exception e)
        {
            throw e.GetBaseException();
        }
        finally
        {
            //Clean up objects
            await CleanUpObject(contactId, accountid, bizlicAppId, bizContactId, controllingMemberAppId);
        }
    }
    [Fact]
    public async Task CreateControllingMemberCrcApplicationAsync_With_Duplicate_Contact_Run_Correctly()
    {
        // Arrange
        Guid contactId = Guid.NewGuid();
        Guid accountid = Guid.NewGuid();
        Guid bizlicAppId = Guid.NewGuid();
        Guid bizContactId = Guid.NewGuid();
        Guid? aliasId = null;
        Guid? controllingMemberAppId = null;
        SaveControllingMemberCrcAppCmd cmd = fixture.Build<SaveControllingMemberCrcAppCmd>()
            .With(a => a.BcDriversLicenceNumber, "1234567")
            .With(a => a.PhoneNumber, "1234567")
            .With(a => a.GivenName, IntegrationTestSetup.DataPrefix + "GiveName11")
            .With(a => a.Surname, IntegrationTestSetup.DataPrefix + "Surname11")
            .With(a => a.MiddleName1, IntegrationTestSetup.DataPrefix + "MiddleName1")
            .With(a => a.MiddleName2, IntegrationTestSetup.DataPrefix + "MiddleName2")
            .With(a => a.DateOfBirth, DateOnly.FromDateTime(DateTime.Now))
            .With(a => a.OtherOfficerRole, IntegrationTestSetup.DataPrefix + "role")
            .With(a => a.ResidentialAddressData, fixture.Build<ResidentialAddr>()
                .With(a => a.PostalCode, "V9N 5J2")
                .With(a => a.AddressLine1, IntegrationTestSetup.DataPrefix + "AdressLine1").Create())
            .With(a => a.Aliases, new List<AliasResp> {
                new()
                {
                    GivenName = IntegrationTestSetup.DataPrefix + "AliasGivenName1",
                    Surname = IntegrationTestSetup.DataPrefix + "AliasSureName1"
                }
            })
            .With(a => a.UploadedDocumentEnums, new List<UploadedDocumentEnum> { UploadedDocumentEnum.Fingerprint })
            .With(a => a.BizContactId, bizContactId)
            .With(a => a.ParentBizLicApplicationId, bizlicAppId)
            .With(a => a.ControllingMemberAppId, controllingMemberAppId)
            .Create();
        contact? contact = new contact()
        {
            contactid = contactId,
            firstname = cmd.GivenName,
            lastname = cmd.Surname,
            birthdate = new Microsoft.OData.Edm.Date(cmd.DateOfBirth.Year, cmd.DateOfBirth.Month, cmd.DateOfBirth.Day),
            spd_bcdriverslicense = cmd.BcDriversLicenceNumber
        };
        _context.AddTocontacts(contact);
        // Create Account, then set biz app's account
        account account = new account()
        {
            accountid = accountid,
        };
        _context.AddToaccounts(account);
        // Create Biz Licence app
        spd_application bizApp = new spd_application()
        {
            spd_applicationid = bizlicAppId
        };
        _context.AddTospd_applications(bizApp);
        _context.SetLink(bizApp, nameof(spd_application.spd_ApplicantId_account), account);
        await _context.SaveChangesAsync();
        // Create Biz Contact
        spd_businesscontact bizContact = new spd_businesscontact()
        {
            spd_businesscontactid = bizContactId,
            statecode = DynamicsConstants.StateCode_Active
        };
        _context.AddTospd_businesscontacts(bizContact);
        _context.AddLink(bizContact, nameof(bizContact.spd_businesscontact_spd_application), bizApp);
        await _context.SaveChangesAsync();



        // Action
        try
        {
            cmd.MiddleName1 = IntegrationTestSetup.DataPrefix + "MiddleName1-Edited";

            ControllingMemberCrcApplicationCmdResp? resp = await _controllingMemberCrcRepository.CreateControllingMemberCrcApplicationAsync(cmd, CancellationToken.None);
            controllingMemberAppId = resp.ControllingMemberAppId;
            // Assert
            Assert.NotNull(resp);

            contact? updatedApplicantContact = _context.contacts.Where(c => c.contactid == resp.ContactId).FirstOrDefault();
            spd_application? app = _context.spd_applications.Where(a => a.spd_applicationid == resp.ControllingMemberAppId).FirstOrDefault();
            spd_businesscontact? updatedbizContact = _context.spd_businesscontacts
                .Expand(b => b.spd_businesscontact_spd_application)
                .Where(b => b.spd_businesscontactid == cmd.BizContactId).FirstOrDefault();

            spd_application? updatedBizLicApp = _context.spd_applications
                .Expand(a => a.spd_businessapplication_spd_workerapplication)
                .Where(a => a.spd_applicationid == cmd.ParentBizLicApplicationId).FirstOrDefault();

            spd_alias? alias = _context.spd_aliases.Where(a => a._spd_contactid_value == contactId).FirstOrDefault();
            aliasId = alias?.spd_aliasid;

            Assert.Equal(updatedbizContact?._spd_contactid_value, updatedApplicantContact?.contactid);
            Assert.True(updatedbizContact.spd_businesscontact_spd_application.Any(a => a.spd_applicationid == resp.ControllingMemberAppId));
            Assert.True(updatedBizLicApp.spd_businessapplication_spd_workerapplication.Any(a => a.spd_applicationid == resp.ControllingMemberAppId));

            Assert.True(string.Equals(updatedApplicantContact?.firstname, cmd.GivenName, StringComparison.OrdinalIgnoreCase));
            Assert.True(string.Equals(updatedApplicantContact?.lastname, cmd.Surname, StringComparison.OrdinalIgnoreCase));
            Assert.True(string.Equals(updatedApplicantContact?.spd_middlename1, cmd.MiddleName1, StringComparison.OrdinalIgnoreCase));
            Assert.True(string.Equals(updatedApplicantContact?.spd_middlename2, cmd.MiddleName2, StringComparison.OrdinalIgnoreCase));
            Assert.True(string.Equals(updatedApplicantContact?.address2_postalcode, cmd.ResidentialAddressData?.PostalCode, StringComparison.OrdinalIgnoreCase));
            Assert.True(string.Equals(updatedApplicantContact?.address2_line1, cmd.ResidentialAddressData?.AddressLine1, StringComparison.OrdinalIgnoreCase));
            Assert.True(string.Equals(alias?.spd_firstname, cmd.Aliases.First().GivenName, StringComparison.OrdinalIgnoreCase));
            Assert.True(string.Equals(alias?.spd_surname, cmd.Aliases.First().Surname, StringComparison.OrdinalIgnoreCase));

            Assert.Equal(app._spd_applicantid_value, updatedApplicantContact?.contactid);
            Assert.Equal("100000000", app.spd_uploadeddocuments);
            Assert.NotNull(app.spd_portalmodifiedon);
        }
        catch (Exception e)
        {
            throw e.GetBaseException();
        }
        finally
        {
            //Clean up objects
            await CleanUpObject(contactId, accountid, bizlicAppId, bizContactId, controllingMemberAppId, aliasId);
        }
    }

    private async Task CleanUpObject(Guid? contactId, Guid? accountid, Guid? bizlicAppId, Guid? bizContactId, Guid? controllingMemberAppId, Guid? aliasId = null)
    {
        spd_application? appToRemove = _context.spd_applications.Where(a => a.spd_applicationid == controllingMemberAppId).FirstOrDefault();

        if (appToRemove != null)
        {
            _context.DeleteObject(appToRemove);
            await _context.SaveChangesAsync();
        }
        contact? contactToRemove = _context.contacts.Where(c => c.contactid == contactId).FirstOrDefault();
        if (contactToRemove != null)
        {
            _context.DeleteObject(contactToRemove);
            await _context.SaveChangesAsync();
        }


        account? accountToRemove = _context.accounts.Where(a => a.accountid == accountid).FirstOrDefault();
        if (accountToRemove != null)
        {
            _context.DeleteObject(accountToRemove);
            await _context.SaveChangesAsync();
        }

        spd_businesscontact? bizContactToRemove = _context.spd_businesscontacts
           .Where(b => b.spd_businesscontactid == bizContactId).FirstOrDefault();
        if (bizContactToRemove != null)
        {
            _context.DeleteObject(bizContactToRemove);
            await _context.SaveChangesAsync();
        }
        spd_application? bizLicAppToRemove = _context.spd_applications
            .Where(a => a.spd_applicationid == bizlicAppId).FirstOrDefault();
        if (bizLicAppToRemove != null)
        {
            _context.DeleteObject(bizLicAppToRemove);
            await _context.SaveChangesAsync();
        }
        spd_alias? aliasToRemove = _context.spd_aliases
            .Where(a => a.spd_aliasid == aliasId).FirstOrDefault();
        if (aliasToRemove != null)
        {
            _context.DeleteObject(aliasToRemove);
            await _context.SaveChangesAsync();
        }
    }
}
