using MediatR;
using SPD.Common.ViewModels.Organization;
using SPD.Services;

namespace SPD.Handlers.OrgRegistration
{
    public class OrgRegistrationCommandHandler : IRequestHandler<CreateOrgRegistrationCommand, Unit>
    {
        public readonly IOrgRegistrationService _service;
        public OrgRegistrationCommandHandler(IOrgRegistrationService service)
        {
            _service = service;
        }

        public async Task<Unit> Handle(CreateOrgRegistrationCommand request, CancellationToken cancellationToken)
        {
            await _service.CreateOrgRegistrationAsync(request.CreateOrgRegistrationRequest, cancellationToken);

            return default;
        }
    }

    public record CreateOrgRegistrationCommand(OrgRegistrationCreateRequest CreateOrgRegistrationRequest) : IRequest<Unit>;
}
