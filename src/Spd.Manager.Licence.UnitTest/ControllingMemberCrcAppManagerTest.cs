using Moq;
using Moq.Protected;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using Spd.Manager.Licence;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.ControllingMemberCrcApplication;
using Spd.Utilities.Shared.Exceptions;
using Spd.Resource.Repository.LicApp;
using Spd.Resource.Repository.Licence;
using Spd.Resource.Repository.LicenceFee;
using Spd.Utilities.FileStorage;
using Spd.Manager.Printing.Documents.TransformationStrategies;
using Mappings = Spd.Manager.Licence.Mappings;
using Microsoft.AspNetCore.Mvc;

public class ControllingMemberCrcAppManagerTests
{
    private readonly Mock<ControllingMemberCrcAppManager> _managerMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly Mock<IDocumentRepository> _documentRepositoryMock;
    private readonly Mock<ILicenceFeeRepository> _feeRepositoryMock;
    private readonly Mock<ILicenceRepository> _licenceRepositoryMock;
    private readonly Mock<IMainFileStorageService> _mainFileServiceMock;
    private readonly Mock<ITransientFileStorageService> _transientFileServiceMock;
    private readonly Mock<IControllingMemberCrcRepository> _controllingMemberCrcRepositoryMock;
    private readonly Mock<ILicAppRepository> _licAppRepositoryMock;
    private ControllingMemberCrcAppManager sut;


    public ControllingMemberCrcAppManagerTests()
    {
        _mapperMock = new Mock<IMapper>();
        _documentRepositoryMock = new Mock<IDocumentRepository>();
        _feeRepositoryMock = new Mock<ILicenceFeeRepository>();
        _licenceRepositoryMock = new Mock<ILicenceRepository>();
        _mainFileServiceMock = new Mock<IMainFileStorageService>();
        _transientFileServiceMock = new Mock<ITransientFileStorageService>();
        _controllingMemberCrcRepositoryMock = new Mock<IControllingMemberCrcRepository>();
        _licAppRepositoryMock = new Mock<ILicAppRepository>();
        var mapperConfig = new MapperConfiguration(x =>
        {
            x.AddProfile<Mappings>();
        });
        var mapper = mapperConfig.CreateMapper();
            
        sut = new ControllingMemberCrcAppManager(mapper,_documentRepositoryMock.Object,
        _feeRepositoryMock.Object,
        _licenceRepositoryMock.Object,
        _mainFileServiceMock.Object,
        _transientFileServiceMock.Object, _controllingMemberCrcRepositoryMock.Object, _licAppRepositoryMock.Object);
    }

    [Fact]
    public async Task Handle_anonymous_submit_WhithValidRequest()
    {
        Guid applicantId = Guid.NewGuid();
        Guid controllingMemberAppId = Guid.NewGuid();
        // Arrange
        var request = new ControllingMemberCrcAppSubmitRequest
        {
            IsCanadianCitizen = true,
            IsPoliceOrPeaceOfficer = true,
            IsTreatedForMHC = false,
        };
        

        var command = new ControllingMemberCrcAppSubmitRequestCommand(request,
            new List<LicAppFileInfo>
                {
                    new LicAppFileInfo { LicenceDocumentTypeCode = LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict },
                    new LicAppFileInfo { LicenceDocumentTypeCode = LicenceDocumentTypeCode.ProofOfFingerprint }, 
                    new LicAppFileInfo { LicenceDocumentTypeCode = LicenceDocumentTypeCode.CanadianPassport } 
            });



        _licAppRepositoryMock.Setup(a => a.QueryAsync(It.IsAny<LicenceAppQuery>(), CancellationToken.None))
               .ReturnsAsync(new List<LicenceAppListResp>()); //no dup lic app
        _licenceRepositoryMock.Setup(a => a.QueryAsync(It.IsAny<LicenceQry>(), CancellationToken.None)) //no dup lic
            .ReturnsAsync(new LicenceListResp()
            {
                Items = new List<LicenceResp> { }
            });
        _controllingMemberCrcRepositoryMock.Setup(a => a.CreateControllingMemberCrcApplicationAsync(It.IsAny<CreateControllingMemberCrcAppCmd>(), CancellationToken.None))
            .ReturnsAsync(new ControllingMemberCrcApplicationCmdResp(controllingMemberAppId, applicantId));
        _documentRepositoryMock.Setup(m => m.QueryAsync(It.Is<DocumentQry>(q => q.ApplicationId == controllingMemberAppId), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new DocumentListResp()
            {
                Items = new List<DocumentResp> { new() }
            });
        _transientFileServiceMock.Setup(m => m.HandleQuery(It.IsAny<FileMetadataQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new FileMetadataQueryResult("key", "folder", null));
        _mainFileServiceMock.Setup(m => m.HandleCopyStorageFromTransientToMainCommand(It.IsAny<CopyStorageFromTransientToMainCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync("string");
        _transientFileServiceMock.Setup(m => m.HandleDeleteCommand(It.IsAny<StorageDeleteCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync("string");

        // Act
        var result = await sut.Handle(command, CancellationToken.None);

        // Assert
        Assert.IsType<ControllingMemberCrcAppCommandResponse>(result);

        Assert.NotNull(result);
        Assert.Equal(result.ControllingMemberAppId, controllingMemberAppId);
        _mainFileServiceMock.Verify();
        _transientFileServiceMock.Verify();

    }
    [Fact]
    public async Task Handle_anonymous_submit_WhithoutFingerPrint_ShouldReturnError()
    {
        Guid applicantId = Guid.NewGuid();
        Guid controllingMemberAppId = Guid.NewGuid();
        // Arrange
        var request = new ControllingMemberCrcAppSubmitRequest
        {
            IsCanadianCitizen = true,
            IsPoliceOrPeaceOfficer = true,
            IsTreatedForMHC = false,
        };


        var command = new ControllingMemberCrcAppSubmitRequestCommand(request,
            new List<LicAppFileInfo>
                {
                    new LicAppFileInfo { LicenceDocumentTypeCode = LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict },
                    new LicAppFileInfo { LicenceDocumentTypeCode = LicenceDocumentTypeCode.CanadianPassport }
            });



        _licAppRepositoryMock.Setup(a => a.QueryAsync(It.IsAny<LicenceAppQuery>(), CancellationToken.None))
               .ReturnsAsync(new List<LicenceAppListResp>()); //no dup lic app
        _licenceRepositoryMock.Setup(a => a.QueryAsync(It.IsAny<LicenceQry>(), CancellationToken.None)) //no dup lic
            .ReturnsAsync(new LicenceListResp()
            {
                Items = new List<LicenceResp> { }
            });
        _controllingMemberCrcRepositoryMock.Setup(a => a.CreateControllingMemberCrcApplicationAsync(It.IsAny<CreateControllingMemberCrcAppCmd>(), CancellationToken.None))
            .ReturnsAsync(new ControllingMemberCrcApplicationCmdResp(controllingMemberAppId, applicantId));
        _documentRepositoryMock.Setup(m => m.QueryAsync(It.Is<DocumentQry>(q => q.ApplicationId == controllingMemberAppId), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new DocumentListResp()
            {
                Items = new List<DocumentResp> { new() }
            });
        _transientFileServiceMock.Setup(m => m.HandleQuery(It.IsAny<FileMetadataQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new FileMetadataQueryResult("key", "folder", null));
        _mainFileServiceMock.Setup(m => m.HandleCopyStorageFromTransientToMainCommand(It.IsAny<CopyStorageFromTransientToMainCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync("string");
        _transientFileServiceMock.Setup(m => m.HandleDeleteCommand(It.IsAny<StorageDeleteCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync("string");

        // Act and Assert
        Func<Task> act = () => sut.Handle(command, CancellationToken.None);
        await Assert.ThrowsAsync<ApiException>(act);
    }
}
