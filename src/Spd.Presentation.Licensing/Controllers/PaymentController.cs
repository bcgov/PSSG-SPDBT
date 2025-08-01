using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Payment;
using Spd.Manager.Shared;
using Spd.Presentation.Licensing.Configurations;
using Spd.Utilities.Shared;
using System.ComponentModel.DataAnnotations;
using System.Configuration;

namespace Spd.Presentation.Licensing.Controllers
{
    /// <summary>
    /// Licensing application Payment endpoints
    /// </summary>
    public class PaymentController : SpdControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly PaymentsConfiguration _paymentsConfiguration;
        private readonly ILogger<PaymentController> _logger;

        public PaymentController(IMediator mediator,
            IMapper mapper,
            IConfiguration configuration,
            ILogger<PaymentController> logger
            )
        {
            _mediator = mediator;
            _mapper = mapper;
            _configuration = configuration;
            _logger = logger;
            PaymentsConfiguration? paymentsConfiguration = configuration.GetSection("Payments").Get<PaymentsConfiguration>();
            if (paymentsConfiguration == null)
                throw new ConfigurationErrorsException("PaymentsConfiguration configuration does not exist.");
            _paymentsConfiguration = paymentsConfiguration;
        }

        #region unauth-applicant-payment
        /// <summary>
        /// Return the direct pay payment link 
        /// </summary>
        /// <param name="paymentLinkCreateRequest">which include Payment link create request</param>
        /// <returns></returns>
        [Route("api/unauth-licence/{applicationId}/payment-link")]
        [HttpPost]
        public async Task<PaymentLinkResponse> GetLicencePaymentLink([FromBody][Required] PaymentLinkCreateRequest paymentLinkCreateRequest)
        {
            string? hostUrl = _configuration.GetValue<string>("HostUrl");
            string redirectUrl = $"{hostUrl}api/unauth-licence/payment-result";
            return await _mediator.Send(new PaymentLinkCreateCommand(paymentLinkCreateRequest, redirectUrl, _paymentsConfiguration.MaxOnlinePaymentFailedTimes));
        }

        /// <summary>
        /// redirect url for paybc to redirect to
        /// </summary>
        /// <returns></returns>
        [Route("api/unauth-licence/payment-result")]
        [HttpGet]
        public async Task<ActionResult> ProcessLicencePaymentResult([FromQuery] PaybcPaymentResultViewModel paybcResult)
        {
            string? hostUrl = _configuration.GetValue<string>("HostUrl");
            string? successPath = _paymentsConfiguration.UnauthPersonalLicPaymentSuccessPath;
            string? failPath = _paymentsConfiguration.UnauthPersonalLicPaymentFailPath;
            string? cancelPath = _paymentsConfiguration.UnauthPersonalLicPaymentCancelPath;
            string? errorPath = _paymentsConfiguration.UnauthPersonalLicPaymentErrorPath;

            try
            {
                PaybcPaymentResult paybcPaymentResult = _mapper.Map<PaybcPaymentResult>(paybcResult);

                if (!paybcPaymentResult.Success && string.Equals(paybcPaymentResult.MessageText, "Payment canceled", StringComparison.InvariantCultureIgnoreCase))
                {
                    _logger.LogInformation("Payment is being cancelled.");
                    return Redirect($"{hostUrl}{cancelPath}{paybcPaymentResult.ApplicationId}");
                }

                var paymentId = await _mediator.Send(new PaymenCreateCommand(Request.QueryString.ToString(), paybcPaymentResult));
                if (paybcPaymentResult.Success)
                    return Redirect($"{hostUrl}{successPath}{paymentId}");

                return Redirect($"{hostUrl}{failPath}{paymentId}");
            }
            catch (Exception ex)
            {
                _logger.LogError("Payment result processing has errors : {Exception}", ex);
                if (paybcResult.trnApproved == 1)
                {
                    PaybcPaymentResult log = _mapper.Map<PaybcPaymentResult>(paybcResult);
                    _logger.LogError("Get trnApproved = 1 from Paybc, exception thrown for creating payment for application {ApplicationId}, payment data = {paymentLog}", log.ApplicationId, log);
                }
                return Redirect($"{hostUrl}{errorPath}");
            }
        }

        /// <summary>
        /// Get the payment result for application and payment
        /// </summary>
        /// <returns></returns>
        [Route("api/unauth-licence/payments/{paymentId}")]
        [HttpGet]
        public async Task<PaymentResponse> GetLicencePaymentResult([FromRoute] Guid paymentId)
        {
            return await _mediator.Send(new PaymentQuery(paymentId));
        }

        /// <summary>
        /// Get the payment failed times for an application
        /// </summary>
        /// <returns></returns>
        [Route("api/unauth-licence/{applicationId}/payment-attempts")]
        [HttpGet]
        public async Task<int> GetFailedPaymentAttempts([FromRoute] Guid applicationId)
        {
            return await _mediator.Send(new PaymentFailedAttemptCountQuery(applicationId));
        }

        /// <summary>
        /// download the receipt for successful payment
        /// </summary>
        /// <param name="applicationId"></param>
        /// <returns>FileStreamResult</returns>
        [Route("api/unauth-licence/{applicationId}/payment-receipt")]
        [HttpGet]
        public async Task<FileStreamResult> LicenceDownloadReceiptAsync([FromRoute] Guid applicationId)
        {
            FileResponse response = await _mediator.Send(new PaymentReceiptQuery(applicationId));
            var content = new MemoryStream(response.Content);
            var contentType = response.ContentType ?? "application/octet-stream";
            return File(content, contentType, response.FileName);
        }

        /// <summary>
        /// download the manual payment form
        /// </summary>
        /// <param name="applicationId"></param>
        /// <returns>FileStreamResult</returns>
        [Route("api/unauth-licence/{applicationId}/manual-payment-form")]
        [HttpGet]
        public async Task<FileStreamResult> LicenceDownloadManualPaymentFormAsync([FromRoute] Guid applicationId)
        {
            FileResponse response = await _mediator.Send(new ManualPaymentFormQuery(applicationId));
            var content = new MemoryStream(response.Content);
            var contentType = response.ContentType ?? "application/octet-stream";
            return File(content, contentType, response.FileName);
        }
        #endregion

        #region auth-applicant-payment
        /// <summary>
        /// Return the direct pay payment link 
        /// </summary>
        /// <param name="paymentLinkCreateRequest">which include Payment link create request</param>
        /// <returns></returns>
        [Route("api/auth-licence/{applicationId}/payment-link")]
        [HttpPost]
        [Authorize(Policy = "OnlyBcsc")]
        public async Task<PaymentLinkResponse> GetApplicantLicencePaymentLink([FromBody][Required] PaymentLinkCreateRequest paymentLinkCreateRequest)
        {
            string? hostUrl = _configuration.GetValue<string>("HostUrl");
            string redirectUrl = $"{hostUrl}api/auth-licence/payment-result";
            return await _mediator.Send(new PaymentLinkCreateCommand(paymentLinkCreateRequest, redirectUrl, _paymentsConfiguration.MaxOnlinePaymentFailedTimes));
        }

        /// <summary>
        /// redirect url for paybc to redirect to
        /// </summary>
        /// <returns></returns>
        [Route("api/auth-licence/payment-result")]
        [HttpGet]
        public async Task<ActionResult> ProcessApplicantLicencePaymentResult([FromQuery] PaybcPaymentResultViewModel paybcResult)
        {
            string? hostUrl = _configuration.GetValue<string>("HostUrl");
            string? successPath = _paymentsConfiguration.AuthPersonalLicPaymentSuccessPath;
            string? failPath = _paymentsConfiguration.AuthPersonalLicPaymentFailPath;
            string? cancelPath = _paymentsConfiguration.AuthPersonalLicPaymentCancelPath;
            string? errorPath = _paymentsConfiguration.AuthPersonalLicPaymentErrorPath;

            try
            {
                PaybcPaymentResult paybcPaymentResult = _mapper.Map<PaybcPaymentResult>(paybcResult);

                if (!paybcPaymentResult.Success && String.Equals(paybcPaymentResult.MessageText, "Payment Canceled", StringComparison.InvariantCultureIgnoreCase))
                {
                    _logger.LogInformation("Payment is being cancelled.");
                    return Redirect($"{hostUrl}{cancelPath}{paybcPaymentResult.ApplicationId}");
                }

                var paymentId = await _mediator.Send(new PaymenCreateCommand(Request.QueryString.ToString(), paybcPaymentResult));
                if (paybcPaymentResult.Success)
                    return Redirect($"{hostUrl}{successPath}{paymentId}");

                return Redirect($"{hostUrl}{failPath}{paymentId}");
            }
            catch (Exception ex)
            {
                _logger.LogError("Payment result processing has errors : {Exception}", ex);
                if (paybcResult.trnApproved == 1)
                {
                    PaybcPaymentResult log = _mapper.Map<PaybcPaymentResult>(paybcResult);
                    _logger.LogError("Get trnApproved = 1 from Paybc, exception thrown for creating payment for application {ApplicationId}, payment data = {paymentLog}", log.ApplicationId, log);
                }
                return Redirect($"{hostUrl}{errorPath}");
            }
        }

        /// <summary>
        /// Get the payment result for application and payment
        /// </summary>
        /// <returns></returns>
        [Route("api/auth-licence/payments/{paymentId}")]
        [HttpGet]
        [Authorize(Policy = "OnlyBcsc")]
        public async Task<PaymentResponse> GetApplicantLicencePaymentResult([FromRoute] Guid paymentId)
        {
            return await _mediator.Send(new PaymentQuery(paymentId));
        }

        /// <summary>
        /// Get the failed payment times for an application
        /// </summary>
        /// <returns></returns>
        [Route("api/auth-licence/{applicationId}/payment-attempts")]
        [HttpGet]
        [Authorize(Policy = "OnlyBcsc")]
        public async Task<int> GetApplicantFailedPaymentAttempts([FromRoute] Guid applicationId)
        {
            return await _mediator.Send(new PaymentFailedAttemptCountQuery(applicationId));
        }

        /// <summary>
        /// download the receipt for successful payment
        /// </summary>
        /// <param name="applicationId"></param>
        /// <returns>FileStreamResult</returns>
        [Route("api/auth-licence/{applicationId}/payment-receipt")]
        [HttpGet]
        [Authorize(Policy = "OnlyBcsc")]
        public async Task<FileStreamResult> ApplicantLicenceDownloadReceiptAsync([FromRoute] Guid applicationId)
        {
            FileResponse response = await _mediator.Send(new PaymentReceiptQuery(applicationId));
            var content = new MemoryStream(response.Content);
            var contentType = response.ContentType ?? "application/octet-stream";
            return File(content, contentType, response.FileName);
        }

        /// <summary>
        /// download the manual payment form
        /// </summary>
        /// <param name="applicationId"></param>
        /// <returns>FileStreamResult</returns>
        [Route("api/auth-licence/{applicationId}/manual-payment-form")]
        [HttpGet]
        [Authorize(Policy = "OnlyBcsc")]
        public async Task<FileStreamResult> ApplicantLicenceDownloadManualPaymentFormAsync([FromRoute] Guid applicationId)
        {
            FileResponse response = await _mediator.Send(new ManualPaymentFormQuery(applicationId));
            var content = new MemoryStream(response.Content);
            var contentType = response.ContentType ?? "application/octet-stream";
            return File(content, contentType, response.FileName);
        }
        #endregion

        #region auth-biz-payment
        /// <summary>
        /// Return the direct pay payment link 
        /// </summary>
        /// <param name="paymentLinkCreateRequest">which include Payment link create request</param>
        /// <param name="bizId">business id</param>
        /// <returns></returns>
        [Route("api/business/{bizId}/applications/{applicationId}/payment-link")]
        [HttpPost]
        [Authorize(Policy = "OnlyBCeID")]
        public async Task<PaymentLinkResponse> GetBizLicencePaymentLink([FromBody][Required] PaymentLinkCreateRequest paymentLinkCreateRequest, [FromRoute] Guid bizId)
        {
            string? hostUrl = _configuration.GetValue<string>("HostUrl");
            string redirectUrl = $"{hostUrl}api/business/{bizId}/payment-result";
            return await _mediator.Send(new PaymentLinkCreateCommand(paymentLinkCreateRequest, redirectUrl, _paymentsConfiguration.MaxOnlinePaymentFailedTimes));
        }

        /// <summary>
        /// redirect url for paybc to redirect to
        /// </summary>
        /// <returns></returns>
        [Route("api/business/{bizId}/payment-result")]
        [HttpGet]
        public async Task<ActionResult> ProcessBizLicencePaymentResult([FromQuery] PaybcPaymentResultViewModel paybcResult, [FromRoute] Guid bizId)
        {
            string? hostUrl = _configuration.GetValue<string>("HostUrl");
            string? successPath = _paymentsConfiguration.AuthBizLicPaymentSuccessPath;
            string? failPath = _paymentsConfiguration.AuthBizLicPaymentFailPath;
            string? cancelPath = _paymentsConfiguration.AuthBizLicPaymentCancelPath;
            string? errorPath = _paymentsConfiguration.AuthBizLicPaymentErrorPath;

            try
            {
                PaybcPaymentResult paybcPaymentResult = _mapper.Map<PaybcPaymentResult>(paybcResult);

                if (!paybcPaymentResult.Success && String.Equals(paybcPaymentResult.MessageText, "Payment Canceled", StringComparison.InvariantCultureIgnoreCase))
                {
                    _logger.LogInformation("Payment is being cancelled.");
                    return Redirect($"{hostUrl}{cancelPath}{paybcPaymentResult.ApplicationId}?bizId={bizId}");
                }

                var paymentId = await _mediator.Send(new PaymenCreateCommand(Request.QueryString.ToString(), paybcPaymentResult));
                if (paybcPaymentResult.Success)
                    return Redirect($"{hostUrl}{successPath}{paymentId}?bizId={bizId}");

                return Redirect($"{hostUrl}{failPath}{paymentId}?bizId={bizId}");
            }
            catch (Exception ex)
            {
                _logger.LogError("Payment result processing has errors : {Exception}", ex);
                if (paybcResult.trnApproved == 1)
                {
                    PaybcPaymentResult log = _mapper.Map<PaybcPaymentResult>(paybcResult);
                    _logger.LogError("Get trnApproved = 1 from Paybc, exception thrown for creating payment for application {ApplicationId}, payment data = {paymentLog}", log.ApplicationId, log);
                }
                return Redirect($"{hostUrl}{errorPath}?bizId={bizId}");
            }
        }

        /// <summary>
        /// Get the payment result for application and payment
        /// </summary>
        /// <returns></returns>
        [Route("api/business/{bizId}/payments/{paymentId}")]
        [HttpGet]
        [Authorize(Policy = "OnlyBCeID")]
        public async Task<PaymentResponse> GetBizLicencePaymentResult([FromRoute] Guid paymentId, [FromRoute] Guid bizId)
        {
            return await _mediator.Send(new PaymentQuery(paymentId));
        }

        /// <summary>
        /// Get the failed payment times for an application
        /// </summary>
        /// <returns></returns>
        [Route("api/business/{bizId}/applications/{applicationId}/payment-attempts")]
        [HttpGet]
        [Authorize(Policy = "OnlyBCeID")]
        public async Task<int> GetBizFailedPaymentAttempts([FromRoute] Guid applicationId, [FromRoute] Guid bizId)
        {
            return await _mediator.Send(new PaymentFailedAttemptCountQuery(applicationId));
        }

        /// <summary>
        /// download the receipt for successful payment
        /// </summary>
        /// <param name="applicationId"></param>
        /// <param name="bizId"></param>
        /// <returns>FileStreamResult</returns>
        [Route("api/business/{bizId}/applications/{applicationId}/payment-receipt")]
        [HttpGet]
        [Authorize(Policy = "OnlyBCeID")]
        public async Task<FileStreamResult> BizLicenceDownloadReceiptAsync([FromRoute] Guid applicationId, [FromRoute] Guid bizId)
        {
            FileResponse response = await _mediator.Send(new PaymentReceiptQuery(applicationId));
            var content = new MemoryStream(response.Content);
            var contentType = response.ContentType ?? "application/octet-stream";
            return File(content, contentType, response.FileName);
        }

        /// <summary>
        /// download the manual payment form
        /// </summary>
        /// <param name="applicationId"></param>
        /// <param name="bizId"></param>
        /// <returns>FileStreamResult</returns>
        [Route("api/business/{bizId}/applications/{applicationId}/manual-payment-form")]
        [HttpGet]
        [Authorize(Policy = "OnlyBCeID")]
        public async Task<FileStreamResult> BizLicenceDownloadManualPaymentFormAsync([FromRoute] Guid applicationId, [FromRoute] Guid bizId)
        {
            FileResponse response = await _mediator.Send(new ManualPaymentFormQuery(applicationId));
            var content = new MemoryStream(response.Content);
            var contentType = response.ContentType ?? "application/octet-stream";
            return File(content, contentType, response.FileName);
        }
        #endregion

        #region secure-payment-link for dynamics email.
        /// <summary>
        /// Redirect to PayBC the direct pay payment page 
        /// </summary>
        /// sample:http://localhost:5114/api/licence/payment-secure-link?encodedAppId=CfDJ8MELGoA6ZCBIuDpjih7jnJo3inVYsL3UPdbgBResn9qAoHpjCIIEmMJyuO_oHKEWLi-SA3qmmMJ_yqvl4myfXutYpPB75aOz7Wi49jjp1wHD9J56kmaOvJ3bhJuGl5hjbXybqO1TLXA0KsKO8Qr5IKLF7jK2WDpTn3hYj_U9YQ1g
        /// <returns></returns>
        [Route("api/licensing/payment-secure-link")]
        [HttpGet]
        public async Task<ActionResult> CreateLinkRedirectToPaybcPaymentPage([FromQuery] string encodedAppId, [FromQuery] string encodedPaymentId)
        {
            string? errorPath = _paymentsConfiguration.UnauthPersonalLicPaymentErrorPath;
            string? hostUrl = _configuration.GetValue<string>("HostUrl");
            try
            {
                string redirectUrl = $"{hostUrl}api/unauth-licence/payment-result";
                PaymentLinkFromSecureLinkCreateRequest linkCreateRequest = new()
                {
                    ApplicationId = null,
                    EncodedApplicationId = encodedAppId,
                    EncodedPaymentId = encodedPaymentId,
                    PaymentMethod = PaymentMethodCode.CreditCard
                };
                var result = await _mediator.Send(new PaymentLinkCreateCommand(linkCreateRequest, redirectUrl, _paymentsConfiguration.MaxOnlinePaymentFailedTimes));
                return Redirect(result.PaymentLinkUrl);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message, null);
                return Redirect($"{hostUrl}{errorPath}");
            }
        }
        #endregion
    }

    public class PaybcPaymentResultViewModel
    {
        public int trnApproved { get; set; }
        public string? messageText { get; set; }
        public string? cardType { get; set; }
        public string? trnOrderId { get; set; }
        public string? trnAmount { get; set; }
        public string? paymentMethod { get; set; }
        public string? trnDate { get; set; }
        public string? ref1 { get; set; }
        public string? ref2 { get; set; }
        public string? ref3 { get; set; }
        public string? pbcTxnNumber { get; set; }
        public string? trnNumber { get; set; }
        public string? hashValue { get; set; }
        public string? pbcRefNumber { get; set; }
        public string? glDate { get; set; }
        public string? paymentAuthCode { get; set; }
        public string? revenue { get; set; }
    }
}