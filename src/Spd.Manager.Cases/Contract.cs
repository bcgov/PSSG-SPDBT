using FluentValidation;
using MediatR;

namespace Spd.Manager.Cases
{
    public interface IScreeningManager
    {
        public Task<IList<ScreeningInviteCreateResponse>> Handle(ScreeningInviteCreateCommand request, CancellationToken cancellationToken);

    }

    public record ScreeningInviteCreateCommand(Guid OrgSpdId, IList<ScreeningInviteCreateRequest> ScreeningInviteCreateRequests) : IRequest<IList<ScreeningInviteCreateResponse>>;

    public record ScreeningInviteCreateRequest
    {
        //todo: update and add validation.
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string JobTitle { get; set; }
        public bool OrgPay { get; set; }
    }

    public record ScreeningInviteCreateResponse
    {
        public bool IsSuccess { get; set; }
        public bool ErrorReason { get; set; }
    }

    public class ScreeningInviteCreateRequestValidator : AbstractValidator<ScreeningInviteCreateRequest>
    {
        public ScreeningInviteCreateRequestValidator()
        {
            //todo: add valiation here. following code is temp.
            RuleFor(r => r.LastName)
                    .NotEmpty()
                    .MaximumLength(200);

        }
    }
}
