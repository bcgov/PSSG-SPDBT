using Alba;
using Microsoft.Net.Http.Headers;
using Spd.Presentation.Dynamics;
using System.Net;
using System.Net.Mime;
using Xunit.Abstractions;

namespace Spd.Tests.Presentation.Dynamics.Integration;

public class FileStorageScenarios : ScenarioContextBase
{
    readonly string fileId = Guid.NewGuid().ToString();
    public FileStorageScenarios(ITestOutputHelper output, WebAppFixture fixture) : base(output, fixture)
    {
    }


    [Fact]
    public async Task Upload_New_File_NoAuth_Unauthorized()
    {
        MultipartFormDataContent multipartContent = CreateMultipartFormData("test", "test.txt");

        await Host.Scenario(_ =>
        {
            _.RemoveRequestHeader(HeaderNames.Authorization);
            _.Post.MultipartFormData(multipartContent).ToUrl($"/api/files/{fileId}");
            _.StatusCodeShouldBe(HttpStatusCode.Unauthorized);
        });
    }

    [Fact]
    public async Task Upload_New_File_Success()
    {
        MultipartFormDataContent multipartContent = CreateMultipartFormData("test", "test.txt");
        await Host.Scenario(_ =>
        {
            _.WithRequestHeader(SpdHeaderNames.HEADER_FILE_CLASSIFICATION, "test");
            _.WithRequestHeader(SpdHeaderNames.HEADER_FILE_FOLDER, "test");
            _.Post.MultipartFormData(multipartContent)
            .ToUrl($"/api/files/{fileId}");
            _.StatusCodeShouldBe(201);//create new, return 201
        });
    }

    [Fact]
    public async Task Overwrite_File_Success()
    {
        await Upload_New_File_Success();
        MultipartFormDataContent multipartContent = CreateMultipartFormData("test", "test.txt");
        await Host.Scenario(_ =>
        {
            _.WithRequestHeader(SpdHeaderNames.HEADER_FILE_CLASSIFICATION, "test");
            _.WithRequestHeader(SpdHeaderNames.HEADER_FILE_FOLDER, "test");
            _.Post.MultipartFormData(multipartContent)
            .ToUrl($"/api/files/{fileId}");
            _.StatusCodeShouldBe(200); //overwrite, return 200
        });
    }

    [Fact]
    public async Task Download_File_Success()
    {
        await Upload_New_File_Success();
        await Host.Scenario(_ =>
        {
            _.WithRequestHeader(SpdHeaderNames.HEADER_FILE_FOLDER, "test");
            _.Get.Url($"/api/files/{fileId}");
            _.StatusCodeShouldBeOk();
        });
    }


    [Fact]
    public async Task Update_File_Tags_Success()
    {
        await Upload_New_File_Success();
        await Host.Scenario(_ =>
        {
            _.WithRequestHeader(SpdHeaderNames.HEADER_FILE_FOLDER, "test");
            _.WithRequestHeader(SpdHeaderNames.HEADER_FILE_CLASSIFICATION, "internal");
            _.WithRequestHeader(SpdHeaderNames.HEADER_FILE_TAG, "tag1=a,tag2=b");
            _.Post.Url($"/api/files/{fileId}/tags");
            _.StatusCodeShouldBeOk();
        });
    }
    private static MultipartFormDataContent CreateMultipartFormData(string content, string fileName)
    {
        MultipartFormDataContent multipartContent = new();
        var stream = new MemoryStream();
        var writer = new StreamWriter(stream);
        writer.Write(content);
        writer.Flush();
        stream.Position = 0;
        var streamContent = new StreamContent(stream);
        streamContent.Headers.ContentType = System.Net.Http.Headers.MediaTypeHeaderValue.Parse(MediaTypeNames.Text.Plain);
        multipartContent.Add(streamContent, "File", fileName);
        return multipartContent;
    }
}
