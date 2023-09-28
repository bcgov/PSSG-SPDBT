using Microsoft.Extensions.Logging;
using Spd.Utilities.Payment.TokenProviders;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Spd.Utilities.Payment
{
    internal partial class PaymentService : IPaymentService
    {
        public async Task<InvoiceResult> CreateInvoiceAsync(CreateInvoiceCmd cmd)
        {
            _logger.LogInformation("PaymentService get CreateInvoiceCmd");
            if (_config?.ARInvoice?.InvoicePath == null || _config?.ARInvoice?.AuthenticationSettings == null)
                throw new ConfigurationErrorsException("Payment AR Invoice Configuration is not correct.");
            ISecurityTokenProvider tokenProvider = _tokenProviderResolver.GetTokenProviderByName("BearerTokenProvider");
            string accessToken = await tokenProvider.AcquireToken();
            if (string.IsNullOrWhiteSpace(accessToken))
                throw new InvalidOperationException("cannot get access token from paybc");

            HttpClient requestHttpClient = new HttpClient();
            requestHttpClient.DefaultRequestHeaders.Clear();
            requestHttpClient.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
            requestHttpClient.DefaultRequestHeaders.TryAddWithoutValidation("Content-Type", "application/json");
            requestHttpClient.DefaultRequestHeaders.Add("Authorization", "Bearer " + accessToken);

            string url = $"https://{_config.ARInvoice.Host}/{_config.ARInvoice.InvoicePath}/parties/{cmd.PartyNumber}/accs/{cmd.AccountNumber}/sites/{cmd.SiteNumber}/invs/";
            var serializeOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true
            };

            var payload = _mapper.Map<CreateInvoiceRequest>(cmd);

            string jsonContent = JsonSerializer.Serialize(payload, serializeOptions);
            byte[] bytes = Encoding.UTF8.GetBytes(jsonContent);
            var content = new ByteArrayContent(bytes);
            content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json");
            var requestResponse = await requestHttpClient.PostAsync(url,
                content);
            if (requestResponse.IsSuccessStatusCode)
            {
                var resp = await requestResponse.Content.ReadFromJsonAsync<CreateInvoiceResp>();
                var result = _mapper.Map<InvoiceResult>(resp);
                result.IsSuccess = true;
                result.Message = await requestResponse.Content.ReadAsStringAsync();
                return result;
            }
            else
            {
                string errorMsg = null;
                if (requestResponse.StatusCode == HttpStatusCode.NotFound) 
                {
                    errorMsg = $"{url} cannot be found.";
                }
                else
                {
                    IEnumerable<string> values;
                    if(requestResponse.Headers.TryGetValues("CAS-Returned-Messages", out values))
                    {
                        errorMsg = string.Join(";", values);
                    }
                }
                var result = new InvoiceResult();
                result.IsSuccess = false;
                result.Message = $"{requestResponse.ReasonPhrase}-{errorMsg}";
                _logger.LogError(result.Message);
                return result;
            }

        }

        public async Task<InvoiceResult> GetInvoiceStatusAsync(InvoiceStatusQuery cmd)
        {
            _logger.LogInformation("PaymentService get InvoiceStatusQuery");
            if (_config?.ARInvoice?.InvoicePath == null || _config?.ARInvoice?.AuthenticationSettings == null)
                throw new ConfigurationErrorsException("Payment AR Invoice Configuration is not correct.");
            ISecurityTokenProvider tokenProvider = _tokenProviderResolver.GetTokenProviderByName("BearerTokenProvider");
            string accessToken = await tokenProvider.AcquireToken();
            if (string.IsNullOrWhiteSpace(accessToken))
                throw new InvalidOperationException("cannot get access token from paybc");

            var client = new HttpClient();
            string url = $"https://{_config.ARInvoice.Host}/{_config.ARInvoice.InvoicePath}/parties/{cmd.PartyNumber}/accs/{cmd.AccountNumber}/sites/{cmd.SiteNumber}/invs/{cmd.InvoiceNumber}/";
            var request = new HttpRequestMessage(HttpMethod.Get, url);
            request.Headers.Add("Authorization", $"Bearer {accessToken}");
            var response = await client.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                var resp = await response.Content.ReadFromJsonAsync<CreateInvoiceResp>();
                var result = _mapper.Map<InvoiceResult>(resp);
                result.IsSuccess = true;
                return result;
            }
            else
            {
                _logger.LogError($"GetInvoiceStatusAsync error {response}");
                var result = new InvoiceResult();
                result.IsSuccess = false;
                return result;
            }
        }
    }

    internal class CreateInvoiceRequest
    {
        [JsonPropertyName("transaction_number")]
        public string TransactionNumber { get; set; }

        [JsonPropertyName("batch_source")]
        public string BatchSource { get; set; }

        [JsonPropertyName("cust_trx_type")]
        public string CustTrxType { get; set; }

        [JsonPropertyName("transaction_date")]
        public DateTimeOffset TransactionDate { get; set; }

        [JsonPropertyName("gl_date")]
        public DateTimeOffset GlDate { get; set; }

        [JsonPropertyName("comments")]
        public string Comments { get; set; }

        [JsonPropertyName("late_charges_flag")]
        public string LateChargesFlag { get; set; }

        [JsonPropertyName("term_name")]
        public string TermName { get; set; }

        [JsonPropertyName("lines")]
        public IEnumerable<Line> Lines { get; set; }
    }

    internal class CreateInvoiceResp
    {
        [JsonPropertyName("invoice_number")]
        public string InvoiceNumber { get; set; }

        [JsonPropertyName("pbc_ref_number")]
        public string PbcRefNumber { get; set; }

        [JsonPropertyName("party_number")]
        public string PartyNumber { get; set; }

        [JsonPropertyName("party_name")]
        public string PartyName { get; set; }

        [JsonPropertyName("account_name")]
        public string AccountName { get; set; }

        [JsonPropertyName("account_number")]
        public string AccountNumber { get; set; }

        [JsonPropertyName("customer_site_id")]
        public string CustomerSiteId { get; set; }

        [JsonPropertyName("site_number")]
        public string SiteNumber { get; set; }

        [JsonPropertyName("cust_trx_type")]
        public string CustTrxType { get; set; }

        [JsonPropertyName("transaction_date")]
        public DateTimeOffset TransactionDate { get; set; }

        [JsonPropertyName("batch_source")]
        public string BatchSource { get; set; }

        [JsonPropertyName("term_name")]
        public string TermName { get; set; }

        [JsonPropertyName("term_due_date")]
        public DateTimeOffset TermDueDate { get; set; }

        [JsonPropertyName("comments")]
        public string Comments { get; set; }

        [JsonPropertyName("late_charges_flag")]
        public object LateChargesFlag { get; set; }

        [JsonPropertyName("total")]
        public double Total { get; set; }

        [JsonPropertyName("amount_due")]
        public double AmountDue { get; set; }

        [JsonPropertyName("amount_adjusted")]
        public object AmountAdjusted { get; set; }

        [JsonPropertyName("amount_adjusted_pending")]
        public object AmountAdjustedPending { get; set; }

        [JsonPropertyName("status")]
        public string Status { get; set; }

        [JsonPropertyName("provider")]
        public string Provider { get; set; }

        [JsonPropertyName("lines")]
        public Line[] Lines { get; set; }

        [JsonPropertyName("receipts")]
        public Receipt[] Receipts { get; set; }

        [JsonPropertyName("links")]
        public Link[] Links { get; set; }
    }

    internal class Line
    {
        [JsonPropertyName("line_number")]
        public int LineNumber { get; set; }

        [JsonPropertyName("line_type")]
        public string LineType { get; set; }

        [JsonPropertyName("memo_line_name")]
        public string MemoLineName { get; set; }

        [JsonPropertyName("description")]
        public string Description { get; set; }

        [JsonPropertyName("unit_price")]
        public decimal UnitPrice { get; set; }

        [JsonPropertyName("quantity")]
        public int Quantity { get; set; }
    }

    internal class Link
    {
        [JsonPropertyName("rel")]
        public string Rel { get; set; }

        [JsonPropertyName("href")]
        public Uri Href { get; set; }
    }

    internal class Receipt
    {
        [JsonPropertyName("links")]
        public Link[] Links { get; set; }
    }
}
