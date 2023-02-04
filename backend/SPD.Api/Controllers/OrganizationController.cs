using FluentValidation;
using FluentValidation.AspNetCore;
using FluentValidation.Results;
using Microsoft.AspNetCore.Mvc;
using SPD.Common.ViewModels.Organization;
using System.ComponentModel.DataAnnotations;

namespace SPD.Api.Controllers
{
    [ApiController]
    public class OrganizationController : ControllerBase
    {
        private readonly ILogger<OrganizationController> _logger;

        public OrganizationController(ILogger<OrganizationController> logger)
        {
            _logger = logger;
        }

        [Route("api/organizations")]
        [HttpPost]
        public async Task<ActionResult> Register([FromBody][Required]OrganizationCreateRequest orgCreateRequest)
        {
            return Ok();
        }
    }
}