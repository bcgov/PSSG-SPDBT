using Flurl;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Net.Http.Json;
using System.Text.Json;

namespace Spd.Utilities.Address;

public class AddressAutocompleteClient : IAddressAutocompleteClient
{
    private readonly string _apiKey;
    private readonly int _maxSuggestions;
    private readonly HttpClient _client;
    private ILogger _logger { get; }

    public AddressAutocompleteClient(
        HttpClient httpClient,
        ILogger<AddressAutocompleteClient> logger,
        IOptions<AddressAutoCompleteClientConfigurations> config)
    {
        _apiKey = config.Value.ApiKey;
        _maxSuggestions = config.Value.MaxSuggestions;
        _client = httpClient;
        _logger = logger;
    }

    public async Task<IEnumerable<AddressAutocompleteFindResponse>> Find(string searchTerm, CancellationToken cancellationToken)
    {
        try
        {
            string url = "Find/v2.10/json3ex.ws";
            var queryValues = new
            {
                // See documentation for all available fields
                Key = _apiKey,
                SearchTerm = searchTerm,
                MaxSuggestions = _maxSuggestions
            };
            using var request = new HttpRequestMessage(HttpMethod.Get, url.SetQueryParams(queryValues, NullValueHandling.Remove))
            {
                Content = null
            };
            using var response = await _client.SendAsync(request, cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                var responseMessage = response.Content != null
                    ? await response.Content.ReadAsStringAsync(cancellationToken)
                    : "";

                _logger.LogWarning($"Did not receive a successful status code. {response.StatusCode}, {responseMessage}");
                return null;
            }

            if (response.Content == null)
            {
                _logger.LogWarning("Response content was null");
                return null;
            }

            var deserializationResult = await response.Content.ReadFromJsonAsync<AddressAutocompleteApiResponse<AddressAutocompleteFindResponse>>(cancellationToken: cancellationToken);
            if (deserializationResult == null)
            {
                _logger.LogWarning("Response content was null");
                return null;
            }

            return deserializationResult.Items ?? Enumerable.Empty<AddressAutocompleteFindResponse>();
        }
        catch (Exception exception)
        {
            _logger.LogWarning(exception.Message);
            return null;
        }
    }

    //public async Task<IEnumerable<AddressAutocompleteRetrieveResponse>> Retrieve(string id)
    //{
    //    var result = await this.GetWithQueryParamsAsync<AddressAutocompleteApiResponse<AddressAutocompleteRetrieveResponse>>("Retrieve/v2.11/json3ex.ws", new
    //    {
    //        // See documentation for all available fields
    //        Key = this.apiKey,
    //        Id = id,
    //    });

    //    if (!result.IsSuccess)
    //    {
    //        // this.Logger.LogError($"Error when retrieving AddressAutocompleteRetrieveResponse results for Id = {id}. {message}");
    //        return Enumerable.Empty<AddressAutocompleteRetrieveResponse>();
    //    }

    //    return result.Value.Items ?? Enumerable.Empty<AddressAutocompleteRetrieveResponse>();
    //}
}
