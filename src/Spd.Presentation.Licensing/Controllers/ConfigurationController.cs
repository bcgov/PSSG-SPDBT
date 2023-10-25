using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Spd.Manager.Cases.Licence;
using Spd.Utilities.LogonUser.Configurations;
using Spd.Utilities.Recaptcha;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.Exceptions;

namespace Spd.Presentation.Licensing.Controllers
{
    public class ConfigurationController : SpdControllerBase
    {
        private readonly IOptions<BCeIDAuthenticationConfiguration> _bceidOption;
        private readonly IOptions<BcscAuthenticationConfiguration> _bcscOption;
        private readonly IConfiguration _configuration;
        private readonly IOptions<GoogleReCaptchaConfiguration> _captchaOption;

        public ConfigurationController(IOptions<BCeIDAuthenticationConfiguration> bceidConfiguration,
            IOptions<GoogleReCaptchaConfiguration> captchaOption,
            IOptions<BcscAuthenticationConfiguration> bcscConfiguration,
            IConfiguration configuration)
        {
            _bceidOption = bceidConfiguration;
            _captchaOption = captchaOption;
            _bcscOption = bcscConfiguration;
            _configuration = configuration;
        }


        [Route("api/configuration")]
        [HttpGet]
        public async Task<ConfigurationResponse> Get()
        {
            OidcConfiguration oidcResp = new OidcConfiguration
            {
                Issuer = _bceidOption.Value.Issuer,
                ClientId = _bceidOption.Value.ClientId,
                ResponseType = _bceidOption.Value.ResponseType,
                Scope = _bceidOption.Value.Scope,
                PostLogoutRedirectUri = _bceidOption.Value.PostLogoutRedirectUri
            };

            BcscConfiguration bcscConfig = new BcscConfiguration
            {
                Issuer = _bcscOption.Value.Issuer,
                ClientId = _bcscOption.Value.ClientId,
                ResponseType = _bcscOption.Value.ResponseType,
                Scope = _bcscOption.Value.Scope,
            };
            RecaptchaConfiguration recaptchaResp = new RecaptchaConfiguration(_captchaOption.Value.ClientKey);
            return await Task.FromResult(new ConfigurationResponse()
            {
                OidcConfiguration = oidcResp,
                RecaptchaConfiguration = recaptchaResp,
                BcscConfiguration = bcscConfig,
            });
        }

        /// <summary>
        /// Get Invalid Security Worker licence category combination Matrix
        /// </summary>
        /// <returns>InvalidWorkerLicenceCategoryMatrixConfiguration</returns>
        [Route("api/invalid-category-matrix")]
        [HttpGet]
        public async Task<InvalidWorkerLicenceCategoryMatrixConfiguration> GetInvalidCategoryMatrix()
        {
            var response = new InvalidWorkerLicenceCategoryMatrixConfiguration();
            var invalidMatrix = _configuration.GetSection("InvalidWorkerLicenceCategoryMatrix").Get<Dictionary<WorkerCategoryTypeCode, List<WorkerCategoryTypeCode>>>();
            if (invalidMatrix == null)
                throw new ApiException(System.Net.HttpStatusCode.InternalServerError, "missing configuration for invalid worker licence category matrix");
            response.InvalidWorkerLicenceCategoryMatrix = invalidMatrix;
            #region temp generation code
            //response.InvalidWorkerLicenceCategoryMatrix = new Dictionary<WorkerCategoryTypeCode, List<WorkerCategoryTypeCode>>
            //{
            //    {
            //        WorkerCategoryTypeCode.ArmouredCarGuard,
            //        new List<WorkerCategoryTypeCode> {
            //        WorkerCategoryTypeCode.ArmouredCarGuard,
            //        WorkerCategoryTypeCode.SecurityGuardUnderSupervision
            //        }
            //    },
            //    {
            //        WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller,
            //        new List<WorkerCategoryTypeCode> {
            //        WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller,
            //        WorkerCategoryTypeCode.SecurityAlarmInstallerUnderSupervision,
            //        WorkerCategoryTypeCode.SecurityAlarmInstaller,
            //        WorkerCategoryTypeCode.LocksmithUnderSupervision,
            //        WorkerCategoryTypeCode.Locksmith,
            //        WorkerCategoryTypeCode.SecurityGuardUnderSupervision
            //        }
            //    },
            //    {
            //        WorkerCategoryTypeCode.SecurityAlarmInstallerUnderSupervision,
            //        new List<WorkerCategoryTypeCode> {
            //        WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller,
            //        WorkerCategoryTypeCode.SecurityAlarmInstallerUnderSupervision,
            //        WorkerCategoryTypeCode.SecurityAlarmInstaller,
            //        WorkerCategoryTypeCode.SecurityAlarmMonitor,
            //        WorkerCategoryTypeCode.SecurityAlarmResponse,
            //        WorkerCategoryTypeCode.SecurityAlarmSales,
            //        WorkerCategoryTypeCode.ClosedCircuitTelevisionInstaller,
            //        WorkerCategoryTypeCode.SecurityGuardUnderSupervision
            //        }
            //    },
            //    {
            //        WorkerCategoryTypeCode.SecurityAlarmInstaller,
            //        new List<WorkerCategoryTypeCode> {
            //        WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller,
            //        WorkerCategoryTypeCode.SecurityAlarmInstallerUnderSupervision,
            //        WorkerCategoryTypeCode.SecurityAlarmInstaller,
            //        WorkerCategoryTypeCode.SecurityAlarmMonitor,
            //        WorkerCategoryTypeCode.SecurityAlarmResponse,
            //        WorkerCategoryTypeCode.SecurityAlarmSales,
            //        WorkerCategoryTypeCode.ClosedCircuitTelevisionInstaller,
            //        WorkerCategoryTypeCode.SecurityGuardUnderSupervision
            //        }
            //    },
            //    {
            //        WorkerCategoryTypeCode.SecurityAlarmMonitor,
            //        new List<WorkerCategoryTypeCode> {
            //        WorkerCategoryTypeCode.SecurityAlarmInstallerUnderSupervision,
            //        WorkerCategoryTypeCode.SecurityAlarmInstaller,
            //        WorkerCategoryTypeCode.SecurityAlarmMonitor,
            //        WorkerCategoryTypeCode.SecurityAlarmResponse,
            //        WorkerCategoryTypeCode.SecurityGuardUnderSupervision,
            //        WorkerCategoryTypeCode.SecurityGuard
            //        }
            //    },
            //    {
            //        WorkerCategoryTypeCode.SecurityAlarmResponse,
            //        new List<WorkerCategoryTypeCode> {
            //        WorkerCategoryTypeCode.SecurityAlarmInstallerUnderSupervision,
            //        WorkerCategoryTypeCode.SecurityAlarmInstaller,
            //        WorkerCategoryTypeCode.SecurityAlarmMonitor,
            //        WorkerCategoryTypeCode.SecurityAlarmResponse,
            //        WorkerCategoryTypeCode.SecurityGuardUnderSupervision,
            //        WorkerCategoryTypeCode.SecurityGuard
            //        }
            //    },
            //    {
            //        WorkerCategoryTypeCode.SecurityAlarmSales,
            //        new List<WorkerCategoryTypeCode> {
            //        WorkerCategoryTypeCode.SecurityAlarmInstallerUnderSupervision,
            //        WorkerCategoryTypeCode.SecurityAlarmInstaller,
            //        WorkerCategoryTypeCode.SecurityAlarmMonitor,
            //        WorkerCategoryTypeCode.SecurityAlarmSales,
            //        WorkerCategoryTypeCode.SecurityGuardUnderSupervision,
            //        WorkerCategoryTypeCode.SecurityGuard
            //        }
            //    },
            //    {
            //        WorkerCategoryTypeCode.ClosedCircuitTelevisionInstaller,
            //        new List<WorkerCategoryTypeCode> {
            //        WorkerCategoryTypeCode.SecurityAlarmInstallerUnderSupervision,
            //        WorkerCategoryTypeCode.SecurityAlarmInstaller,
            //        WorkerCategoryTypeCode.ClosedCircuitTelevisionInstaller,
            //        WorkerCategoryTypeCode.SecurityGuardUnderSupervision
            //        }
            //    },
            //    {
            //        WorkerCategoryTypeCode.LocksmithUnderSupervision,
            //        new List<WorkerCategoryTypeCode> {
            //        WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller,
            //        WorkerCategoryTypeCode.LocksmithUnderSupervision,
            //        WorkerCategoryTypeCode.Locksmith,
            //        WorkerCategoryTypeCode.SecurityGuardUnderSupervision
            //        }
            //    },
            //    {
            //        WorkerCategoryTypeCode.Locksmith,
            //        new List<WorkerCategoryTypeCode> {
            //        WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller,
            //        WorkerCategoryTypeCode.LocksmithUnderSupervision,
            //        WorkerCategoryTypeCode.Locksmith,
            //        WorkerCategoryTypeCode.SecurityGuardUnderSupervision
            //        }
            //    },
            //    {
            //        WorkerCategoryTypeCode.PrivateInvestigatorUnderSupervision,
            //        new List<WorkerCategoryTypeCode> {
            //        WorkerCategoryTypeCode.PrivateInvestigatorUnderSupervision,
            //        WorkerCategoryTypeCode.PrivateInvestigator,
            //        WorkerCategoryTypeCode.FireInvestigator,
            //        WorkerCategoryTypeCode.SecurityGuardUnderSupervision
            //        }
            //    },
            //    {
            //        WorkerCategoryTypeCode.PrivateInvestigator,
            //        new List<WorkerCategoryTypeCode> {
            //        WorkerCategoryTypeCode.PrivateInvestigatorUnderSupervision,
            //        WorkerCategoryTypeCode.PrivateInvestigator,
            //        WorkerCategoryTypeCode.FireInvestigator,
            //        WorkerCategoryTypeCode.SecurityGuardUnderSupervision
            //        }
            //    },
            //    {
            //        WorkerCategoryTypeCode.FireInvestigator,
            //        new List<WorkerCategoryTypeCode> {
            //        WorkerCategoryTypeCode.PrivateInvestigatorUnderSupervision,
            //        WorkerCategoryTypeCode.PrivateInvestigator,
            //        WorkerCategoryTypeCode.FireInvestigator,
            //        }
            //    },
            //    {
            //        WorkerCategoryTypeCode.SecurityConsultant,
            //        new List<WorkerCategoryTypeCode> {
            //        WorkerCategoryTypeCode.SecurityConsultant,
            //        WorkerCategoryTypeCode.SecurityGuardUnderSupervision,
            //        }
            //    },
            //    {
            //        WorkerCategoryTypeCode.SecurityGuardUnderSupervision,
            //        new List<WorkerCategoryTypeCode> {
            //        WorkerCategoryTypeCode.ArmouredCarGuard,
            //        WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller,
            //        WorkerCategoryTypeCode.SecurityAlarmInstallerUnderSupervision,
            //        WorkerCategoryTypeCode.SecurityAlarmInstaller,
            //        WorkerCategoryTypeCode.SecurityAlarmMonitor,
            //        WorkerCategoryTypeCode.SecurityAlarmResponse,
            //        WorkerCategoryTypeCode.SecurityAlarmSales,
            //        WorkerCategoryTypeCode.ClosedCircuitTelevisionInstaller,
            //        WorkerCategoryTypeCode.LocksmithUnderSupervision,
            //        WorkerCategoryTypeCode.Locksmith,
            //        WorkerCategoryTypeCode.PrivateInvestigator,
            //        WorkerCategoryTypeCode.PrivateInvestigatorUnderSupervision,
            //        WorkerCategoryTypeCode.FireInvestigator,
            //        WorkerCategoryTypeCode.SecurityConsultant,
            //        WorkerCategoryTypeCode.SecurityGuardUnderSupervision,
            //        WorkerCategoryTypeCode.SecurityGuard,
            //        WorkerCategoryTypeCode.BodyArmourSales
            //        }
            //    },
            //    {
            //        WorkerCategoryTypeCode.SecurityGuard,
            //        new List<WorkerCategoryTypeCode> {
            //        WorkerCategoryTypeCode.SecurityAlarmMonitor,
            //        WorkerCategoryTypeCode.SecurityAlarmResponse,
            //        WorkerCategoryTypeCode.SecurityGuardUnderSupervision,
            //        WorkerCategoryTypeCode.SecurityGuard
            //        }
            //    },
            //    {
            //        WorkerCategoryTypeCode.BodyArmourSales,
            //        new List<WorkerCategoryTypeCode> {
            //        WorkerCategoryTypeCode.SecurityGuardUnderSupervision,
            //        WorkerCategoryTypeCode.BodyArmourSales
            //        }
            //    }
            //};
            #endregion
            return response;
        }
    }

    public record ConfigurationResponse
    {
        public OidcConfiguration OidcConfiguration { get; set; } = null!;
        public RecaptchaConfiguration RecaptchaConfiguration { get; set; } = null!;
        public BcscConfiguration BcscConfiguration { get; set; } = null!;
    }

    public record OidcConfiguration
    {
        public string Issuer { get; set; }
        public string ClientId { get; set; }
        public string ResponseType { get; set; }
        public string Scope { get; set; }
        public string PostLogoutRedirectUri { get; set; }
    }
    public record BcscConfiguration : OidcConfiguration;
    public record RecaptchaConfiguration(string Key);
    public class InvalidWorkerLicenceCategoryMatrixConfiguration
    {
        public Dictionary<WorkerCategoryTypeCode, List<WorkerCategoryTypeCode>> InvalidWorkerLicenceCategoryMatrix { get; set; }
    }
}