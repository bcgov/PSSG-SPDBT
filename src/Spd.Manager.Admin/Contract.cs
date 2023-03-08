using MediatR;

namespace Spd.Manager.Admin
{
    public interface IAdminManager
    {
        public Task<IEnumerable<AddressFindResponse>> Handle(FindAddressQuery request, CancellationToken cancellationToken);
        public Task<IEnumerable<AddressRetrieveResponse>> Handle(RetrieveAddressByIdQuery request, CancellationToken cancellationToken);
    }

    public record FindAddressQuery(string SearchTerm) : IRequest<IEnumerable<AddressFindResponse>>;

    public record RetrieveAddressByIdQuery(string Id) : IRequest<IEnumerable<AddressRetrieveResponse>>;

}
