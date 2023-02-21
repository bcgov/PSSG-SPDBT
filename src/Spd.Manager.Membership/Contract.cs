using MediatR;
using Spd.Manager.Membership.ViewModels;

namespace Spd.Manager.Membership
{
    public interface IOrgRegistrationManager
    {
        public Task<Unit> Handle(CreateOrgRegistrationCommand request, CancellationToken cancellationToken);
    }

    public record CreateOrgRegistrationCommand(OrgRegistrationCreateRequest CreateOrgRegistrationRequest) : IRequest<Unit>;

}
