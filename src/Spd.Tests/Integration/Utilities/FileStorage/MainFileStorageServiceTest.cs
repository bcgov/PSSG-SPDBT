using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Spd.Utilities.FileStorage;
using System.Text;
using Xunit.Abstractions;

namespace Spd.Tests.Integration.Utilities.FileStorage;

public class MainFileStorageServiceTest : IntegrationTestBase
{
    private readonly IMainFileStorageService _mainFileService;
    private readonly ITransientFileStorageService _transientFileService;

    public MainFileStorageServiceTest(ITestOutputHelper output, IntegrationTestFixture fixture) : base(output, fixture)
    {
        _mainFileService = Fixture.ServiceProvider.GetService<IMainFileStorageService>()!;
        _transientFileService = Fixture.ServiceProvider.GetService<ITransientFileStorageService>()!;
    }

    [Fact]
    public async Task HandleCopyFileFromTransientToMainCommand_Run_Correctly()
    {
        //Arrange
        //create a file in transient bucket
        var sourceFileName = IntegrationTestFixture.DataPrefix + Guid.NewGuid();
        var testFile = new Spd.Utilities.FileStorage.File
        {
            Content = Encoding.ASCII.GetBytes("samplefile"),
            ContentType = "application/txt",
            FileName = sourceFileName,
            Metadata = new List<FileMetadata>() { new FileMetadata("test", "value") }
        };
        await _transientFileService.HandleCommand(new UploadFileCommand(sourceFileName, IntegrationTestFixture.Folder, testFile, new FileTag { }),
            CancellationToken.None);

        //Act
        var targetFileName = sourceFileName;
        await _mainFileService.HandleCopyStorageFromTransientToMainCommand(
            new CopyStorageFromTransientToMainCommand(
                sourceFileName,
                IntegrationTestFixture.Folder,
                targetFileName,
                IntegrationTestFixture.Folder),
            CancellationToken.None);

        //Assert
        (await _mainFileService.HandleQuery(new FileMetadataQuery { Key = targetFileName, Folder = IntegrationTestFixture.Folder }, CancellationToken.None))
            .ShouldNotBeNull()
            .ShouldBeOfType<FileMetadataQueryResult>();

        //Annihilate
        //cleanup transient bucket; files in main bucket are not allowed to be removed.
        await _transientFileService.HandleDeleteCommand(
            new StorageDeleteCommand(sourceFileName, IntegrationTestFixture.Folder),
            CancellationToken.None);
    }
}