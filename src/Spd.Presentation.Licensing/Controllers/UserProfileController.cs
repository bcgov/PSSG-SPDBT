
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Common.ManagerContract;
using Spd.Manager.Membership.UserProfile;
using Spd.Utilities.LogonUser;
using Spd.Utilities.Shared;
using System.Security.Principal;
using System.Text.Json;

namespace Spd.Presentation.Licensing.Controllers
{
    [ApiController]
    public class UserProfileController : SpdControllerBase
    {
        private readonly ILogger<UserProfileController> _logger;
        private readonly IPrincipal _currentUser;
        private readonly IMediator _mediator;

        public UserProfileController(ILogger<UserProfileController> logger, IPrincipal currentUser, IMediator mediator)
        {
            _logger = logger;
            _currentUser = currentUser;
            _mediator = mediator;
        }

        /// <summary>
        /// Security Worker whoami, for security worker portal
        /// return 204 No Content when there is no contact found with this BCSC.
        /// </summary>
        /// <returns></returns>
        [Route("api/security-worker/whoami")]
        [HttpGet]
        [Authorize(Policy = "OnlyBcsc")]
        public async Task<ApplicantProfileResponse?> SecurityWorkerWhoami()
        {
            var info = _currentUser.GetBcscUserIdentityInfo();
            //todo: we do not know what to do yet.
            //var response = await _mediator.Send(new GetApplicantProfileQuery(info.Sub));
            //temp code, just return the data from bcsc
            ApplicantProfileResponse response = new ApplicantProfileResponse()
            {
                BirthDate = info.BirthDate,
                Email = info.Email,
                FirstName = info.FirstName,
                Gender = info.Gender switch
                {
                    "female" => GenderCode.F,
                    "male" => GenderCode.M,
                    "diverse" => GenderCode.U,
                    _ => null,
                },
                IdentityProviderTypeCode = IdentityProviderTypeCode.BcServicesCard,
                LastName = info.LastName,
                MiddleName1 = info.MiddleName1,
                MiddleName2 = info.MiddleName2,
                Sub = info.Sub,
                ResidentialAddress = GetAddressFromStr(info.Address)
            };

            return response;
        }

        /// <summary>
        /// Security Worker whoami, for security worker portal
        /// return 204 No Content when there is no contact found with this BCSC.
        /// </summary>
        /// <returns></returns>
        [Route("api/security-worker/login")]
        [HttpGet]
        [Authorize(Policy = "OnlyBcsc")]
        public async Task<ApplicantProfileResponse?> SecurityWorkerLogin()
        {
            var info = _currentUser.GetBcscUserIdentityInfo();
            var response = await _mediator.Send(new ManageApplicantProfileCommand(info));

            response.Sub = info.Sub;
            response.IdentityProviderTypeCode = IdentityProviderTypeCode.BcServicesCard;
            response.ResidentialAddress = GetAddressFromStr(info.Address);
            return response;
        }
        /// <summary>
        /// Biz bceid login, for biz licence
        /// </summary>
        /// <returns></returns>
        [Route("api/biz-licence/whoami")]
        [HttpGet]
        [Authorize(Policy = "OnlyBceid")]
        public async Task<OrgUserProfileResponse?> BizLicenceWhoami()
        {
            var info = _currentUser.GetBceidUserIdentityInfo();
            return new OrgUserProfileResponse
            {
                IdentityProviderType = IdentityProviderTypeCode.BusinessBceId,
                UserDisplayName = info.DisplayName,
                UserGuid = info.UserGuid
            };
        }

        private Address? GetAddressFromStr(string? jsonStr)
        {
            if (jsonStr == null) return null;
            try
            {
                var serializeOptions = new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                    WriteIndented = true
                };
                var result = JsonSerializer.Deserialize<BcscAddress>(jsonStr, serializeOptions);
                return new Address()
                {
                    AddressLine1 = result?.Street_address,
                    City = result.Locality,
                    Country = result.Country,
                    PostalCode = result.Postal_code,
                    Province = result.Region,
                };
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }

    internal class BcscAddress
    {
        public string? Street_address { get; set; }
        public string? Country { get; set; }
        public string? Locality { get; set; } //city
        public string? Postal_code { get; set; }
        public string? Region { get; set; } //province
    }
}