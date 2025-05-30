using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Presentation.Dynamics.Helper;
using Spd.Presentation.Dynamics.Models;
using Spd.Utilities.FileScanning;
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
public class TransientFileStorageController : SpdControllerBase
{
    private readonly ITransientFileStorageService _storageService;
    private readonly IFileScanProvider _fileScanProvider;

    public TransientFileStorageController(ITransientFileStorageService storageService, IFileScanProvider fileScanProvider) : base()
    {
        _storageService = storageService;
        _fileScanProvider = fileScanProvider;
    }

    /// <summary>
    /// Upload  or overwrite file to transient bucket
    /// If the file guid exists, the file content is overwritten by the new file
    /// all the tags must be sent in the requests, tags that do not exist will be removed from the file storage
    /// The maximum file size would be 30M.
    /// </summary>
    /// <param name="request">File with selected file data.</param>
    /// <param name="fileId">the GUID of the file</param>
    /// <param name="classification">mandatory, must contain only alphanumeric characters</param>
    /// <param name="tags">must be in the form key=value, key must contain only alphanumeric characters. Multi tags should be like: tag1=a,tag2=b</param>
    /// <param name="folder">be used to allocate the file in a specific folder in storage, if not specified, defaults to / (root folder)</param>
    /// <param name="ct">cancellation token, generated by dotnetcore</param>
    /// <response code="200">Ok, the file was updated</response>
    /// <response code="201">Created, the file was created</response>
    /// <response code="400">Bad Request, classification header is missing,form data is invalid or file id is not a valid guid</response>
    /// <returns>
    /// </returns>
    [HttpPost]
    [Route("api/transient-files/{fileId}")]
    public async Task<IActionResult> UploadFileAsync(
        [FromForm] UploadFileRequest request,
        [FromRoute] Guid fileId,
        [FromHeader(Name = "file-classification")][Required] string classification,
        [FromHeader(Name = "file-tag")] string? tags,
        [FromHeader(Name = "file-folder")] string? folder,
        CancellationToken ct)
    {
        var result = await _fileScanProvider.ScanAsync(request.File.OpenReadStream(), ct);
        if (result.Result != ScanResult.Clean)
            throw new ApiException(HttpStatusCode.BadRequest, "The uploaded file is not clean.");

        //check if file already exists
        FileMetadataQueryResult queryResult = (FileMetadataQueryResult)await _storageService.HandleQuery(
            new FileMetadataQuery { Key = fileId.ToString(), Folder = folder },
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
            Tags = FileStorageHelper.GetTagsFromStr(tags, classification)
        };
        await _storageService.HandleCommand(
            new UploadFileCommand(fileId.ToString(), folder, file, fileTag),
            ct);

        return fileExists ? Ok() : StatusCode(StatusCodes.Status201Created);
    }

    /// <summary>
    /// Download the file with fileId and folder name from to transient bucket. 
    /// If a file is expected to be in a folder, the client must pass the correct folder name in the request header, 
    /// otherwise no file will found; the default header value is the root folder 
    /// </summary>
    /// <param name="fileId">the GUID of the file</param>
    /// <param name="folder">be used to allocate the file in a specific folder in storage, if not specified, defaults to / (root folder)</param>
    /// <param name="ct">cancellation token, generated by dotnetcore</param>
    /// <returns></returns>
    /// <response code="200">Ok</response>
    /// <response code="404">Not Found</response>
    /// <response code="400">Bad Request, file id is not a valid guid</response>
    [HttpGet]
    [Route("api/transient-files/{fileId}")]
    public async Task<FileStreamResult> DownloadFileAsync(
        Guid fileId,
        [FromHeader(Name = "file-folder")] string? folder,
        CancellationToken ct)
    {
        var queryResult = (FileMetadataQueryResult)await _storageService.HandleQuery(
            new FileMetadataQuery { Key = fileId.ToString(), Folder = folder },
            ct);

        bool fileExists = queryResult != null;
        if (!fileExists)
        {
            throw new ApiException(HttpStatusCode.NotFound, "cannot find the file");
        }

        FileQueryResult result = (FileQueryResult)await _storageService.HandleQuery(
            new FileQuery { Key = fileId.ToString(), Folder = folder },
            ct);

        var content = new MemoryStream(result.File.Content);
        var contentType = result.File.ContentType ?? "application/octet-stream";

        if (result.FileTag != null)
        {
            HttpContext.Response.Headers.Add(SpdHeaderNames.HEADER_FILE_CLASSIFICATION,
                result.FileTag.Tags.SingleOrDefault(t => t.Key == SpdHeaderNames.HEADER_FILE_CLASSIFICATION)?.Value);

            string tagStr = FileStorageHelper.GetStrFromTags(result.FileTag.Tags);
            if (!string.IsNullOrWhiteSpace(tagStr))
                HttpContext.Response.Headers.Add(SpdHeaderNames.HEADER_FILE_TAG, tagStr);
        }

        if (!string.IsNullOrWhiteSpace(folder))
            HttpContext.Response.Headers.Add(SpdHeaderNames.HEADER_FILE_FOLDER, folder);

        return new FileStreamResult(content, contentType);
    }

    /// <summary>
    /// To transient bucket, Only updates the tags passed in the header and will not affect the content of the file
    /// any tags not present in the request will be deleted
    /// tags must be in the form key=value, key must contain only alphanumeric characters(i.e.tag1= value1)
    /// classification must contain only alphanumeric characters(i.e.confidential/internal/public)
    /// </summary>
    /// <param name="fileId">the GUID of the file</param>
    /// <param name="classification">mandatory, must contain only alphanumeric characters</param>
    /// <param name="tags">multi tags should be like: tag1=a,tag2=b</param>
    /// <param name="folder">be used to allocate the file in a specific folder in storage, if not specified, defaults to / (root folder)</param>
    /// <param name="ct"></param>
    /// <returns></returns>
    /// <response code="200">Ok</response>
    /// <response code="404">Not Found</response>
    /// <response code="400">Bad Request, file id is not a valid guid</response>
    [HttpPost]
    [Route("api/transient-files/{fileId}/tags")]
    public async Task<IActionResult> UpdateTagsAsync(
        [FromRoute] Guid fileId,
        [FromHeader(Name = "file-classification")][Required] string classification,
        [FromHeader(Name = "file-tag")] string? tags,
        [FromHeader(Name = "file-folder")] string? folder,
        CancellationToken ct)
    {
        //check if file already exists
        var queryResult = (FileMetadataQueryResult)await _storageService.HandleQuery(
            new FileMetadataQuery { Key = fileId.ToString(), Folder = folder },
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
                Tags = FileStorageHelper.GetTagsFromStr(tags, classification),
            };
            await _storageService.HandleCommand(
                new UpdateTagsCommand(fileId.ToString(), folder, fileTag),
                ct);
            return Ok();
        }
    }

    /// <summary>
    /// copy file for one location in transient bucket to another location in the same transient bucket
    /// </summary>
    /// <param name="copyFileRequest"></param>
    /// <param name="ct"></param>
    /// <returns></returns>
    [HttpPost]
    [Route("api/transient-files/copy-file")]
    public async Task<IActionResult> CopyFileAsync(
    [FromBody] CopyFileRequest copyFileRequest,
    CancellationToken ct)
    {
        //check if file already exists
        FileMetadataQueryResult queryResult = (FileMetadataQueryResult)await _storageService.HandleQuery(
            new FileMetadataQuery { Key = copyFileRequest.SourceKey },
            ct);
        bool fileExists = queryResult != null;

        if (!fileExists) { return NotFound(); }

        await _storageService.HandleCommand(
            new CopyFileCommand(copyFileRequest.SourceKey, null, copyFileRequest.DestKey, null),
            ct);

        return StatusCode(StatusCodes.Status201Created);
    }

}
