using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Spd.DynamicsHelper.Models;
using Spd.Utilities.FileStorage;
using Spd.Utilities.Shared;
using System.Reflection;

namespace Spd.DynamicsHelper.Controllers
{
    public class FileStorageController : SpdControllerBase
    {
        private IS3StorageService _storageService;
        private IMapper _mapper;
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

        [HttpPost]
        [Route("api/files")]
        public async Task<ActionResult<string>> UploadFile([FromForm]UploadFileRequest request)
        {
            using var ms = new MemoryStream();
            await request.File.CopyToAsync(ms);

            SpdFile spdFile = _mapper.Map<SpdFile>(request);
            spdFile.Content= ms.ToArray();

            string id = await _storageService.HandleCommand(new UploadItemCommand { SpdFile = spdFile }, CancellationToken.None);

            return Ok(id);
        }
    }
}