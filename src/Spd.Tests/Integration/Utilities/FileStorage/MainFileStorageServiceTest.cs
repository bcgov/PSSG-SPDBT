using System.Text;
using Microsoft.Extensions.DependencyInjection;
using Spd.Utilities.FileStorage;

namespace Spd.Tests.Integration.Utilities.FileStorage;

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
        var sourceFileName = IntegrationTestSetup.DataPrefix + Guid.NewGuid();
        var testFile = new Spd.Utilities.FileStorage.File
        {
            Content = Encoding.ASCII.GetBytes("samplefile"),
            ContentType = "application/txt",
            FileName = sourceFileName,
            Metadata = new List<FileMetadata>() { new FileMetadata("test", "value") }
        };
        await _transientFileService.HandleCommand(new UploadFileCommand(sourceFileName, IntegrationTestSetup.Folder, testFile, new FileTag { }),
            CancellationToken.None);

        //Act
        var targetFileName = sourceFileName;
        await _mainFileService.HandleCopyStorageFromTransientToMainCommand(
            new CopyStorageFromTransientToMainCommand(
                sourceFileName,
                IntegrationTestSetup.Folder,
                targetFileName,
                IntegrationTestSetup.Folder),
            CancellationToken.None);

        //Assert
        var queryResult = (FileMetadataQueryResult)await _mainFileService.HandleQuery(
            new FileMetadataQuery { Key = targetFileName, Folder = IntegrationTestSetup.Folder },
            CancellationToken.None);
        var fileExists = queryResult != null;
        Assert.True(fileExists);

        //Annihilate
        //cleanup transient bucket; files in main bucket are not allowed to be removed.
        await _transientFileService.HandleDeleteCommand(
            new StorageDeleteCommand(sourceFileName, IntegrationTestSetup.Folder),
            CancellationToken.None);
    }
}