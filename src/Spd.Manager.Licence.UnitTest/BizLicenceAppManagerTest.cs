﻿using AutoFixture;
using AutoMapper;
using Moq;
using Spd.Resource.Repository.BizContact;
using Spd.Resource.Repository.BizLicApplication;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.LicApp;
using Spd.Resource.Repository.Licence;
using Spd.Resource.Repository.LicenceFee;
using Spd.Utilities.FileStorage;
using Spd.Utilities.Shared.Exceptions;
using System.Collections.Generic;

namespace Spd.Manager.Licence.UnitTest;
public class BizLicenceAppManagerTest
{
    private readonly IFixture fixture;
    private Mock<ILicenceRepository> mockLicRepo = new();
    private Mock<ILicAppRepository> mockLicAppRepo = new();
    private Mock<IDocumentRepository> mockDocRepo = new();
    private Mock<ILicenceFeeRepository> mockLicFeeRepo = new();
    private Mock<IMainFileStorageService> mockMainFileService = new();
    private Mock<ITransientFileStorageService> mockTransientFileStorageService = new();
    private Mock<IBizLicApplicationRepository> mockBizLicAppRepo = new();
    private Mock<IBizContactRepository> mockBizContactRepo = new();
    private BizLicAppManager sut;

    public BizLicenceAppManagerTest()
    {
        fixture = new Fixture();
        fixture.Customize<DateOnly>(composer => composer.FromFactory<DateTime>(DateOnly.FromDateTime));
        fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());

        var mapperConfig = new MapperConfiguration(x =>
        {
            x.AddProfile<Mappings>();
        });
        var mapper = mapperConfig.CreateMapper();

        sut = new BizLicAppManager(
            mockLicRepo.Object,
            mockLicAppRepo.Object,
            mapper,
            mockDocRepo.Object,
            mockLicFeeRepo.Object,
            mockMainFileService.Object,
            mockTransientFileStorageService.Object,
            mockBizContactRepo.Object,
            mockBizLicAppRepo.Object);
    }

    [Fact]
    public async void Handle_GetBizLicAppQuery_Return_BizLicAppResponse()
    {
        // Arrange
        Guid licAppId = Guid.NewGuid();
        mockBizLicAppRepo.Setup(m => m.GetBizLicApplicationAsync(It.Is<Guid>(q => q == licAppId), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new BizLicApplicationResp()
            {
                LicenceAppId = licAppId,
                BizId = Guid.NewGuid(),
                ApplicantIsBizManager = true
            });
        mockDocRepo.Setup(m => m.QueryAsync(It.Is<DocumentQry>(q => q.ApplicationId == licAppId), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new DocumentListResp());

        // Act
        var viewResult = await sut.Handle(new GetBizLicAppQuery(licAppId), CancellationToken.None);

        // Assert
        Assert.IsType<BizLicAppResponse>(viewResult);
        Assert.Equal(licAppId, viewResult.LicenceAppId);
    }

    [Fact]
    public async void Handle_BizLicAppUpsertCommand_WithoutLicAppId_Return_BizLicAppCommandResponse()
    {
        //Arrange
        //no duplicates; no licAppId: means create a brand new application.
        Guid bizId = Guid.NewGuid();
        Guid licAppId = Guid.NewGuid();
        mockLicAppRepo.Setup(a => a.QueryAsync(It.Is<LicenceAppQuery>(q => q.ApplicantId == bizId), CancellationToken.None))
            .ReturnsAsync(new List<LicenceAppListResp>()); //no dup lic app
        mockLicRepo.Setup(a => a.QueryAsync(It.Is<LicenceQry>(q => q.ContactId == bizId), CancellationToken.None)) //no dup lic
            .ReturnsAsync(new LicenceListResp()
            {
                Items = new List<LicenceResp> { }
            });
        mockBizLicAppRepo.Setup(a => a.SaveBizLicApplicationAsync(It.IsAny<SaveBizLicApplicationCmd>(), CancellationToken.None))
            .ReturnsAsync(new BizLicApplicationCmdResp(licAppId, bizId));
        mockDocRepo.Setup(m => m.QueryAsync(It.Is<DocumentQry>(q => q.ApplicationId == licAppId), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new DocumentListResp());

        var workPermit = fixture.Build<Document>()
            .With(d => d.LicenceDocumentTypeCode, LicenceDocumentTypeCode.WorkPermit)
            .Create();

        Members members = new()
        {
            SwlControllingMembers = new List<SwlContactInfo>(),
            NonSwlControllingMembers = new List<NonSwlContactInfo>(),
            Employees = new List<SwlContactInfo>()
        };

        BizLicAppUpsertRequest request = new()
        {
            LicenceAppId = null,
            WorkerLicenceTypeCode = WorkerLicenceTypeCode.SecurityWorkerLicence,
            BizId = bizId,
            DocumentInfos = new List<Document>() { workPermit },
            Members = members
        };

        //Act
        var viewResult = await sut.Handle(new BizLicAppUpsertCommand(request), CancellationToken.None);

        //Assert
        Assert.IsType<BizLicAppCommandResponse>(viewResult);
        Assert.Equal(licAppId, viewResult.LicenceAppId);
    }

    [Fact]
    public async void Handle_BizLicAppUpsertCommand_WithDuplicateLic_Throw_Exception()
    {
        //Arrange
        //have licAppId in the upsert request and there is duplicated same type active licence.
        Guid licAppId = Guid.NewGuid();
        Guid bizId = Guid.NewGuid();

        mockLicAppRepo.Setup(a => a.QueryAsync(It.Is<LicenceAppQuery>(q => q.ApplicantId == bizId), CancellationToken.None))
            .ReturnsAsync(new List<LicenceAppListResp> {
                new() { LicenceAppId = licAppId }
            });
        mockLicRepo.Setup(a => a.QueryAsync(It.Is<LicenceQry>(q => q.ContactId == bizId), CancellationToken.None))
            .ReturnsAsync(new LicenceListResp()
            {
                Items = new List<LicenceResp>
                {
                    new(){ LicenceId = Guid.NewGuid() }
                }
            });

        BizLicAppUpsertRequest request = new()
        {
            LicenceAppId = licAppId,
            WorkerLicenceTypeCode = WorkerLicenceTypeCode.SecurityWorkerLicence,
            BizId = bizId
        };

        //Act
        Func<Task> act = () => sut.Handle(new BizLicAppUpsertCommand(request), CancellationToken.None);

        //Assert
        await Assert.ThrowsAsync<ApiException>(act);
    }

    [Fact]
    public async void Handle_BizLicAppUpsertCommand_WithDuplicateApp_Throw_Exception()
    {
        //Arrange
        //have licAppId in the upsert request and there is duplicated same type active application.
        Guid licAppId = Guid.NewGuid();
        Guid bizId = Guid.NewGuid();
        mockLicAppRepo.Setup(a => a.QueryAsync(It.Is<LicenceAppQuery>(q => q.ApplicantId == bizId), CancellationToken.None))
            .ReturnsAsync(new List<LicenceAppListResp> {
                    new() { LicenceAppId = licAppId },
                    new() { LicenceAppId = Guid.NewGuid() } });

        BizLicAppUpsertRequest request = new()
        {
            LicenceAppId = licAppId,
            WorkerLicenceTypeCode = WorkerLicenceTypeCode.SecurityWorkerLicence,
            BizId = bizId,
        };

        //Act
        Func<Task> act = () => sut.Handle(new BizLicAppUpsertCommand(request), CancellationToken.None);

        //Assert
        await Assert.ThrowsAsync<ApiException>(act);
    }

    [Fact]
    public async void Handle_BizLicAppSubmitCommand_WithoutLicAppId_Return_BizLicAppCommandResponse()
    {
        //Arrange
        //no duplicates; no licAppId: means create a brand new application.
        Guid bizId = Guid.NewGuid();
        Guid licAppId = Guid.NewGuid();
        LicenceFeeResp licenceFeeResp = new() { Amount = 100 };
        mockLicAppRepo.Setup(a => a.QueryAsync(It.Is<LicenceAppQuery>(q => q.ApplicantId == bizId), CancellationToken.None))
            .ReturnsAsync(new List<LicenceAppListResp>()); //no dup lic app
        mockLicRepo.Setup(a => a.QueryAsync(It.Is<LicenceQry>(q => q.ContactId == bizId), CancellationToken.None)) //no dup lic
            .ReturnsAsync(new LicenceListResp()
            {
                Items = new List<LicenceResp> { }
            });
        mockBizLicAppRepo.Setup(a => a.SaveBizLicApplicationAsync(It.IsAny<SaveBizLicApplicationCmd>(), CancellationToken.None))
            .ReturnsAsync(new BizLicApplicationCmdResp(licAppId, bizId));
        mockDocRepo.Setup(m => m.QueryAsync(It.Is<DocumentQry>(q => q.ApplicationId == licAppId), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new DocumentListResp());
        mockLicFeeRepo.Setup(m => m.QueryAsync(It.IsAny<LicenceFeeQry>(), CancellationToken.None))
            .ReturnsAsync(new LicenceFeeListResp() { LicenceFees = new List<LicenceFeeResp> { licenceFeeResp } });

        var workPermit = fixture.Build<Document>()
            .With(d => d.LicenceDocumentTypeCode, LicenceDocumentTypeCode.WorkPermit)
            .Create();

        Members members = new()
        {
            SwlControllingMembers = new List<SwlContactInfo>(),
            NonSwlControllingMembers = new List<NonSwlContactInfo>(),
            Employees = new List<SwlContactInfo>()
        };

        BizLicAppUpsertRequest request = new()
        {
            LicenceAppId = null,
            WorkerLicenceTypeCode = WorkerLicenceTypeCode.SecurityWorkerLicence,
            BizId = bizId,
            DocumentInfos = new List<Document>() { workPermit },
            Members = members
        };

        //Act
        var viewResult = await sut.Handle(new BizLicAppSubmitCommand(request), CancellationToken.None);

        //Assert
        Assert.IsType<BizLicAppCommandResponse>(viewResult);
        Assert.Equal(licAppId, viewResult.LicenceAppId);
        Assert.Equal(licenceFeeResp.Amount, viewResult.Cost);
    }

    [Fact]
    public async void Handle_BizLicAppRenewCommand_Return_BizLicAppCommandResponse()
    {
        // Arrange
        Guid originalApplicationId = Guid.NewGuid();
        Guid originalLicenceId = Guid.NewGuid();
        Guid newLicAppId = Guid.NewGuid();
        Guid bizId = Guid.NewGuid();
        DateTime dateTime = DateTime.UtcNow.AddDays(Constants.LicenceWith123YearsRenewValidBeforeExpirationInDays);
        DateOnly expiryDate = new(dateTime.Year, dateTime.Month, dateTime.Day);
        LicenceResp originalLicence = fixture.Build<LicenceResp>()
            .With(r => r.ExpiryDate, expiryDate)
            .Create();
        LicenceFeeResp licenceFeeResp = new() { Amount = 100 };

        mockLicRepo.Setup(a => a.QueryAsync(It.Is<LicenceQry>(q => q.LicenceId == originalLicenceId), CancellationToken.None))
            .ReturnsAsync(new LicenceListResp()
            {
                Items = new List<LicenceResp> { originalLicence }
            });
        mockBizLicAppRepo.Setup(a => a.CreateBizLicApplicationAsync(It.Is<CreateBizLicApplicationCmd>(
            m => m.OriginalApplicationId == originalApplicationId && 
            m.OriginalLicenceId == originalLicenceId), CancellationToken.None))
            .ReturnsAsync(new BizLicApplicationCmdResp(newLicAppId, bizId));
        mockLicFeeRepo.Setup(m => m.QueryAsync(It.IsAny<LicenceFeeQry>(), CancellationToken.None))
            .ReturnsAsync(new LicenceFeeListResp() { LicenceFees = new List<LicenceFeeResp> { licenceFeeResp } });

        BizLicAppSubmitRequest request = new()
        {
            ApplicationTypeCode = Shared.ApplicationTypeCode.Renewal,
            OriginalLicenceId = originalLicenceId,
            OriginalApplicationId = originalApplicationId,
            NoBranding = false,
            UseDogs = true,
            CategoryCodes = new List<WorkerCategoryTypeCode>() { WorkerCategoryTypeCode.ArmouredCarGuard }
        };
        List<LicAppFileInfo> files = new();
        List<LicAppFileInfo> branding = fixture.Build<LicAppFileInfo>()
            .With(f => f.LicenceDocumentTypeCode, LicenceDocumentTypeCode.BizBranding)
            .CreateMany(10)
            .ToList();
        LicAppFileInfo insurnace = new() { LicenceDocumentTypeCode = LicenceDocumentTypeCode.BizInsurance };
        LicAppFileInfo dogCertificate = new() { LicenceDocumentTypeCode = LicenceDocumentTypeCode.BizSecurityDogCertificate };
        LicAppFileInfo armourCarCertificate = new() { LicenceDocumentTypeCode = LicenceDocumentTypeCode.ArmourCarGuardRegistrar }; 
        files.AddRange(branding);
        files.Add(insurnace);
        files.Add(dogCertificate);
        files.Add(armourCarCertificate);
        BizLicAppRenewCommand cmd = new(request, files);

        // Action
        var result = await sut.Handle(cmd, CancellationToken.None);

        // Assert
        Assert.IsType<BizLicAppCommandResponse>(result);
        Assert.Equal(newLicAppId, result.LicenceAppId);
        Assert.Equal(licenceFeeResp.Amount, result.Cost);
    }

    [Fact]
    public async void Handle_BizLicAppRenewCommand_WithWrongApplicationType_Throw_Exception()
    {
        // Arrange
        BizLicAppSubmitRequest request = new()
        {
            ApplicationTypeCode = Shared.ApplicationTypeCode.New
        };
        BizLicAppRenewCommand cmd = new(request, new List<LicAppFileInfo>());

        // Action
        Func<Task> act = () => sut.Handle(cmd, CancellationToken.None);

        // Assert
        await Assert.ThrowsAsync<ArgumentException>(act);
    }

    [Fact]
    public async void Handle_BizLicAppRenewCommand_WithoutOriginalLicence_Throw_Exception()
    {
        // Arrange
        mockLicRepo.Setup(a => a.QueryAsync(It.IsAny<LicenceQry>(), CancellationToken.None))
            .ReturnsAsync(new LicenceListResp()
            {
                Items = new List<LicenceResp>()
            });

        BizLicAppSubmitRequest request = new()
        {
            ApplicationTypeCode = Shared.ApplicationTypeCode.Renewal
        };
        BizLicAppRenewCommand cmd = new(request, new List<LicAppFileInfo>());

        // Action
        Func<Task> act = () => sut.Handle(cmd, CancellationToken.None);

        // Assert
        await Assert.ThrowsAsync<ArgumentException>(act);
    }

    [Fact]
    public async void Handle_BizLicAppRenewCommand_WithInvalidExpirationDate_Throw_Exception()
    {
        // Arrange
        DateOnly expiryDate = new(DateTime.UtcNow.Year, DateTime.UtcNow.Month, DateTime.UtcNow.Day);
        LicenceResp originalLicence = fixture.Build<LicenceResp>()
            .With(r => r.ExpiryDate, expiryDate)
            .Create();

        mockLicRepo.Setup(a => a.QueryAsync(It.IsAny<LicenceQry>(), CancellationToken.None))
            .ReturnsAsync(new LicenceListResp()
            {
                Items = new List<LicenceResp>() { originalLicence }
            });

        BizLicAppSubmitRequest request = new()
        {
            ApplicationTypeCode = Shared.ApplicationTypeCode.Renewal
        };
        BizLicAppRenewCommand cmd = new(request, new List<LicAppFileInfo>());

        // Action
        Func<Task> act = () => sut.Handle(cmd, CancellationToken.None);

        // Assert
        await Assert.ThrowsAsync<ArgumentException>(act);
    }

    [Fact]
    public async void Handle_BizLicAppRenewCommand_WithMissingFiles_Throw_Exception()
    {
        // Arrange
        DateTime dateTime = DateTime.UtcNow.AddDays(Constants.LicenceWith123YearsRenewValidBeforeExpirationInDays);
        DateOnly expiryDate = new(dateTime.Year, dateTime.Month, dateTime.Day);
        LicenceResp originalLicence = fixture.Build<LicenceResp>()
            .With(r => r.ExpiryDate, expiryDate)
            .Create();

        mockLicRepo.Setup(a => a.QueryAsync(It.IsAny<LicenceQry>(), CancellationToken.None))
            .ReturnsAsync(new LicenceListResp()
            {
                Items = new List<LicenceResp> { originalLicence }
            });

        BizLicAppSubmitRequest request = new()
        {
            ApplicationTypeCode = Shared.ApplicationTypeCode.Renewal,
            NoBranding = true,
            UseDogs = false
        };
        LicAppFileInfo bizInsurenceFile = new() { LicenceDocumentTypeCode = LicenceDocumentTypeCode.BizInsurance };
        BizLicAppRenewCommand cmd = new(request, new List<LicAppFileInfo>());

        // Action
        Func<Task> act = () => sut.Handle(cmd, CancellationToken.None);

        // Assert
        await Assert.ThrowsAsync<ApiException>(act);
    }
}