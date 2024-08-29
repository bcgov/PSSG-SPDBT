using Flurl;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Net.Http.Json;

namespace Spd.Utilities.Address;

internal class AddressAutocompleteClient : IAddressAutocompleteClient
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

    public async Task<IEnumerable<AddressQueryResponse>> Query(AddressQuery query, CancellationToken cancellationToken)
    {
        if (query is AddressSearchQuery searchQuery)
        {
            return await Find(searchQuery.SearchTerm, searchQuery.Country, searchQuery.LastId, cancellationToken);
        }

        if (query is AddressRetrieveQuery retrieveQuery)
        {
            return await Retrieve(retrieveQuery.Id, cancellationToken);
        }

        return [];
    }

    ///// Returns addresses matching the search term.
    ///// https://www.canadapost-postescanada.ca/ac/support/api/addresscomplete-interactive-find/
    private async Task<IEnumerable<AddressAutocompleteFindResponse>> Find(string searchTerm, string country, string? lastId, CancellationToken cancellationToken)
    {
        try
        {
            string url = "Find/v2.10/json3ex.ws";
            var queryValues = new
            {
                Key = _apiKey,
                SearchTerm = searchTerm,
                MaxSuggestions = _maxSuggestions,
                Country = country,
                LastId = lastId,
            };
            using var request = new HttpRequestMessage(HttpMethod.Get, url.SetQueryParams(queryValues, NullValueHandling.Remove));
            using var response = await _client.SendAsync(request, cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                var responseMessage = response.Content != null
                    ? await response.Content.ReadAsStringAsync(cancellationToken)
                    : "";

                _logger.LogWarning("Did not receive a successful status code. {StatusCode}, {Message}", response.StatusCode, responseMessage);
                return Enumerable.Empty<AddressAutocompleteFindResponse>();
            }

            if (response.Content == null)
            {
                _logger.LogInformation("Response content was null");
                return Enumerable.Empty<AddressAutocompleteFindResponse>();
            }

            var deserializationResult = await response.Content.ReadFromJsonAsync<AddressAutocompleteApiResponse<AddressAutocompleteFindResponse>>(cancellationToken: cancellationToken);
            return deserializationResult?.Items ?? Enumerable.Empty<AddressAutocompleteFindResponse>();
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "Error in Find: {Message}", exception.Message);
            throw;
        }
    }

    ///// Returns the full address details based on the Id.
    ///// https://www.canadapost-postescanada.ca/ac/support/api/addresscomplete-interactive-retrieve/
    private async Task<IEnumerable<AddressAutocompleteRetrieveResponse>> Retrieve(string id, CancellationToken cancellationToken)
    {
        try
        {
            string url = "Retrieve/v2.11/json3ex.ws";
            var queryValues = new
            {
                Key = _apiKey,
                Id = id
            };
            using var request = new HttpRequestMessage(HttpMethod.Get, url.SetQueryParams(queryValues, NullValueHandling.Remove));

            using var response = await _client.SendAsync(request, cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                var responseMessage = response.Content != null
                    ? await response.Content.ReadAsStringAsync(cancellationToken)
                    : "";

                _logger.LogWarning("Did not receive a successful status code. {StatusCode}, {Message}", response.StatusCode, responseMessage);
                return Enumerable.Empty<AddressAutocompleteRetrieveResponse>();
            }

            if (response.Content == null)
            {
                _logger.LogInformation("Response content was null");
                return Enumerable.Empty<AddressAutocompleteRetrieveResponse>();
            }

            var deserializationResult = await response.Content.ReadFromJsonAsync<AddressAutocompleteApiResponse<AddressAutocompleteRetrieveResponse>>(cancellationToken: cancellationToken);
            return deserializationResult?.Items ?? Enumerable.Empty<AddressAutocompleteRetrieveResponse>();
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "Error in Retrieve: {Message}", exception.Message);
            throw;
        }
    }

    /// <summary>
    /// The response wrapper for the web service that contains result items.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class AddressAutocompleteApiResponse<T>
    {
        public IEnumerable<T>? Items { get; set; }
    }
}