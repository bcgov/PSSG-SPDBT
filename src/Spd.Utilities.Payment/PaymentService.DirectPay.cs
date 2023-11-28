using Microsoft.Extensions.Logging;
using System;
using System.Configuration;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Spd.Utilities.Payment
{
    internal partial class PaymentService : IPaymentService
    {
        public async Task<CreateDirectPaymentLinkResult> CreateDirectPaymentLinkAsync(CreateDirectPaymentLinkCommand command)
        {
            _logger.LogInformation("CreateDirectPaymentLinkCommand");
            if (_config?.DirectPayment?.APIKey == null || _config?.DirectPayment?.DirectPayPath == null)
                throw new ConfigurationErrorsException("Payment Direct Pay Configuration is not correct.");

            string trnDate = DateTime.Now.Date.ToString("yyyy-MM-dd");
            string pbcRefNumber = command.PbcRefNumber;

            string glDate;
            if (DateTime.Now.Hour > 16)
                glDate = DateTime.Now.AddDays(1).Date.ToString("yyyy-MM-dd");
            else
                glDate = trnDate;

            string? description = HttpUtility.HtmlEncode(command.Description);
            string trnNumber = command.TransNumber;
            string trnAmount = command.Amount.ToString();
            string paymentMethod = command.PaymentMethod.ToString();
            string redirectUrl = command.RedirectUrl;
            string currency = "CAD";
            string revenue = $"1:{command.RevenueAccount}:{trnAmount}";
            string? ref1 = string.Empty;// HttpUtility.HtmlEncode(command.Ref1); //ref1 is reserved for paybc internal use.
            string? ref2 = HttpUtility.HtmlEncode(command.Ref2);
            string? ref3 = HttpUtility.HtmlEncode(command.Ref3);
            string apikey = _config.DirectPayment.APIKey;

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
            uriBuilder.Host = _config.DirectPayment.Host;
            uriBuilder.Path = _config.DirectPayment.DirectPayPath;
            uriBuilder.Query = query;

            return new CreateDirectPaymentLinkResult
            {
                PaymentLinkUrl = uriBuilder.Uri.ToString(),
            };
        }

        public async Task<PaymentValidationResult> ValidatePaymentResultStrAsync(ValidatePaymentResultStrCommand command)
        {
            _logger.LogInformation("ValidatePaymentResultStrCommand");

            if (_config?.DirectPayment?.APIKey == null || _config?.DirectPayment?.DirectPayPath == null)
                throw new ConfigurationErrorsException("Payment Direct Pay Configuration is not correct.");

            string apikey = _config.DirectPayment.APIKey;
            string queryStr = command.QueryStr;
            string[] queries = queryStr.Split("&");
            string hashvalueStr = queries.FirstOrDefault(q => q.StartsWith("hashValue="));
            if (hashvalueStr == null)
            {
                return new PaymentValidationResult() { ValidationPassed = false };
            }
            string expectedHashValue = hashvalueStr.Split("=").Last();
            int pos = queryStr.LastIndexOf(hashvalueStr);
            string query = queryStr.Substring(1, pos - 2);
            StringBuilder sb = new StringBuilder();
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
            string calculatedHash = sb.ToString();
            return new PaymentValidationResult() { ValidationPassed = calculatedHash.Equals(expectedHashValue) };
        }
    }
}
