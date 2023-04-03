using System.Net;
using Alba;
using Microsoft.AspNetCore.Http;
using Microsoft.Net.Http.Headers;
using Spd.Presentation.Dynamics.Models;
using Xunit.Abstractions;

namespace Spd.Tests.Presentation.Dynamics.Integration;

public class FileStorageScenarios : ScenarioContextBase
{
    public FileStorageScenarios(ITestOutputHelper output, WebAppFixture fixture) : base(output, fixture)
    {
    }

    [Fact]
    public async Task Upload_File_Success()
    {
        var payload = new UploadFileRequest
        {
            Tag1 = "tag1",
            Tag2 = "tag2",
            Tag3 = "tag3",
            FileName = "test.txt",
            ContentType = "text/plain",
            File = CreateFormFile("some text", "test.txt"),
            EntityName = "test",
            EntityId = Guid.NewGuid(),
            Classification = "public"
        };

        await Host.Scenario(_ =>
        {
            _.Post.FormData(payload).ToUrl("/api/files/");
            _.StatusCodeShouldBeOk();
        });
    }

    [Fact]
    public async Task Upload_File_NoAuth_Unauthorized()
    {
        var payload = new UploadFileRequest
        {
            Tag1 = "tag1",
            Tag2 = "tag2",
            Tag3 = "tag3",
            FileName = "test.txt",
            ContentType = "text/plain",
            File = CreateFormFile("some text", "test.txt"),
            EntityName = "test",
            EntityId = Guid.NewGuid(),
            Classification = "public"
        };

        await Host.Scenario(_ =>
        {
            _.RemoveRequestHeader(HeaderNames.Authorization);
            _.Post.FormData(payload).ToUrl("/api/files/");
            _.StatusCodeShouldBe(HttpStatusCode.Unauthorized);
        });
    }

    private static IFormFile CreateFormFile(string content, string fileName)
    {
        var stream = new MemoryStream();
        var writer = new StreamWriter(stream);
        writer.Write(content);
        writer.Flush();
        stream.Position = 0;

        return new FormFile(stream, 0, stream.Length, fileName, fileName);
    }
}
