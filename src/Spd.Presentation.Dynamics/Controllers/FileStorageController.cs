using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Spd.Presentation.Dynamics.Models;
using Spd.Utilities.FileStorage;
using Spd.Utilities.Shared;

namespace Spd.Presentation.Dynamics.Controllers
{
    /// <summary>
    /// For upload and download file
    /// </summary>
    public class FileStorageController : SpdControllerBase
    {
        private readonly IS3StorageService _storageService;
        private readonly IMapper _mapper;
        public FileStorageController(IS3StorageService storageService, IMapper mapper) : base()
        {
            _storageService = storageService;
            _mapper = mapper;
        }

        [HttpGet]
        [Route("api/health")]
        public ActionResult<bool> HealthCheck()
        {
            return Ok(true);
        }

        /// <summary>
        /// Upload file
        /// The maximum file size would be 30M.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        //[HttpPost]
        //[Route("api/files")]
        //public async Task<UploadFileResponse> UploadFile([FromForm] UploadFileRequest request)
        //{
        //    using var ms = new MemoryStream();
        //    await request.File.CopyToAsync(ms);

        //    SpdFile spdFile = _mapper.Map<SpdFile>(request);
        //    spdFile.Content = ms.ToArray();

        //    string id = await _storageService.HandleCommand(new UploadItemCommand { SpdFile = spdFile }, CancellationToken.None);

        //    return new UploadFileResponse { Id = id };
        //}

        [HttpPost]
        [Route("api/files")]
        public async Task<UploadFileResponse> UploadFile([FromBody] UploadFileRequestJson request)
        {
            SpdFile spdFile = _mapper.Map<SpdFile>(request);
            string id = await _storageService.HandleCommand(new UploadItemCommand { SpdFile = spdFile }, CancellationToken.None);
            return new UploadFileResponse { Id = id };
        }

        [HttpGet]
        [Route("api/files/{fileId}")]
        public async Task<DownloadFileResponse> DownloadFile(string fileId)
        {
            StorageQueryResults result = await _storageService.HandleQuery(new GetItemByKeyQuery { Key = fileId }, CancellationToken.None);
            return _mapper.Map<DownloadFileResponse>(result.SpdFile);
        }
    }
}