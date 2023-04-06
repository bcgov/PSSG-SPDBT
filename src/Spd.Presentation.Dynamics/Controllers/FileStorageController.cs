using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Presentation.Dynamics.Models;
using Spd.Utilities.FileStorage;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.Exceptions;
using System.ComponentModel.DataAnnotations;
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
    /// <param name="classification"></param>
    /// <param name="ct"></param>
    /// <returns></returns>
    [HttpPost]
    [Route("api/files/{fileId}")]
    public async Task<IActionResult> UploadFileAsync(
        [FromForm] UploadFileRequest request, 
        [FromRoute] Guid fileId,
        [FromHeader(Name = "file-classification")][Required] string classification,
        CancellationToken ct)
    {
        var headers = this.Request.Headers;

        //check if file already exists
        FileMetadataQueryResult queryResult = (FileMetadataQueryResult)await _storageService.HandleQuery(
            new FileMetadataQuery { Key = fileId.ToString(), Folder = headers[SpdHeaderNames.HEADER_FILE_FOLDER] },
            ct);
        bool fileExists = queryResult != null;

        //upload file
        using var ms = new MemoryStream();
        await request.File.CopyToAsync(ms, ct);
        File file = new()
        {
            FileName = request.File.FileName,
            ContentType = request.File.ContentType,
            Content = ms.ToArray()
        };
        FileTag fileTag = new()
        {
            Tags = GetTagsFromStr(headers[SpdHeaderNames.HEADER_FILE_TAG], classification)
        };
        await _storageService.HandleCommand(
            new UploadFileCommand(fileId.ToString(), headers[SpdHeaderNames.HEADER_FILE_FOLDER], file, fileTag),
            ct);

        return fileExists ? Ok() : StatusCode(StatusCodes.Status201Created);
    }

    /// <summary>
    /// Download the file with fileId and folder name. 
    /// If a file is expected to be in a folder, the client must pass the correct folder name in the request header, 
    /// otherwise no file will found; the default header value is the root folder /
    /// </summary>
    /// <param name="fileId"></param>
    /// <param name="ct"></param>
    /// <returns></returns>
    [HttpGet]
    [Route("api/files/{fileId}")]
    public async Task<FileStreamResult> DownloadFileAsync(Guid fileId, CancellationToken ct)
    {
        var headers = this.Request.Headers;
        FileQueryResult result = (FileQueryResult)await _storageService.HandleQuery(
            new FileQuery { Key = fileId.ToString(), Folder = headers[SpdHeaderNames.HEADER_FILE_FOLDER] },
            ct);

        var content = new MemoryStream(result.File.Content);
        var contentType = result.File.ContentType ?? "application/octet-stream";

        if (result.FileTag != null)
        {
            HttpContext.Response.Headers.Add(SpdHeaderNames.HEADER_FILE_CLASSIFICATION,
                result.FileTag.Tags.SingleOrDefault(t => t.Key == SpdHeaderNames.HEADER_FILE_CLASSIFICATION)?.Value);

            string tagStr = GetStrFromTags(result.FileTag.Tags);
            if (!string.IsNullOrWhiteSpace(tagStr))
                HttpContext.Response.Headers.Add(SpdHeaderNames.HEADER_FILE_TAG, tagStr);
        }

        if (!string.IsNullOrWhiteSpace(headers[SpdHeaderNames.HEADER_FILE_FOLDER]))
            HttpContext.Response.Headers.Add(SpdHeaderNames.HEADER_FILE_FOLDER, headers[SpdHeaderNames.HEADER_FILE_FOLDER]);

        return new FileStreamResult(content, contentType);
    }

    /// <summary>
    /// Only updates the tags passed in the header and will not affect the content of the file
    /// any tags not present in the request will be deleted
    /// tags must be in the form key=value, key must contain only alphanumeric characters(i.e.tag1= value1)
    /// classification must contain only alphanumeric characters(i.e.confidential/internal/public)
    /// </summary>
    /// <param name="fileId"></param>
    /// <param name="classification"></param>
    /// <param name="ct"></param>
    /// <returns></returns>
    [HttpPost]
    [Route("api/files/{fileId}/tags")]
    public async Task<IActionResult> UpdateTagsAsync(
        [FromRoute]Guid fileId, 
        [FromHeader(Name = "file-classification")][Required] string classification, 
        CancellationToken ct)
    {
        var headers = this.Request.Headers;

        //check if file already exists
        var queryResult = (FileMetadataQueryResult)await _storageService.HandleQuery(
            new FileMetadataQuery { Key = fileId.ToString(), Folder = headers[SpdHeaderNames.HEADER_FILE_FOLDER] },
            ct);
        bool fileExists = queryResult != null;
        if (!fileExists)
        {
            return NotFound();
        }
        else
        {
            FileTag fileTag = new()
            {
                Tags = GetTagsFromStr(headers[SpdHeaderNames.HEADER_FILE_TAG], classification),
            };
            await _storageService.HandleCommand(
                new UpdateTagsCommand(fileId.ToString(), headers[SpdHeaderNames.HEADER_FILE_FOLDER], fileTag),
                ct);
            return Ok();
        }
    }

    private Tag[] GetTagsFromStr(string? tagStr, string classification)
    {
        try
        {
            List<Tag> taglist = new() { new Tag(SpdHeaderNames.HEADER_FILE_CLASSIFICATION, classification) };

            if (!string.IsNullOrWhiteSpace(tagStr))
            {
                string[] tags = tagStr.Split(',');
                foreach (string tag in tags)
                {
                    string[] strs = tag.Split('=');
                    if (strs.Length != 2) throw new OutOfRangeException(HttpStatusCode.BadRequest, $"Invalid {SpdHeaderNames.HEADER_FILE_TAG} string");
                    taglist.Add(
                        new Tag(strs[0], strs[1])
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

    private string GetStrFromTags(IEnumerable<Tag> tags)
    {
        List<string> tagStrlist = new();
        foreach (Tag t in tags)
        {
            if (t.Key != SpdHeaderNames.HEADER_FILE_CLASSIFICATION)
                tagStrlist.Add($"{t.Key}={t.Value}");
        }
        return string.Join(",", tagStrlist);
    }
}
