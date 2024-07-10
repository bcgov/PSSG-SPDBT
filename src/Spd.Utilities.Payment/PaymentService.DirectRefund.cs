using Microsoft.Extensions.Logging;
using Spd.Utilities.Payment.TokenProviders;
using System.Configuration;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;

namespace Spd.Utilities.Payment
{
    internal partial class PaymentService : IPaymentService
    {
        public async Task<RefundPaymentResult> RefundDirectPaymentAsync(RefundPaymentCmd command)
        {
            _logger.LogInformation("PaymentService get RefundPaymentCmd");

            try
            {
                if (_config?.DirectRefund?.AuthenticationSettings == null || _config?.DirectRefund?.DirectRefundPath == null)
                    throw new ConfigurationErrorsException("Payment Direct Refund Configuration is not correct.");
                ISecurityTokenProvider tokenProvider = _tokenProviderResolver.GetTokenProviderByName("BasicTokenProvider");
                string accessToken = await tokenProvider.AcquireToken();
                if (string.IsNullOrWhiteSpace(accessToken))
                    throw new InvalidOperationException("cannot get access token from paybc");

                HttpClient requestHttpClient = new();
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
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message, null);
                return new RefundPaymentResult
                {
                    IsSuccess = false,
                    Approved = false,
                    Message = ex.Message
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
