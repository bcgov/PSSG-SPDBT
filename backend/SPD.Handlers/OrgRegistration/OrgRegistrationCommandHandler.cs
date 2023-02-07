using MediatR;
using SPD.Common.ViewModels.Organization;

namespace SPD.Handlers.OrgRegistration
{
    public class OrgRegistrationCommandHandler : IRequestHandler<CreateOrgRegistrationCommand, Unit>
    {
        public OrgRegistrationCommandHandler()
        {
            
        }

        public async Task<Unit> Handle(CreateOrgRegistrationCommand request, CancellationToken cancellationToken)
        {
            return default;
        }
    }

    public record CreateOrgRegistrationCommand(OrgRegistrationCreateRequest CreateNoteRequest) : IRequest<Unit>;
}
