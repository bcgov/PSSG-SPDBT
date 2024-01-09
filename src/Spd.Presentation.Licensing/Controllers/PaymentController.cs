﻿using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Common.ManagerContract;
using Spd.Manager.Common.Payment;
using Spd.Presentation.Licensing.Configurations;
using Spd.Utilities.Shared;
using System.ComponentModel.DataAnnotations;
using System.Configuration;

namespace Spd.Presentation.Licensing.Controllers
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

        #region unauth-applicant-payment
        /// <summary>
        /// Return the direct pay payment link 
        /// </summary>
        /// <param name="ApplicantPaymentLinkCreateRequest">which include Payment link create request</param>
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
        [Route("api/unauth-licence/payments/{paymentId}")]
        [HttpGet]
        public async Task<PaymentResponse> GetLicencePaymentResult([FromRoute] Guid paymentId)
        {
            return await _mediator.Send(new PaymentQuery(paymentId));
        }

        /// <summary>
        /// Get the payment result for application and payment
        /// </summary>
        /// <returns></returns>
        [Route("api/unauth-licence/{applicationId}/payment-attempts")]
        [HttpGet]
        public async Task<int> GetApplicantFailedPaymentAttempts([FromRoute] Guid applicationId)
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