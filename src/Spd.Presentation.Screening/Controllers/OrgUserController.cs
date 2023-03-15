using MediatR;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Membership.OrgUser;
using System.ComponentModel.DataAnnotations;

namespace Spd.Presentation.Screening.Controllers
{
    [ApiController]
    public class OrgUserController : ControllerBase
    {
        private readonly ILogger<OrgRegistrationController> _logger;
        private readonly IMediator _mediator;

        public OrgUserController(ILogger<OrgRegistrationController> logger, IMediator mediator)
        {
            _logger = logger;
            _mediator = mediator;
        }

        [Route("api/org-user")]
        [HttpPost]
        [Produces("application/json")]
        public async Task<OrgUserResponse> Add([FromBody][Required] OrgUserCreateRequest orgUserCreateRequest)
        {
            orgUserCreateRequest.OrganizationId = Guid.Parse("4165bdfe-7cb4-ed11-b83e-00505683fbf4");
            return await _mediator.Send(new OrgUserCreateCommand(orgUserCreateRequest));
        }

        [Route("api/org-user/{userId}")]
        [HttpPut]
        [Produces("application/json")]
        public async Task<OrgUserResponse> Put(string userId, [FromBody] OrgUserUpdateRequest orgUserUpdateRequest)
        {
            if (!Guid.TryParse(userId, out Guid userIdGuid))
            {
                throw new Exception("Invalid User Guid");
            }
            return await _mediator.Send(new OrgUserUpdateCommand(userIdGuid, orgUserUpdateRequest));
        }

        [Route("api/org-user/{userId}")]
        [HttpDelete]
        public ActionResult Delete(string userId)
        {
            if (!Guid.TryParse(userId, out Guid userIdGuid))
            {
                throw new Exception("Invalid User Guid");
            }
            await mediator.Send(new OrgUserDeleteCommand(userIdGuid));
            return Ok();
        }

        [Route("api/org-user/{userId}")]
        [HttpGet]
        [Produces("application/json")]
        public async Task<OrgUserResponse> Get(string userId)
        {
            if (!Guid.TryParse(userId, out Guid userIdGuid))
            {
                throw new Exception("Invalid User Guid");
            }
            /*
            var org = new OrgUserResponse
            {
                ContactAuthorizationTypeCode = ContactAuthorizationTypeCode.Primary,
                LastName = "test",
                FirstName = "jane",
                Email = "jane@test.com",
                PhoneNumber = "2501112222",
                JobTitle = "Teacher",
                DateOfBirth = new DateTimeOffset(2008, 5, 1, 8, 6, 32, new TimeSpan(1, 0, 0)),
                Id = Guid.Parse("8a73cf82-47d7-4d9c-9541-88f659705903"),
                OrganizationId = Guid.Parse("4165bdfe-7cb4-ed11-b83e-00505683fbf4")
            };

            return org;
            */

            return await _mediator.Send(new OrgUserGetCommand(userIdGuid));
        }

        [Route("api/org-users/{organizationId}")]
        [HttpGet]
        [Produces("application/json")]
        public async Task<IEnumerable<OrgUserResponse>> List(string organizationId)
        {
            if (!Guid.TryParse(organizationId, out Guid organizationIdGuid))
            {
                throw new Exception("Invalid Organization Guid");
            }

            /*
            List<OrgUserResponse> orgs = new List<OrgUserResponse>();
            orgs.Add(new OrgUserResponse
            {
                ContactAuthorizationTypeCode = ContactAuthorizationTypeCode.Primary,
                LastName = "test",
                FirstName = "jane",
                Email = "jane@test.com",
                PhoneNumber = "2501112222",
                JobTitle = "Teacher",
                DateOfBirth = new DateTimeOffset(2008, 5, 1, 8, 6, 32, new TimeSpan(1, 0, 0)),
                Id = Guid.Parse("8a73cf82-47d7-4d9c-9541-88f659705903"),
                OrganizationId = Guid.Parse("4165bdfe-7cb4-ed11-b83e-00505683fbf4")
            });
            orgs.Add(new OrgUserResponse
            {
                ContactAuthorizationTypeCode = ContactAuthorizationTypeCode.Contact,
                LastName = "Test",
                FirstName = "James",
                Email = "james@test.com",
                PhoneNumber = "2504442222",
                JobTitle = "Teacher",
                DateOfBirth = new DateTimeOffset(2008, 5, 1, 8, 6, 32, new TimeSpan(1, 0, 0)),
                Id = Guid.Parse("ebbd09c8-b012-4617-b4a4-ea104283a4ec"),
                OrganizationId = Guid.Parse("4165bdfe-7cb4-ed11-b83e-00505683fbf4")
            });

            return orgs;
            */


            return await _mediator.Send(new OrgUserListCommand(organizationIdGuid));
        }
    }
}