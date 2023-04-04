using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Presentation.Dynamics.Models;
using Spd.Utilities.FileStorage;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.Exceptions;
using System.Net;
using File = Spd.Utilities.FileStorage.File;

namespace Spd.Presentation.Dynamics.Controllers;

/// <summary>
/// For upload and download file
/// </summary>
[Authorize]
public class FileStorageController : SpdControllerBase
{
    private readonly IFileStorageService _storageService;
    public FileStorageController(IFileStorageService storageService) : base()
    {
        _storageService = storageService;
    }

    /// <summary>
    /// Upload  or overwrite file
    /// The maximum file size would be 30M.
    /// </summary>
    /// <param name="request"></param>
    /// <param name="fileId"></param>
    /// <returns></returns>
    [HttpPost]
    [Route("api/files/{fileId}")]
    public async Task<IActionResult> UploadFile([FromForm] UploadFileRequest request, [FromRoute] Guid fileId)
    {
        var headers = this.Request.Headers;
        string? classification = headers[SpdHeaderNames.HEADER_FILE_CLASSIFICATION];
        if (string.IsNullOrWhiteSpace(classification))
        {
            throw new ApiException(HttpStatusCode.BadRequest, $"{SpdHeaderNames.HEADER_FILE_CLASSIFICATION} header is mandatory");
        }

        //check if file already exists
        FileExistsQueryResult queryResult = (FileExistsQueryResult)await _storageService.HandleQuery(
            new FileExistsQuery { Key = fileId.ToString(), Folder = headers[SpdHeaderNames.HEADER_FILE_FOLDER] },
            new CancellationToken());

        //upload file
        using var ms = new MemoryStream();
        await request.File.CopyToAsync(ms);
        File file = new()
        {
            Key = fileId.ToString(),
            FileName = request.File.FileName,
            ContentType = request.File.ContentType,
            Content = ms.ToArray(),
            Tags = GetTagsFromStr(headers[SpdHeaderNames.HEADER_FILE_TAG], classification),
            Folder = headers[SpdHeaderNames.HEADER_FILE_FOLDER]
        };
        await _storageService.HandleCommand(new UploadFileCommand { File = file }, CancellationToken.None);

        return queryResult.FileExists ? Ok() : StatusCode(StatusCodes.Status201Created);
    }

    /// <summary>
    /// Download the file with fileId and folder name. 
    /// If a file is expected to be in a folder, the client must pass the correct folder name in the request header, 
    /// otherwise no file will found; the default header value is the root folder /
    /// </summary>
    /// <param name="fileId"></param>
    /// <returns></returns>
    [HttpGet]
    [Route("api/files/{fileId}")]
    public async Task<FileStreamResult> DownloadFile(string fileId)
    {
        var headers = this.Request.Headers;
        FileQueryResult result = (FileQueryResult)await _storageService.HandleQuery(
            new FileQuery { Key = fileId, Folder = headers[SpdHeaderNames.HEADER_FILE_FOLDER] },
            new CancellationToken());

        var content = new MemoryStream(result.File.Content);
        var contentType = result.File.ContentType;

        HttpContext.Response.Headers.Add(SpdHeaderNames.HEADER_FILE_CLASSIFICATION,
            result.File.Tags.FirstOrDefault(t => t.Key == "classification")?.Value);

        if (!string.IsNullOrWhiteSpace(headers[SpdHeaderNames.HEADER_FILE_FOLDER]))
            HttpContext.Response.Headers.Add(SpdHeaderNames.HEADER_FILE_FOLDER, headers[SpdHeaderNames.HEADER_FILE_FOLDER]);

        string tagStr = GetStrFromTags(result.File.Tags);
        if (!string.IsNullOrWhiteSpace(tagStr))
            HttpContext.Response.Headers.Add(SpdHeaderNames.HEADER_FILE_TAG, tagStr);

        return new FileStreamResult(content, contentType);
    }

    /// <summary>
    /// Only updates the tags passed in the header and will not affect the content of the file
    /// any tags not present in the request will be deleted
    /// tags must be in the form key=value, key must contain only alphanumeric characters(i.e.tag1= value1)
    ///classification must contain only alphanumeric characters(i.e.confidential/internal/public)
    /// </summary>
    /// <param name="fileId"></param>
    /// <returns></returns>
    [HttpPost]
    [Route("api/files/{fileId}/tags")]
    public async Task<IActionResult> UpdateTags(string fileId)
    {
        var headers = this.Request.Headers;
        string? classification = headers[SpdHeaderNames.HEADER_FILE_CLASSIFICATION];
        if (string.IsNullOrWhiteSpace(classification))
        {
            throw new ApiException(HttpStatusCode.BadRequest, $"{SpdHeaderNames.HEADER_FILE_CLASSIFICATION} header is mandatory");
        }

        //check if file already exists
        FileExistsQueryResult queryResult = (FileExistsQueryResult)await _storageService.HandleQuery(
            new FileExistsQuery { Key = fileId.ToString(), Folder = headers[SpdHeaderNames.HEADER_FILE_FOLDER] },
            new CancellationToken());
        if (queryResult.FileExists)
        {
            File file = new()
            {
                Key = fileId.ToString(),
                Tags = GetTagsFromStr(headers[SpdHeaderNames.HEADER_FILE_TAG], classification),
                Folder = headers[SpdHeaderNames.HEADER_FILE_FOLDER]
            };
            await _storageService.HandleCommand(new UpdateTagsCommand { File = file }, CancellationToken.None);
            return Ok();
        }
        else
        {
            return NotFound();
        }
    }

    private Tag[] GetTagsFromStr(string? tagStr, string classification)
    {
        try
        {
            List<Tag> taglist = new() { new Tag { Key = "classification", Value = classification } };

            if (!string.IsNullOrWhiteSpace(tagStr))
            {
                string[] tags = tagStr.Split(',');
                foreach (string tag in tags)
                {
                    string[] strs = tag.Split('=');
                    if (strs.Length != 2) throw new OutOfRangeException(HttpStatusCode.BadRequest, $"Invalid {SpdHeaderNames.HEADER_FILE_TAG} string");
                    taglist.Add(
                        new Tag()
                        {
                            Key = strs[0],
                            Value = strs[1]
                        }
                    );
                }
            }
            return taglist.ToArray();
        }
        catch
        {
            throw new ApiException(HttpStatusCode.BadRequest, $"Invalid {SpdHeaderNames.HEADER_FILE_TAG} string");
        }
    }

    private string GetStrFromTags(Tag[] tags)
    {
        List<string> tagStrlist = new();
        foreach (Tag t in tags)
        {
            if (t.Key != "classification")
                tagStrlist.Add($"{t.Key}={t.Value}");
        }
        return string.Join(",", tagStrlist);
    }
}
