using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Web;

namespace Spd.Utilities.Payment
{
    internal class PaymentService : IPaymentService
    {
        private readonly PayBCSettings _config;
        private readonly ISecurityTokenProvider _tokenProvider;

        public PaymentService(IOptions<PayBCSettings> config, HttpClient httpClient, ISecurityTokenProvider tokenProvider)
        {
            _config = config.Value;
            _tokenProvider = tokenProvider;
        }
        public async Task<PaymentResult> HandleCommand(PaymentCommand cmd)
        {
            return cmd switch
            {
                CreateDirectPaymentLinkCommand c => CreateDirectPaymentLink(c),
                ValidatePaymentResultStrCommand c => ValidatePaymentResultStr(c),
                RefundPaymentCmd c => await RefundDirectPayment(c),
                _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
            };
        }

        public CreateDirectPaymentLinkResult CreateDirectPaymentLink(CreateDirectPaymentLinkCommand command)
        {
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
            string? ref1 = HttpUtility.HtmlEncode(command.Ref1);
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

        public PaymentValidationResult ValidatePaymentResultStr(ValidatePaymentResultStrCommand command)
        {
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

        public async Task<RefundPaymentResult> RefundDirectPayment(RefundPaymentCmd command)
        {
            if (_config?.DirectRefund?.AuthenticationSettings == null || _config?.DirectRefund?.DirectRefundPath == null)
                throw new ConfigurationErrorsException("Payment Direct Refund Configuration is not correct.");

            string accessToken = await _tokenProvider.AcquireToken();
            if (string.IsNullOrWhiteSpace(accessToken))
                throw new InvalidOperationException("cannot get access token from paybc");

            HttpClient requestHttpClient = new HttpClient();
            requestHttpClient.DefaultRequestHeaders.Clear();
            requestHttpClient.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
            requestHttpClient.DefaultRequestHeaders.TryAddWithoutValidation("Content-Type", "application/json");
            requestHttpClient.DefaultRequestHeaders.Add("Bearer-Token", "Bearer " + accessToken);

            string url = $"https://{_config.DirectRefund.Host}/{_config.DirectRefund.DirectRefundPath}";
            var serializeOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true
            };
            string jsonContent = JsonSerializer.Serialize(command, serializeOptions);
            byte[] bytes = Encoding.UTF8.GetBytes(jsonContent);
            var content = new ByteArrayContent(bytes);
            content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json");
            var requestResponse = await requestHttpClient.PostAsync(url,
                content);
            if (requestResponse.IsSuccessStatusCode)
            {
                var resp = await requestResponse.Content.ReadFromJsonAsync<PaybcPaymentRefundSuccessResponse>();
                return new RefundPaymentResult
                {
                    IsSuccess = true,
                    Message = resp.Message,
                    Approved = resp.Approved == 1 ? true : false,
                    OrderNumber = resp.OrderNumber,
                    RefundId = resp.Id,
                    RefundTxnDateTime = DateTimeOffset.Parse(resp.created),
                    TxnAmount = resp.Amount,
                    TxnNumber = resp.TxnNumber
                };
            }
            else
            {
                var resp = await requestResponse.Content.ReadFromJsonAsync<PaybcPaymentErrorResponse>();
                return new RefundPaymentResult
                {
                    IsSuccess = false,
                    Message = $"{requestResponse.StatusCode.ToString()}:{resp.Message}-{String.Join(";", resp.Errors)}"
                };
            }
        }
    }

    internal class PaybcPaymentRefundSuccessResponse
    {
        public string Id { get; set; }
        public int Approved { get; set; }
        public string? Message { get; set; }
        public string? created { get; set; }
        public string? OrderNumber { get; set; }
        public string? TxnNumber { get; set; }
        public decimal Amount { get; set; }
    }

    internal class PaybcPaymentErrorResponse
    {
        public string Message { get; set; }
        public IEnumerable<string> Errors { get; set; }
    }
}
