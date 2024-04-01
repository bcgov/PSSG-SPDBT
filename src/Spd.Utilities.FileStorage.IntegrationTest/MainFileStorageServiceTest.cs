using Microsoft.Extensions.DependencyInjection;
using System.Text;

namespace Spd.Utilities.FileStorage.IntegrationTest;
public class MainFileStorageServiceTest : IClassFixture<IntegrationTestSetup>
{
    private readonly IMainFileStorageService _mainFileService;
    private readonly ITransientFileStorageService _transientFileService;

    public MainFileStorageServiceTest(IntegrationTestSetup testSetup)
    {
        _mainFileService = testSetup.ServiceProvider.GetService<IMainFileStorageService>();
        _transientFileService = testSetup.ServiceProvider.GetService<ITransientFileStorageService>();
    }

    [Fact]
    public async Task HandleCopyFileFromTransientToMainCommand_Run_Correctly()
    {
        //Arrange
        //create a file in transient bucket
        string sourceFileName = IntegrationTestSetup.DataPrefix + Guid.NewGuid();
        File testFile = new File
        {
            Content = Encoding.ASCII.GetBytes("samplefile"),
            ContentType = "application/txt",
            FileName = sourceFileName,
            Metadata = new List<Metadata>() { new Metadata("test", "value") }
        };
        await _transientFileService.HandleCommand(new UploadFileCommand(sourceFileName, IntegrationTestSetup.Folder, testFile, new FileTag { }),
            CancellationToken.None);

        //Act
        string targetFileName = sourceFileName;
        await _mainFileService.HandleCopyStorageFromTransientToMainCommand(
            new CopyStorageFromTransientToMainCommand(
                sourceFileName,
                IntegrationTestSetup.Folder,
                targetFileName,
                IntegrationTestSetup.Folder),
            CancellationToken.None);

        //Assert
        FileMetadataQueryResult queryResult = (FileMetadataQueryResult)await _mainFileService.HandleQuery(
            new FileMetadataQuery { Key = targetFileName, Folder = IntegrationTestSetup.Folder },
            CancellationToken.None);
        bool fileExists = queryResult != null;
        Assert.True(fileExists);

        //Annihilate
        //cleanup transient bucket; files in main bucket are not allowed to be removed.
        await _transientFileService.HandleDeleteCommand(
            new StorageDeleteCommand(sourceFileName, IntegrationTestSetup.Folder),
            CancellationToken.None);
    }
}
