namespace Spd.Utilities.Address;

public interface IAddressAutocompleteClient
{
    Task<IEnumerable<AddressQueryResponse>> Query(AddressQuery query, CancellationToken cancellationToken);
}

public abstract record AddressQuery;

/// <summary>
/// Returns addresses matching the search term.
/// </summary>
public record AddressSearchQuery : AddressQuery
{
    public string SearchTerm { get; set; } = null!;
    public string Country { get; set; } = null!;
    public string? LastId { get; set; }
}

/// <summary>
/// Returns the full address details based on the Id.
/// </summary>
public record AddressRetrieveQuery : AddressQuery
{
    public string Id { get; set; } = null!;
}

#pragma warning disable S2094 // Classes should not be empty
public abstract record AddressQueryResponse;
#pragma warning restore S2094 // Classes should not be empty

/// <summary>
/// The response from the web service is a table containing the elements below. Where no items are found, the response will be empty.
/// https://www.canadapost-postescanada.ca/ac/support/api/addresscomplete-interactive-find/
/// </summary>
public record AddressAutocompleteFindResponse : AddressQueryResponse
{
    /// <summary>
    /// The Id to use as the SearchTerm with the Find method.
    /// </summary>
    public string? Id { get; set; }

    /// <summary>
    /// The found item.
    /// </summary>
    public string? Text { get; set; }

    /// <summary>
    /// A series of number pairs that indicates which characters in the Text property have matched the SearchTerm.
    /// </summary>
    public string? Highlight { get; set; }

    /// <summary>
    /// A zero-based position in the Text response indicating the suggested position of the cursor if this item is selected. A -1 response indicates no suggestion is available.
    /// </summary>
    public int? Cursor { get; set; }

    /// <summary>
    /// Descriptive information about the found item, typically if it's a container.
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// The next step of the search process. (Find, Retrieve)
    /// </summary>
    public string? Next { get; set; }
}

/// <summary>
/// The response from the web service is a table containing the elements below. Where no items are found, the response will be empty.
/// https://www.canadapost-postescanada.ca/ac/support/api/addresscomplete-interactive-retrieve/
/// </summary>
public record AddressAutocompleteRetrieveResponse : AddressQueryResponse
{
    public string? Id { get; set; }
    public string? DomesticId { get; set; }
    public string? Language { get; set; }
    public string? LanguageAlternatives { get; set; }
    public string? Department { get; set; }
    public string? Company { get; set; }
    public string? SubBuilding { get; set; }
    public string? BuildingNumber { get; set; }
    public string? BuildingName { get; set; }
    public string? SecondaryStreet { get; set; }
    public string? Street { get; set; }
    public string? Block { get; set; }
    public string? Neighbourhood { get; set; }
    public string? District { get; set; }
    public string? City { get; set; }
    public string? Line1 { get; set; }
    public string? Line2 { get; set; }
    public string? Line3 { get; set; }
    public string? Line4 { get; set; }
    public string? Line5 { get; set; }
    public string? AdminAreaName { get; set; }
    public string? AdminAreaCode { get; set; }
    public string? Province { get; set; }
    public string? ProvinceName { get; set; }
    public string? ProvinceCode { get; set; }
    public string? PostalCode { get; set; }
    public string? CountryName { get; set; }
    public string? CountryIso2 { get; set; }
    public string? CountryIso3 { get; set; }
    public int? CountryIsoNumber { get; set; }
    public string? SortingNumber1 { get; set; }
    public string? SortingNumber2 { get; set; }
    public string? Barcode { get; set; }
    public string? PoBoxNumber { get; set; }
    public string? Label { get; set; }
    public string? DataLevel { get; set; }
}