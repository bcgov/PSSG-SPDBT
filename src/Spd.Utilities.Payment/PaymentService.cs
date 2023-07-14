using Microsoft.Extensions.Options;
using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace Spd.Utilities.Payment
{
    internal class PaymentService : IPaymentService
    {
        private readonly PayBCSettings _config;

        public PaymentService(IOptions<PayBCSettings> config)
        {
            _config = config.Value;
        }
        public PaymentResult HandleCommand(PaymentCommand cmd)
        {
            return cmd switch
            {
                CreateDirectPaymentLinkCommand c => CreateDirectPaymentLink(c),
                ValidatePaymentResultStrCommand c => ValidatePaymentResultStr(c),
                _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
            };
        }

        public CreateDirectPaymentLinkResult CreateDirectPaymentLink(CreateDirectPaymentLinkCommand command)
        {
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
            string? ref1 = HttpUtility.HtmlEncode(command.Ref1);
            string? ref2 = HttpUtility.HtmlEncode(command.Ref2);
            string? ref3 = HttpUtility.HtmlEncode(command.Ref3);
            string apikey = _config.APIKey;

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
            uriBuilder.Host = _config.Host;
            uriBuilder.Path = _config.Path;
            uriBuilder.Query = query;

            return new CreateDirectPaymentLinkResult
            {
                PaymentLinkUrl = uriBuilder.Uri.ToString(),
            };
        }

        public ValidationResult ValidatePaymentResultStr(ValidatePaymentResultStrCommand command)
        {
            string apikey = _config.APIKey;
            string queryStr = command.QueryStr;
            string[] queries = queryStr.Split("&");
            string hashvalueStr = queries.FirstOrDefault(q => q.StartsWith("hashValue="));
            if (hashvalueStr == null)
            {
                return new ValidationResult() { ValidationPassed = false };
            }
            string expectedHashValue = hashvalueStr.Split("=").Last();
            int pos = queryStr.LastIndexOf(hashvalueStr);
            string query = queryStr.Substring(1, pos-2);
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
            return new ValidationResult() { ValidationPassed = calculatedHash.Equals(expectedHashValue) };
        }
    }
}
