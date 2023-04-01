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
    private readonly IMapper _mapper;

    public FileStorageController(IFileStorageService storageService, IMapper mapper) : base()
    {
        _storageService = storageService;
        _mapper = mapper;
    }

    /// <summary>
    /// Upload file
    /// The maximum file size would be 30M.
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    [HttpPost]
    [Route("api/files")]
    public async Task<UploadFileResponse> UploadFile([FromForm] UploadFileRequest request)
    {
        private readonly IFileStorageService _storageService;
        private readonly string HEADER_FILE_CLASSIFICATION = "file-classification";
        private readonly string HEADER_FILE_TAG = "file-tag";
        private readonly string HEADER_FILE_FOLDER = "file-folder";

        public FileStorageController(IFileStorageService storageService) : base()
        {
            _storageService = storageService;
        }

        /// <summary>
        /// Upload file
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
            string? classification = headers[HEADER_FILE_CLASSIFICATION];
            if (string.IsNullOrWhiteSpace(classification))
            {
                throw new ApiException(HttpStatusCode.BadRequest, $"{HEADER_FILE_CLASSIFICATION} header is mandatory");
            }

            //check if file already exists
            FileExistsQueryResult queryResult = (FileExistsQueryResult)await _storageService.HandleQuery(
                new FileExistsQuery { Key = fileId.ToString(), Folder = headers[HEADER_FILE_FOLDER] },
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
                Tags = GetTags(headers[HEADER_FILE_TAG], classification),
                Folder = headers[HEADER_FILE_FOLDER]
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
                new FileQuery { Key = fileId, Folder = headers[HEADER_FILE_FOLDER] },
                new CancellationToken());

            var content = new MemoryStream(result.File.Content);
            var contentType = result.File.ContentType;
            var fileName = result.File.FileName;
            HttpContext.Response.Headers.Add(HEADER_FILE_CLASSIFICATION,
                result.File.Tags.FirstOrDefault(t => t.Key == "classification")?.Value);

            if (!string.IsNullOrWhiteSpace(headers[HEADER_FILE_FOLDER]))
                HttpContext.Response.Headers.Add(HEADER_FILE_FOLDER, headers[HEADER_FILE_FOLDER]);

            string tagStr = GetStrFromTags(result.File.Tags);
            if (!string.IsNullOrWhiteSpace(tagStr))
                HttpContext.Response.Headers.Add(HEADER_FILE_TAG, tagStr);

            return new FileStreamResult(content, contentType);
        }

        private Tag[] GetTags(string? tagStr, string classification)
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
                        if (strs.Length != 2) throw new OutOfRangeException(HttpStatusCode.BadRequest, $"Invalid {HEADER_FILE_TAG} string");
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
                throw new ApiException(HttpStatusCode.BadRequest, $"Invalid {HEADER_FILE_TAG} string");
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
}