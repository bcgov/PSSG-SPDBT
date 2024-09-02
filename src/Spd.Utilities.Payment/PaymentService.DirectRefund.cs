using Microsoft.Extensions.Logging;
using System.Configuration;
using System.Globalization;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;

namespace Spd.Utilities.Payment
{
    internal partial class PaymentService : IPaymentService
    {
        private static readonly JsonSerializerOptions serializeOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = true
        };

        private async Task<RefundPaymentResult> RefundDirectPaymentAsync(RefundPaymentCmd command, CancellationToken ct)
        {
            try
            {
                if (_config?.DirectRefund?.AuthenticationSettings == null || _config.DirectRefund?.DirectRefundPath == null)
                    throw new ConfigurationErrorsException("Payment Direct Refund Configuration is not correct.");
                var tokenProvider = tokenProviderResolver.GetTokenProviderByName("BasicTokenProvider");
                string accessToken = await tokenProvider.AcquireToken(ct);
                if (string.IsNullOrWhiteSpace(accessToken))
                    throw new InvalidOperationException("cannot get access token from paybc");

                using HttpClient requestHttpClient = httpClientFactory.CreateClient();
                requestHttpClient.DefaultRequestHeaders.Clear();
                requestHttpClient.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
                requestHttpClient.DefaultRequestHeaders.TryAddWithoutValidation("Content-Type", "application/json");
                requestHttpClient.DefaultRequestHeaders.Add("Bearer-Token", "Bearer " + accessToken);

                var url = new Uri($"https://{_config.DirectRefund.Host}/{_config.DirectRefund.DirectRefundPath}");

                string jsonContent = JsonSerializer.Serialize(command, serializeOptions);
                byte[] bytes = Encoding.UTF8.GetBytes(jsonContent);
                using var content = new ByteArrayContent(bytes);
                content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json");
                var requestResponse = await requestHttpClient.PostAsync(url, content, ct);
                if (requestResponse.IsSuccessStatusCode)
                {
                    var resp = await requestResponse.Content.ReadFromJsonAsync<PaybcPaymentRefundSuccessResponse>(ct);
                    if (resp == null) throw new InvalidOperationException("Failed to read response payload from PayBC");
                    return new RefundPaymentResult
                    {
                        IsSuccess = true,
                        Message = resp.Message ?? string.Empty,
                        Approved = resp.Approved == 1,
                        OrderNumber = resp.OrderNumber ?? string.Empty,
                        RefundId = resp.Id,
                        RefundTxnDateTime = DateTimeOffset.Parse(resp.created ?? string.Empty, CultureInfo.InvariantCulture),
                        TxnAmount = resp.Amount,
                        TxnNumber = resp.TxnNumber ?? string.Empty
                    };
                }
                else
                {
                    var resp = await requestResponse.Content.ReadFromJsonAsync<PaybcPaymentErrorResponse>(ct);
                    return new RefundPaymentResult
                    {
                        IsSuccess = false,
                        Message = $"{requestResponse.StatusCode.ToString()}:{resp?.Message}-{String.Join(";", resp?.Errors ?? [])}"
                    };
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error when trying to refund {OrderNumber}", command.OrderNumber);
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
        public string Id { get; set; } = null!;
        public int Approved { get; set; }
        public string? Message { get; set; }
        public string? created { get; set; }
        public string? OrderNumber { get; set; }
        public string? TxnNumber { get; set; }
        public decimal Amount { get; set; }
    }

    internal class PaybcPaymentErrorResponse
    {
        public string Message { get; set; } = string.Empty;
        public IEnumerable<string> Errors { get; set; } = [];
    }
}