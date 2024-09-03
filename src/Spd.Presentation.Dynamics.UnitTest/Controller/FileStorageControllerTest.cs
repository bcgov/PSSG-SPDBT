using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Spd.Presentation.Dynamics.Controllers;
using Spd.Presentation.Dynamics.Models;
using Spd.Utilities.FileStorage;
using System.Text;

namespace Spd.Presentation.Dynamics.UnitTest.Controller;
public class FileStorageControllerTest
{
    private Mock<IMainFileStorageService> mockService = new Mock<IMainFileStorageService>();
    private Mock<ITransientFileStorageService> mockTransientService = new Mock<ITransientFileStorageService>();
    private FileStorageController sut;
    public FileStorageControllerTest()
    {
        mockService.Setup(s => s.HandleQuery(It.IsAny<FileMetadataQuery>(), CancellationToken.None))
            .ReturnsAsync(new FileMetadataQueryResult("fileId", "folder", Array.Empty<FileMetadata>()));
        mockService.Setup(s => s.HandleCommand(It.IsAny<UploadFileCommand>(),
            CancellationToken.None))
            .ReturnsAsync("key");
        sut = new FileStorageController(mockService.Object, mockTransientService.Object);
    }

    [Fact]
    public async void Post_UploadFileAsync_WhenModelStateIsValid_FileExist_Return_Ok()
    {
        //Arrange
        Guid fileId = Guid.NewGuid();
        string classification = "classification";
        string tags = "tag1=a,tag2=b";
        string folder = "folder";
        using var stream = new MemoryStream(Encoding.ASCII.GetBytes("samplefile"));
        var formFile = new FormFile(stream, 0, stream.Length, "sampleFile", "samplefile.txt")
        {
            Headers = new HeaderDictionary(),
            ContentType = "application/txt"
        };

        //Act
        var viewResult = await sut.UploadFileAsync(new UploadFileRequest() { File = formFile }, fileId, classification, tags, folder, CancellationToken.None);

        //Assert
        Assert.IsType<OkResult>(viewResult);
        mockService.Verify();
    }

    [Fact]
    public async void Post_UploadFileAsync_WhenModelStateIsValid_FileNotExist_Return_Created()
    {
        //Arrange
        Guid fileId = Guid.NewGuid();
        string classification = "classification";
        string tags = "tag1=a,tag2=b";
        string folder = "folder";
        mockService.Setup(s => s.HandleQuery(It.IsAny<FileMetadataQuery>(), CancellationToken.None))
            .ReturnsAsync((FileMetadataQueryResult)null);
        using var stream = new MemoryStream(Encoding.ASCII.GetBytes("samplefile"));
        var formFile = new FormFile(stream, 0, stream.Length, "sampleFile", "samplefile.txt")
        {
            Headers = new HeaderDictionary(),
            ContentType = "application/txt"
        };

        //Act
        var viewResult = await sut.UploadFileAsync(new UploadFileRequest() { File = formFile }, fileId, classification, tags, folder, CancellationToken.None);

        //Assert
        Assert.IsType<StatusCodeResult>(viewResult);
        Assert.Equal(201, ((StatusCodeResult)viewResult).StatusCode);
        mockService.Verify();
    }

    [Fact]
    public async void Post_MoveFileAsync_Return_Created()
    {
        //Arrange
        mockTransientService.Setup(s => s.HandleQuery(It.IsAny<FileMetadataQuery>(), CancellationToken.None))
            .ReturnsAsync(new FileMetadataQueryResult("fileId", "folder", Array.Empty<FileMetadata>()));
        mockService.Setup(s => s.HandleCopyStorageFromTransientToMainCommand(It.IsAny<CopyStorageFromTransientToMainCommand>(), CancellationToken.None))
            .ReturnsAsync("key");
        mockTransientService.Setup(s => s.HandleDeleteCommand(It.IsAny<StorageDeleteCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync("key");

        //Act
        var viewResult = await sut.MoveFileAsync(new MoveFileRequest() { SourceKey = "source", DestKey = "dest" },
            CancellationToken.None);

        //Assert
        Assert.IsType<StatusCodeResult>(viewResult);
        Assert.Equal(201, ((StatusCodeResult)viewResult).StatusCode);
        mockService.Verify();
    }
}
