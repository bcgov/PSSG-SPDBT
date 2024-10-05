using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Payment;
using Spd.Manager.Shared;
using Spd.Presentation.Screening.Configurations;
using Spd.Utilities.Shared;
using System.ComponentModel.DataAnnotations;
using System.Configuration;

namespace Spd.Presentation.Screening.Controllers
{
    /// <summary>
    /// </summary>
    public class PaymentController : SpdControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly PaymentsConfiguration _paymentsConfiguration;
        private readonly ILogger<PaymentController> _logger;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="mediator"></param>
        /// <param name="mapper"></param>
        /// <param name="configuration"></param>
        public PaymentController(IMediator mediator,
            IMapper mapper,
            IConfiguration configuration,
            ILogger<PaymentController> logger
            )
        {
            _mediator = mediator;
            _mapper = mapper;
            _configuration = configuration;
            _paymentsConfiguration = configuration.GetSection("Payments").Get<PaymentsConfiguration>();
            _logger = logger;
            if (_paymentsConfiguration == null)
                throw new ConfigurationErrorsException("PaymentsConfiguration configuration does not exist.");
        }

        #region applicant-payment
        /// <summary>
        /// Return the direct pay payment link 
        /// </summary>
        /// <param name="ApplicantPaymentLinkCreateRequest">which include Payment link create request</param>
        /// <returns></returns>
        [Route("api/applicants/screenings/{applicationId}/payment-link")]
        [HttpPost]
        [Authorize(Policy = "OnlyBcsc", Roles = "Applicant")]
        public async Task<PaymentLinkResponse> GetApplicantPaymentLink([FromBody][Required] PaymentLinkCreateRequest paymentLinkCreateRequest)
        {
            string? hostUrl = _configuration.GetValue<string>("HostUrl");
            string redirectUrl = $"{hostUrl}api/applicants/screenings/payment-result";
            return await _mediator.Send(new PaymentLinkCreateCommand(paymentLinkCreateRequest, redirectUrl, _paymentsConfiguration.MaxOnlinePaymentFailedTimes));
        }

        /// <summary>
        /// redirect url for paybc to redirect to
        /// </summary>
        /// <returns></returns>
        [Route("api/applicants/screenings/payment-result")]
        [HttpGet]
        public async Task<ActionResult> ProcessApplicantPaymentResult([FromQuery] PaybcPaymentResultViewModel paybcResult)
        {
            string? hostUrl = _configuration.GetValue<string>("HostUrl");
            string? successPath = _paymentsConfiguration.ApplicantPortalPaymentSuccessPath;
            string? failPath = _paymentsConfiguration.ApplicantPortalPaymentFailPath;
            string? cancelPath = _paymentsConfiguration.ApplicantPortalPaymentCancelPath;
            string? errorPath = _paymentsConfiguration.ApplicantPortalPaymentErrorPath;

            try
            {
                PaybcPaymentResult paybcPaymentResult = _mapper.Map<PaybcPaymentResult>(paybcResult);

                if (!paybcPaymentResult.Success && paybcPaymentResult.MessageText == "Payment Canceled")
                {
                    _logger.LogInformation("Payment is being cancelled.");
                    return Redirect($"{hostUrl}{cancelPath}");
                }

                var paymentId = await _mediator.Send(new PaymenCreateCommand(Request.QueryString.ToString(), paybcPaymentResult));
                if (paybcPaymentResult.Success)
                    return Redirect($"{hostUrl}{successPath}{paymentId}");

                return Redirect($"{hostUrl}{failPath}{paymentId}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Payment result processing has errors +{ex}");
                return Redirect($"{hostUrl}{errorPath}");
            }
        }

        /// <summary>
        /// Get the payment result for application and payment
        /// </summary>
        /// <returns></returns>
        [Route("api/applicants/screenings/payments/{paymentId}")]
        [HttpGet]
        [Authorize(Policy = "OnlyBcsc", Roles = "Applicant")]
        public async Task<PaymentResponse> GetApplicantPaymentResult([FromRoute] Guid paymentId)
        {
            return await _mediator.Send(new PaymentQuery(paymentId));
        }

        /// <summary>
        /// Get the payment result for application and payment
        /// </summary>
        /// <returns></returns>
        [Route("api/applicants/screenings/{applicationId}/payment-attempts")]
        [HttpGet]
        [Authorize(Policy = "OnlyBcsc", Roles = "Applicant")]
        public async Task<int> GetApplicantFailedPaymentAttempts([FromRoute] Guid applicationId)
        {
            return await _mediator.Send(new PaymentFailedAttemptCountQuery(applicationId));
        }

        /// <summary>
        /// download the receipt for successful payment
        /// </summary>
        /// <param name="applicationId"></param>
        /// <returns>FileStreamResult</returns>
        [Route("api/applicants/screenings/{applicationId}/payment-receipt")]
        [HttpGet]
        [Authorize(Policy = "OnlyBcsc", Roles = "Applicant")]
        public async Task<FileStreamResult> ApplicantDownloadReceiptAsync([FromRoute] Guid applicationId)
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
        [Route("api/applicants/screenings/{applicationId}/manual-payment-form")]
        [HttpGet]
        [Authorize(Policy = "OnlyBcsc", Roles = "Applicant")]
        public async Task<FileStreamResult> ApplicantDownloadManualPaymentFormAsync([FromRoute] Guid applicationId)
        {
            FileResponse response = await _mediator.Send(new ManualPaymentFormQuery(applicationId));
            var content = new MemoryStream(response.Content);
            var contentType = response.ContentType ?? "application/octet-stream";
            return File(content, contentType, response.FileName);
        }
        #endregion

        #region org-payment
        /// <summary>
        /// Return the direct pay payment link 
        /// </summary>
        /// <param name="paymentLinkCreateRequest">which include Payment link create request</param>
        /// <param name="orgId">organization id</param>
        /// <returns></returns>
        [Authorize(Policy = "OnlyBCeID", Roles = "Primary,Contact")]
        [Route("api/orgs/{orgId}/applications/{applicationId}/payment-link")]
        [HttpPost]
        [Authorize(Policy = "OnlyBceid")]
        public async Task<PaymentLinkResponse> GetOrgPaymentLink([FromBody][Required] PaymentLinkCreateRequest paymentLinkCreateRequest, [FromRoute] Guid orgId)
        {
            string? hostUrl = _configuration.GetValue<string>("HostUrl");
            string redirectUrl = $"{hostUrl}api/orgs/{orgId}/payment-result";
            return await _mediator.Send(new PaymentLinkCreateCommand(paymentLinkCreateRequest, redirectUrl));
        }

        /// <summary>
        /// redirect url for paybc to redirect to
        /// </summary>
        /// <returns></returns>
        [Route("api/orgs/{orgId}/payment-result")]
        [HttpGet]
        public async Task<ActionResult> ProcessOrgPaymentResult([FromQuery] PaybcPaymentResultViewModel paybcResult, [FromRoute] Guid orgId)
        {
            string? hostUrl = _configuration.GetValue<string>("HostUrl");
            string? successPath = _paymentsConfiguration.OrgPortalPaymentSuccessPath;
            string? failPath = _paymentsConfiguration.OrgPortalPaymentFailPath;
            string? cancelPath = _paymentsConfiguration.OrgPortalPaymentCancelPath;
            string? errorPath = _paymentsConfiguration.OrgPortalPaymentErrorPath;

            try
            {
                PaybcPaymentResult paybcPaymentResult = _mapper.Map<PaybcPaymentResult>(paybcResult);

                if (!paybcPaymentResult.Success && paybcPaymentResult.MessageText == "Payment Canceled")
                    return Redirect($"{hostUrl}{cancelPath}?orgId={orgId}");

                var paymentId = await _mediator.Send(new PaymenCreateCommand(Request.QueryString.ToString(), paybcPaymentResult));
                if (paybcPaymentResult.Success)
                    return Redirect($"{hostUrl}{successPath}{paymentId}?orgId={orgId}");

                return Redirect($"{hostUrl}{failPath}{paymentId}?orgId={orgId}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Payment result processing for org has errors +{ex}");
                return Redirect($"{hostUrl}{errorPath}?orgId={orgId}");
            }
        }

        /// <summary>
        /// Get the payment result for org and payment
        /// </summary>
        /// <returns></returns>
        [Route("api/orgs/{orgId}/payments/{paymentId}")]
        [HttpGet]
        [Authorize(Policy = "OnlyBCeID", Roles = "Primary,Contact")]
        public async Task<PaymentResponse> GetOrgPaymentResult([FromRoute] Guid paymentId)
        {
            return await _mediator.Send(new PaymentQuery(paymentId));
        }

        /// <summary>
        /// Get failed attempts for org paid application
        /// </summary>
        /// <returns></returns>
        [Route("api/orgs/{orgId}/applications/{applicationId}/payment-attempts")]
        [HttpGet]
        [Authorize(Policy = "OnlyBCeID", Roles = "Primary,Contact")]
        public async Task<int> GetFailedPaymentAttempts([FromRoute] Guid applicationId, [FromRoute] Guid orgId)
        {
            return await _mediator.Send(new PaymentFailedAttemptCountQuery(applicationId));
        }

        /// <summary>
        /// download the receipt for successful payment
        /// </summary>
        /// <param name="paymentId"></param>
        /// <returns>FileStreamResult</returns>
        [Route("api/orgs/{orgId}/applications/{applicationId}/payment-receipt")]
        [HttpGet]
        [Authorize(Policy = "OnlyBCeID", Roles = "Primary,Contact")]
        public async Task<FileStreamResult> DownloadOrgReceiptAsync([FromRoute] Guid applicationId, [FromRoute] Guid orgId)
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
        [Route("api/orgs/{orgId}/applications/{applicationId}/manual-payment-form")]
        [HttpGet]
        [Authorize(Policy = "OnlyBCeID", Roles = "Primary,Contact")]
        public async Task<FileStreamResult> DownloadOrgManualPaymentFormAsync([FromRoute] Guid applicationId)
        {
            FileResponse response = await _mediator.Send(new ManualPaymentFormQuery(applicationId));
            var content = new MemoryStream(response.Content);
            var contentType = response.ContentType ?? "application/octet-stream";
            return File(content, contentType, response.FileName);
        }
        #endregion

        #region applicant-invite-link-payment
        /// <summary>
        /// Return the direct pay payment link 
        /// </summary>
        /// <param name="paymentLinkCreateRequest">which include Payment link create request</param>
        /// <returns></returns>
        [Route("api/crrpa/payment-link")]
        [HttpPost]
        public async Task<PaymentLinkResponse> GetApplicantInvitePaymentLink([FromBody][Required] PaymentLinkCreateRequest paymentLinkCreateRequest)
        {
            string? hostUrl = _configuration.GetValue<string>("HostUrl");
            string redirectUrl = $"{hostUrl}api/crrpa/payment-result";
            return await _mediator.Send(new PaymentLinkCreateCommand(paymentLinkCreateRequest, redirectUrl, _paymentsConfiguration.MaxOnlinePaymentFailedTimes));
        }

        /// <summary>
        /// redirect url for paybc to redirect to
        /// </summary>
        /// <returns></returns>
        [Route("api/crrpa/payment-result")]
        [HttpGet]
        public async Task<ActionResult> ProcessApplicantInvitePaymentResult([FromQuery] PaybcPaymentResultViewModel paybcResult)
        {
            string? hostUrl = _configuration.GetValue<string>("HostUrl");
            string? successPath = _paymentsConfiguration.CrrpaPaymentSuccessPath;
            string? failPath = _paymentsConfiguration.CrrpaPaymentFailPath;
            string? cancelPath = _paymentsConfiguration.CrrpaPaymentCancelPath;
            string? errorPath = _paymentsConfiguration.CrrpaPaymentErrorPath;

            try
            {
                PaybcPaymentResult paybcPaymentResult = _mapper.Map<PaybcPaymentResult>(paybcResult);

                if (!paybcPaymentResult.Success && paybcPaymentResult.MessageText == "Payment Canceled")
                {
                    return Redirect($"{hostUrl}{cancelPath}");
                }


                var paymentId = await _mediator.Send(new PaymenCreateCommand(Request.QueryString.ToString(), paybcPaymentResult));
                if (paybcPaymentResult.Success)
                    return Redirect($"{hostUrl}{successPath}{paymentId}");

                return Redirect($"{hostUrl}{failPath}{paymentId}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"ProcessApplicantInvitePaymentResult Payment result processing has errors +{ex}");
                return Redirect($"{hostUrl}{errorPath}");
            }
        }

        /// <summary>
        /// Get the payment result for application and payment
        /// </summary>
        /// <returns></returns>
        [Route("api/crrpa/payments/{paymentId}")]
        [HttpGet]
        public async Task<PaymentResponse> GetApplicantInvitePaymentResult([FromRoute] Guid paymentId)
        {
            return await _mediator.Send(new PaymentQuery(paymentId));
        }

        /// <summary>
        /// Get the payment result for application and payment
        /// </summary>
        /// <returns></returns>
        [Route("api/crrpa/{applicationId}/payment-attempts")]
        [HttpGet]
        public async Task<int> GetApplicantInvitePaymentAttempts([FromRoute] Guid applicationId)
        {
            return await _mediator.Send(new PaymentFailedAttemptCountQuery(applicationId));
        }

        /// <summary>
        /// download the receipt for successful payment
        /// </summary>
        /// <param name="paymentId"></param>
        /// <returns>FileStreamResult</returns>
        [Route("api/crrpa/{applicationId}/payment-receipt")]
        [HttpGet]
        public async Task<FileStreamResult> ApplicantInviteDownloadReceiptAsync([FromRoute] Guid applicationId)
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
        [Route("api/crrpa/{applicationId}/manual-payment-form")]
        [HttpGet]
        public async Task<FileStreamResult> ApplicantInviteManualPaymentFormAsync([FromRoute] Guid applicationId)
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
        /// sample:http://localhost:5114/api/crrpa/payment-secure-link?encodedAppId=CfDJ8MELGoA6ZCBIuDpjih7jnJo3inVYsL3UPdbgBResn9qAoHpjCIIEmMJyuO_oHKEWLi-SA3qmmMJ_yqvl4myfXutYpPB75aOz7Wi49jjp1wHD9J56kmaOvJ3bhJuGl5hjbXybqO1TLXA0KsKO8Qr5IKLF7jK2WDpTn3hYj_U9YQ1g
        /// <returns></returns>
        [Route("api/crrpa/payment-secure-link")]
        [HttpGet]
        public async Task<ActionResult> CreateLinkRedirectToPaybcPaymentPage([FromQuery] string encodedAppId, [FromQuery] string encodedPaymentId)
        {
            string? errorPath = _paymentsConfiguration.CrrpaPaymentErrorPath;
            string? hostUrl = _configuration.GetValue<string>("HostUrl");
            try
            {
                string redirectUrl = $"{hostUrl}api/crrpa/payment-result";
                PaymentLinkFromSecureLinkCreateRequest linkCreateRequest = new()
                {
                    ApplicationId = null,
                    EncodedApplicationId = encodedAppId,
                    EncodedPaymentId = encodedPaymentId,
                    Description = "Criminal Record Check",
                    PaymentMethod = PaymentMethodCode.CreditCard
                };
                var result = await _mediator.Send(new PaymentLinkCreateCommand(linkCreateRequest, redirectUrl, _paymentsConfiguration.MaxOnlinePaymentFailedTimes));
                return Redirect(result.PaymentLinkUrl);
            }
            catch (Exception ex)
            {
                _logger.LogError($"CreateLinkRedirectToPaybcPaymentPage has errors +{ex}");
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