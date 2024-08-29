using System.Text;
using Microsoft.Extensions.DependencyInjection;
using Spd.Utilities.FileStorage;

namespace Spd.Tests.Integration.Utilities.FileStorage;

public class TransientFileStorageServiceTest : IClassFixture<IntegrationTestSetup>
{
    private readonly ITransientFileStorageService _transientFileService;

    public TransientFileStorageServiceTest(IntegrationTestSetup testSetup)
    {
        _transientFileService = testSetup.ServiceProvider.GetService<ITransientFileStorageService>();
    }

    [Fact]
    public async Task HandleDeleteCommand_Run_Correctly()
    {
        //Arrange
        //create a file in transient bucket
        var fileName = IntegrationTestSetup.DataPrefix + Guid.NewGuid();
        var testFile = new Spd.Utilities.FileStorage.File
        {
            Content = Encoding.ASCII.GetBytes("samplefile"),
            ContentType = "application/txt",
            FileName = fileName,
            Metadata = new List<FileMetadata>() { new FileMetadata("test", "value") }
        };
        await _transientFileService.HandleCommand(new UploadFileCommand(fileName, IntegrationTestSetup.Folder, testFile, new FileTag { }),
            CancellationToken.None);

        //Act
        var targetFileName = fileName;
        await _transientFileService.HandleDeleteCommand(
            new StorageDeleteCommand(
                fileName,
                IntegrationTestSetup.Folder),
            CancellationToken.None);

        //Assert
        var queryResult = (FileMetadataQueryResult)await _transientFileService.HandleQuery(
            new FileMetadataQuery { Key = fileName, Folder = IntegrationTestSetup.Folder },
            CancellationToken.None);
        var fileExists = queryResult != null;
        Assert.False(fileExists);
    }
}