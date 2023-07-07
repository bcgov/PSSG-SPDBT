using MediatR;
using Microsoft.AspNetCore.Mvc;
using Spd.Utilities.Recaptcha;
using Spd.Utilities.Shared;
using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography;
using System.Security.Principal;
using System.Text;

namespace Spd.Presentation.Screening.Controllers
{
    public class PaymentController : SpdControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IPrincipal _currentUser;
        private readonly IRecaptchaVerificationService _verificationService;

        public PaymentController(IMediator mediator, IPrincipal currentUser, IRecaptchaVerificationService verificationService)
        {
            _mediator = mediator;
            _currentUser = currentUser;
            _verificationService = verificationService;
        }

        /// <summary>
        /// Return the direct pay payment link 
        /// </summary>
        /// <param name="paymentLinkCreateRequest">which include Payment link create request</param>
        /// <returns></returns>
        [Route("api/payments/link")]
        [HttpPost]
        public async Task<PaymentLinkResponse> GetPaymentLink([FromBody][Required] PaymentLinkCreateRequest paymentLinkCreateRequest)
        {
            string trnDate = DateOnly.FromDateTime(DateTime.Now).ToString("yyyy-MM-dd");
            string pbcRefNumber = "10015";

            string glDate;
            if (DateTime.Now.Hour > 16)
                glDate = DateOnly.FromDateTime(DateTime.Now.AddDays(1)).ToString("yyyy-MM-dd");
            else
                glDate = trnDate;

            string description = paymentLinkCreateRequest.Description;
            string trnNumber = Guid.NewGuid().ToString();
            string trnAmount = paymentLinkCreateRequest.Amount.ToString();
            string paymentMethod = paymentLinkCreateRequest.PaymentMethod;
            string redirectUrl = paymentLinkCreateRequest.RedirectUrl;
            string currency = "CAD";
            string revenue = "1:039.18ACE.14691.8928.1800000.000000.0000:25.00|2:039.18ACE.14692.8928.1800000.000000.0000:25.27";
            string? ref1 = paymentLinkCreateRequest.Ref1;
            string? ref2 = paymentLinkCreateRequest.Ref2;
            string? ref3 = paymentLinkCreateRequest.Ref3;
            string apikey = "MXJW7MUJSYA39LXN3WXPDZ1SCUJ19MEX";

            string query = $"trnDate={trnDate}&pbcRefNumber={pbcRefNumber}&glDate={glDate}&description={description}&trnNumber={trnNumber}&trnAmount={trnAmount}&paymentMethod={paymentMethod}&currency={currency}&redirectUri={redirectUrl}&revenue={revenue}&ref1={ref1}&ref2={ref2}&ref3={ref3}";
            StringBuilder sb = new StringBuilder();
            string hashValue;
            using (MD5 md5 = MD5.Create())
            {
                string str = $"{query}{apikey}";
                byte[] hash = md5.ComputeHash(Encoding.UTF8.GetBytes(str));
                // Convert the byte array to string format
                foreach (byte b in hash)
                {
                    sb.Append($"{b:x2}");
                }
            }
            hashValue = sb.ToString();
             
            query = query + $"&hashValue={hashValue}";

            UriBuilder uriBuilder = new UriBuilder();
            uriBuilder.Scheme = "https";
            uriBuilder.Host = "paydev.gov.bc.ca";
            uriBuilder.Path = "public/directsale";
            uriBuilder.Query = query;

            return new PaymentLinkResponse
            {
                PaymentLinkUrl = uriBuilder.Uri.ToString(),
            };
        }

    }

    public record PaymentLinkCreateRequest
    {
        [MaxLength(100)]
        public string Description { get; set; }
        public string PaymentMethod { get; set; } //CC-credit card, VI - debit card
        public decimal Amount { get; set; }
        public string RedirectUrl { get; set; }
        public string? Ref1 { get; set; } //caseId
        public string? Ref2 { get; set; }
        public string? Ref3 { get; set; }
    }

    public record PaymentLinkResponse
    {
        public string PaymentLinkUrl { get; set; }
    }
}







