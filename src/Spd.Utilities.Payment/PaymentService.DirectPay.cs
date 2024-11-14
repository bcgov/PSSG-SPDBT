using System.Configuration;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace Spd.Utilities.Payment
{
    internal partial class PaymentService : IPaymentService
    {
        private CreateDirectPaymentLinkResult CreateDirectPaymentLinkAsync(CreateDirectPaymentLinkCommand command)
        {
            if (_config?.DirectPayment?.APIKey == null || _config.DirectPayment?.DirectPayPath == null)
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
#pragma warning disable CA5351 // Do Not Use Broken Cryptographic Algorithms
            string str = $"{query}{apikey}";
            byte[] hash = MD5.HashData(Encoding.UTF8.GetBytes(str));
            // Convert the byte array to string format
            foreach (byte b in hash)
            {
                sb.Append($"{b:x2}");
            }
#pragma warning restore CA5351 // Do Not Use Broken Cryptographic Algorithms
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

        private PaymentValidationResult ValidatePaymentResultStrAsync(ValidatePaymentResultStrCommand command)
        {
            if (_config?.DirectPayment?.APIKey == null || _config.DirectPayment?.DirectPayPath == null)
                throw new ConfigurationErrorsException("Payment Direct Pay Configuration is not correct.");

            string apikey = _config.DirectPayment.APIKey;
            string queryStr = command.QueryStr;
            string[] queries = queryStr.Split("&");
            var hashvalueStr = queries.FirstOrDefault(q => q.StartsWith("hashValue="));
            if (hashvalueStr == null)
            {
                return new PaymentValidationResult() { ValidationPassed = false };
            }
            string expectedHashValue = hashvalueStr.Split("=").Last();
            int pos = queryStr.LastIndexOf(hashvalueStr);
            string query = queryStr.Substring(1, pos - 2);
            StringBuilder sb = new StringBuilder();
            string str = $"{query}{apikey}";
#pragma warning disable CA5351 // Do Not Use Broken Cryptographic Algorithms
            byte[] hash = MD5.HashData(Encoding.UTF8.GetBytes(str));
#pragma warning restore CA5351 // Do Not Use Broken Cryptographic Algorithms
            // Convert the byte array to string format
            foreach (byte b in hash)
            {
                sb.Append($"{b:x2}");
            }
            string calculatedHash = sb.ToString();
            return new PaymentValidationResult() { ValidationPassed = calculatedHash.Equals(expectedHashValue) };
        }
    }
}