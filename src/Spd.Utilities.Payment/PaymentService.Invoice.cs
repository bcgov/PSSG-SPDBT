using Microsoft.Extensions.Logging;
using Spd.Utilities.Payment.TokenProviders;
using System.Configuration;
using System.Net;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Spd.Utilities.Payment
{
    internal partial class PaymentService : IPaymentService
    {
        private async Task<InvoiceResult> CreateInvoiceAsync(CreateInvoiceCmd cmd, CancellationToken ct)
        {
            if (_config?.ARInvoice?.InvoicePath == null || _config.ARInvoice?.AuthenticationSettings == null)
                throw new ConfigurationErrorsException("Payment AR Invoice Configuration is not correct.");
            ISecurityTokenProvider tokenProvider = tokenProviderResolver.GetTokenProviderByName("BearerTokenProvider");
            string accessToken = await tokenProvider.AcquireToken(ct);
            if (string.IsNullOrWhiteSpace(accessToken))
                throw new InvalidOperationException("cannot get access token from paybc");

            using var requestHttpClient = httpClientFactory.CreateClient();
            requestHttpClient.DefaultRequestHeaders.Clear();
            requestHttpClient.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
            requestHttpClient.DefaultRequestHeaders.TryAddWithoutValidation("Content-Type", "application/json");
            requestHttpClient.DefaultRequestHeaders.Add("Authorization", "Bearer " + accessToken);

            var url = new Uri($"https://{_config.ARInvoice.Host}/{_config.ARInvoice.InvoicePath}/parties/{cmd.PartyNumber}/accs/{cmd.AccountNumber}/sites/{cmd.SiteNumber}/invs/");

            var payload = mapper.Map<CreateInvoiceRequest>(cmd);

            string jsonContent = JsonSerializer.Serialize(payload, serializeOptions);
            byte[] bytes = Encoding.UTF8.GetBytes(jsonContent);
            using var content = new ByteArrayContent(bytes);
            content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json");
            var requestResponse = await requestHttpClient.PostAsync(url, content, ct);
            if (requestResponse.IsSuccessStatusCode)
            {
                var resp = await requestResponse.Content.ReadFromJsonAsync<CreateInvoiceResp>(ct);
                var result = mapper.Map<InvoiceResult>(resp);
                result.IsSuccess = true;
                result.Message = await requestResponse.Content.ReadAsStringAsync(ct);
                return result;
            }
            else
            {
                string errorMsg = string.Empty;
                if (requestResponse.StatusCode == HttpStatusCode.NotFound)
                {
                    errorMsg = $"{url} cannot be found.";
                }
                else
                {
                    if (requestResponse.Headers.TryGetValues("CAS-Returned-Messages", out var values))
                    {
                        errorMsg = string.Join(";", values);
                    }
                }
                var result = new InvoiceResult();
                result.IsSuccess = false;
                result.Message = $"{requestResponse.ReasonPhrase}-{errorMsg}";
                logger.LogError("{Error}", result.Message);
                return result;
            }
        }

        private async Task<InvoiceResult> GetInvoiceStatusAsync(InvoiceStatusQuery cmd, CancellationToken ct)
        {
            logger.LogInformation("PaymentService get InvoiceStatusQuery");
            if (_config?.ARInvoice?.InvoicePath == null || _config.ARInvoice?.AuthenticationSettings == null)
                throw new ConfigurationErrorsException("Payment AR Invoice Configuration is not correct.");
            ISecurityTokenProvider tokenProvider = tokenProviderResolver.GetTokenProviderByName("BearerTokenProvider");
            string accessToken = await tokenProvider.AcquireToken(ct);
            if (string.IsNullOrWhiteSpace(accessToken))
                throw new InvalidOperationException("cannot get access token from paybc");

            using var client = httpClientFactory.CreateClient();
            var url = new Uri($"https://{_config.ARInvoice.Host}/{_config.ARInvoice.InvoicePath}/parties/{cmd.PartyNumber}/accs/{cmd.AccountNumber}/sites/{cmd.SiteNumber}/invs/{cmd.InvoiceNumber}/");
            using var request = new HttpRequestMessage(HttpMethod.Get, url);
            request.Headers.Add("Authorization", $"Bearer {accessToken}");
            var response = await client.SendAsync(request, ct);
            if (response.IsSuccessStatusCode)
            {
                var resp = await response.Content.ReadFromJsonAsync<CreateInvoiceResp>(ct);
                var result = mapper.Map<InvoiceResult>(resp);
                result.IsSuccess = true;
                return result;
            }
            else
            {
                logger.LogError("GetInvoiceStatusAsync error: {Response}", response);
                var result = new InvoiceResult();
                result.IsSuccess = false;
                return result;
            }
        }
    }

    internal class CreateInvoiceRequest
    {
        [JsonPropertyName("transaction_number")]
        public string TransactionNumber { get; set; } = null!;

        [JsonPropertyName("batch_source")]
        public string BatchSource { get; set; } = null!;

        [JsonPropertyName("cust_trx_type")]
        public string CustTrxType { get; set; } = null!;

        [JsonPropertyName("transaction_date")]
        public DateTimeOffset TransactionDate { get; set; }

        [JsonPropertyName("gl_date")]
        public DateTimeOffset GlDate { get; set; }

        [JsonPropertyName("comments")]
        public string Comments { get; set; } = null!;

        [JsonPropertyName("late_charges_flag")]
        public string LateChargesFlag { get; set; } = null!;

        [JsonPropertyName("term_name")]
        public string TermName { get; set; } = null!;

        [JsonPropertyName("lines")]
        public IEnumerable<Line> Lines { get; set; } = [];
    }

    internal class CreateInvoiceResp
    {
        [JsonPropertyName("invoice_number")]
        public string InvoiceNumber { get; set; } = null!;

        [JsonPropertyName("pbc_ref_number")]
        public string PbcRefNumber { get; set; } = null!;

        [JsonPropertyName("party_number")]
        public string PartyNumber { get; set; } = null!;

        [JsonPropertyName("party_name")]
        public string PartyName { get; set; } = null!;

        [JsonPropertyName("account_name")]
        public string AccountName { get; set; } = null!;

        [JsonPropertyName("account_number")]
        public string AccountNumber { get; set; } = null!;

        [JsonPropertyName("customer_site_id")]
        public string CustomerSiteId { get; set; } = null!;

        [JsonPropertyName("site_number")]
        public string SiteNumber { get; set; } = null!;

        [JsonPropertyName("cust_trx_type")]
        public string CustTrxType { get; set; } = null!;

        [JsonPropertyName("transaction_date")]
        public DateTimeOffset TransactionDate { get; set; }

        [JsonPropertyName("batch_source")]
        public string BatchSource { get; set; } = null!;

        [JsonPropertyName("term_name")]
        public string TermName { get; set; } = null!;

        [JsonPropertyName("term_due_date")]
        public DateTimeOffset TermDueDate { get; set; }

        [JsonPropertyName("comments")]
        public string Comments { get; set; } = null!;

        [JsonPropertyName("late_charges_flag")]
        public object LateChargesFlag { get; set; } = null!;

        [JsonPropertyName("total")]
        public double Total { get; set; }

        [JsonPropertyName("amount_due")]
        public double AmountDue { get; set; }

        [JsonPropertyName("amount_adjusted")]
        public object AmountAdjusted { get; set; } = null!;

        [JsonPropertyName("amount_adjusted_pending")]
        public object AmountAdjustedPending { get; set; } = null!;

        [JsonPropertyName("status")]
        public string Status { get; set; } = null!;

        [JsonPropertyName("provider")]
        public string Provider { get; set; } = null!;

        [JsonPropertyName("lines")]
        public Line[] Lines { get; set; } = [];

        [JsonPropertyName("receipts")]
        public Receipt[] Receipts { get; set; } = [];

        [JsonPropertyName("links")]
        public Link[] Links { get; set; } = [];
    }

    internal class Line
    {
        [JsonPropertyName("line_number")]
        public int LineNumber { get; set; }

        [JsonPropertyName("line_type")]
        public string LineType { get; set; } = null!;

        [JsonPropertyName("memo_line_name")]
        public string MemoLineName { get; set; } = null!;

        [JsonPropertyName("description")]
        public string Description { get; set; } = null!;

        [JsonPropertyName("unit_price")]
        public decimal UnitPrice { get; set; }

        [JsonPropertyName("quantity")]
        public int Quantity { get; set; }
    }

    internal class Link
    {
        [JsonPropertyName("rel")]
        public string Rel { get; set; } = null!;

        [JsonPropertyName("href")]
        public Uri Href { get; set; } = null!;
    }

    internal class Receipt
    {
        [JsonPropertyName("links")]
        public Link[] Links { get; set; } = [];
    }
}