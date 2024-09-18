using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Spd.Utilities.FileStorage;
using System.Text;
using Xunit.Abstractions;

namespace Spd.Tests.Integration.Utilities.FileStorage;

public class TransientFileStorageServiceTest : IntegrationTestBase
{
    private readonly ITransientFileStorageService _transientFileService;

    public TransientFileStorageServiceTest(ITestOutputHelper output, IntegrationTestFixture fixture) : base(output, fixture)
    {
        _transientFileService = Fixture.ServiceProvider.GetService<ITransientFileStorageService>()!;
    }

    [Fact]
    public async Task HandleDeleteCommand_Run_Correctly()
    {
        //Arrange
        //create a file in transient bucket
        var fileName = IntegrationTestFixture.DataPrefix + Guid.NewGuid();
        var testFile = new Spd.Utilities.FileStorage.File
        {
            Content = Encoding.ASCII.GetBytes("samplefile"),
            ContentType = "application/txt",
            FileName = fileName,
            Metadata = new List<FileMetadata>() { new FileMetadata("test", "value") }
        };
        await _transientFileService.HandleCommand(new UploadFileCommand(fileName, IntegrationTestFixture.Folder, testFile, new FileTag { }),
            CancellationToken.None);

        //Act
        await _transientFileService.HandleDeleteCommand(
           new StorageDeleteCommand(
               fileName,
               IntegrationTestFixture.Folder),
           CancellationToken.None);

        //Assert
        (await _transientFileService.HandleQuery(new FileMetadataQuery { Key = fileName, Folder = IntegrationTestFixture.Folder }, CancellationToken.None))
            .ShouldNotBeNull()
            .ShouldBeOfType<FileMetadataQueryResult>();
    }
}