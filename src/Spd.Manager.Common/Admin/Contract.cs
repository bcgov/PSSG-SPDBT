using MediatR;
using Spd.Manager.Shared;

namespace Spd.Manager.Common.Admin
{
    public interface IAdminManager
    {
        public Task<IEnumerable<AddressFindResponse>> Handle(FindAddressQuery request, CancellationToken cancellationToken);

        public Task<IEnumerable<AddressRetrieveResponse>> Handle(RetrieveAddressByIdQuery request, CancellationToken cancellationToken);

        public Task<string?> Handle(GetBannerMsgQuery request, CancellationToken cancellationToken);

        public Task<string?> Handle(GetReplacementProcessingTimeQuery request, CancellationToken cancellationToken);

        public Task<IEnumerable<MinistryResponse>> Handle(GetMinistryQuery request, CancellationToken cancellationToken);
    }

    public record GetBannerMsgQuery : IRequest<string>;

    public record GetReplacementProcessingTimeQuery : IRequest<string>;

    public record FindAddressQuery(string SearchTerm, string Country = "CAN", string? LastId = null) : IRequest<IEnumerable<AddressFindResponse>>;

    public record RetrieveAddressByIdQuery(string Id) : IRequest<IEnumerable<AddressRetrieveResponse>>;

    public class AddressFindResponse
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

    public class AddressRetrieveResponse
    {
        public string? Id { get; set; }
        public string? Language { get; set; }
        public string? BuildingNumber { get; set; }
        public string? BuildingName { get; set; }
        public string? SecondaryStreet { get; set; }
        public string? City { get; set; }
        public string? Line1 { get; set; }
        public string? Line2 { get; set; }
        public string? Line3 { get; set; }
        public string? Line4 { get; set; }
        public string? Line5 { get; set; }
        public string? Province { get; set; }
        public string? ProvinceName { get; set; }
        public string? ProvinceCode { get; set; }
        public string? PostalCode { get; set; }
        public string? CountryName { get; set; }
        public string? PoBoxNumber { get; set; }
        public string? Label { get; set; }
    }

    public record GetMinistryQuery : IRequest<IEnumerable<MinistryResponse>>;

    public record MinistryResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public bool IsActive { get; set; }
        public IEnumerable<ServiceTypeCode> ServiceTypeCodes { get; set; }
    }
}