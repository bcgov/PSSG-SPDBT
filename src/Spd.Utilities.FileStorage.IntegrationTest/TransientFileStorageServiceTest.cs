using Microsoft.Extensions.DependencyInjection;
using System.Text;

namespace Spd.Utilities.FileStorage.IntegrationTest;
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
        string fileName = IntegrationTestSetup.DataPrefix + Guid.NewGuid();
        File testFile = new File
        {
            Content = Encoding.ASCII.GetBytes("samplefile"),
            ContentType = "application/txt",
            FileName = fileName,
            Metadata = new List<Metadata>() { new Metadata("test", "value") }
        };
        await _transientFileService.HandleCommand(new UploadFileCommand(fileName, IntegrationTestSetup.Folder, testFile, new FileTag { }),
            CancellationToken.None);

        //Act
        string targetFileName = fileName;
        await _transientFileService.HandleDeleteCommand(
            new StorageDeleteCommand(
                fileName,
                IntegrationTestSetup.Folder),
            CancellationToken.None);

        //Assert
        FileMetadataQueryResult queryResult = (FileMetadataQueryResult)await _transientFileService.HandleQuery(
            new FileMetadataQuery { Key = fileName, Folder = IntegrationTestSetup.Folder },
            CancellationToken.None);
        bool fileExists = queryResult != null;
        Assert.False(fileExists);
    }
}
