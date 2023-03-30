using FluentValidation;
using MediatR;

namespace Spd.Manager.Cases
{
    public interface IApplicationManager
    {
        public Task<Unit> Handle(ApplicationInviteCreateCommand request, CancellationToken cancellationToken);
        public Task<IEnumerable<CheckApplicationInviteDuplicateResponse>> Handle(CheckApplicationInviteDuplicateQuery request, CancellationToken cancellationToken);

    }

    public record ApplicationInviteCreateCommand(Guid OrgId, IEnumerable<ApplicationInviteCreateRequest> ApplicationInviteCreateRequests) : IRequest<Unit>;
    public record CheckApplicationInviteDuplicateQuery(Guid OrgId, IEnumerable<ApplicationInviteCreateRequest> ApplicationInviteCreateRequests) : IRequest<IEnumerable<CheckApplicationInviteDuplicateResponse>>;

    public record ApplicationInviteCreateRequest
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string JobTitle { get; set; }
        public bool OrgPay { get; set; }
    }

    public record ApplicationInviteCreateResponse
    {
        public bool IsSuccess { get; set; }
        public bool ErrorReason { get; set; }
    }

    public class CheckApplicationInviteDuplicateResponse
    {
        public Guid OrgId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public bool HasPotentialDuplicate { get; set; } = false;
    }

    public class ApplicationInviteCreateRequestValidator : AbstractValidator<ApplicationInviteCreateRequest>
    {
        public ApplicationInviteCreateRequestValidator()
        {
            RuleFor(r => r.FirstName)
                    .NotEmpty()
                    .MaximumLength(40);

            RuleFor(r => r.LastName)
                    .NotEmpty()
                    .MaximumLength(40);

            RuleFor(r => r.Email)
                .NotEmpty()
                .EmailAddress()
                .MaximumLength(75);

            RuleFor(r => r.JobTitle)
                    .NotEmpty()
                    .MaximumLength(100);
        }
    }
}
