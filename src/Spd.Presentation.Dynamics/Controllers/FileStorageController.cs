using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Spd.Presentation.Dynamics.Models;
using Spd.Utilities.FileStorage;
using Spd.Utilities.Shared;
using File = Spd.Utilities.FileStorage.File;

namespace Spd.Presentation.Dynamics.Controllers
{
    /// <summary>
    /// For upload and download file
    /// </summary>
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
        public async Task<UploadFileResponse> UploadFile([FromForm]UploadFileRequest request)
        {
            using var ms = new MemoryStream();
            await request.File.CopyToAsync(ms);

            File spdFile = _mapper.Map<File>(request);
            spdFile.Content = ms.ToArray();

            string id = await _storageService.HandleCommand(new UploadFileCommand { File = spdFile }, CancellationToken.None);

            return new UploadFileResponse { Id = id };
        }

        //[HttpPost]
        //[Route("api/files")]
        //public async Task<UploadFileResponse> UploadFile([FromBody] UploadFileRequestJson request)
        //{
        //    File file = _mapper.Map<File>(request);
        //    string id = await _storageService.HandleCommand(new UploadItemCommand { File = file }, CancellationToken.None);
        //    return new UploadFileResponse { Id = id };
        //}

        //[HttpGet]
        //[Route("api/files/{fileId}")]
        //public async Task<DownloadFileResponse> DownloadFile(string fileId)
        //{
        //    StorageQueryResults result = await _storageService.HandleQuery(new GetItemByKeyQuery { Key = fileId }, CancellationToken.None);
        //    return _mapper.Map<DownloadFileResponse>(result.File);
        //}

        [HttpGet]
        [Route("api/files/{fileId}")]
        public async Task<IActionResult> DownloadFile(string fileId)
        {
            StorageQueryResults result = await _storageService.HandleQuery(new FileQuery { Key = fileId }, CancellationToken.None);

            var content = new System.IO.MemoryStream(result.File.Content);
            var contentType = result.File.ContentType;
            var fileName = result.File.FileName;
            return File(content, contentType, fileName);
        }
    }
}