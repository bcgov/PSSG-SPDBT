using FluentValidation;
using MediatR;
using Spd.Manager.Shared;

namespace Spd.Manager.Screening
{
    public interface IOrgManager
    {
        public Task<OrgResponse> Handle(OrgUpdateCommand request, CancellationToken cancellationToken);

        public Task<OrgResponse?> Handle(OrgGetQuery request, CancellationToken cancellationToken);

        public Task<OrgInvitationLinkResponse?> Handle(OrgInvitationLinkCreateCommand cmd, CancellationToken cancellationToken);

        public Task<OrgInviteVerifyResponse?> Handle(OrgInvitationLinkVerifyCommand cmd, CancellationToken cancellationToken);
    }

    public record OrgUpdateCommand(OrgUpdateRequest OrgUpdateRequest, Guid OrgId) : IRequest<OrgResponse>;
    public record OrgGetQuery(Guid? OrgId, string? AccessCode = null) : IRequest<OrgResponse>;
    public record OrgInvitationLinkCreateCommand(Guid OrgId, string ScreeningAppOrgUrl) : IRequest<OrgInvitationLinkResponse>;
    public record OrgInvitationLinkVerifyCommand(string EncodedOrgId) : IRequest<OrgInviteVerifyResponse>;
    public record OrgInfo
    {
        public Guid Id { get; set; }
        public PayerPreferenceTypeCode PayerPreference { get; set; }
        public BooleanTypeCode ContractorsNeedVulnerableSectorScreening { get; set; }
        public BooleanTypeCode? LicenseesNeedVulnerableSectorScreening { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string? AddressCity { get; set; }
        public string? AddressCountry { get; set; }
        public string? AddressPostalCode { get; set; }
        public string? AddressProvince { get; set; }
    }
    public record OrgUpdateRequest : OrgInfo;
    public record OrgResponse : OrgInfo
    {
        public string? AccessCode { get; set; }
        public string? OrganizationName { get; set; }
        public string? OrganizationLegalName { get; set; }
        public bool GenericUploadEnabled { get; set; } = false;
        public bool HasInvoiceSupport { get; set; } = false;
        public EmployeeInteractionTypeCode? EmployeeInteractionType { get; set; }
        public EmployeeOrganizationTypeCode? EmployeeOrganizationTypeCode { get; set; }
        public VolunteerOrganizationTypeCode? VolunteerOrganizationTypeCode { get; set; }
        public IEnumerable<ServiceTypeCode> ServiceTypes { get; set; } = Array.Empty<ServiceTypeCode>();
    }

    public class OrgUpdateRequestValidator : AbstractValidator<OrgUpdateRequest>
    {
        public OrgUpdateRequestValidator()
        {
            RuleFor(r => r.PayerPreference)
                    .IsInEnum();

            RuleFor(r => r.ContractorsNeedVulnerableSectorScreening)
                    .IsInEnum();

            RuleFor(r => r.LicenseesNeedVulnerableSectorScreening)
              .IsInEnum()
              .When(r => r.LicenseesNeedVulnerableSectorScreening != null);

            RuleFor(r => r.Email)
                .NotEmpty()
                .EmailAddress()
                .MaximumLength(75);

            RuleFor(r => r.PhoneNumber)
                .NotEmpty()
                .MaximumLength(12);

            RuleFor(r => r.AddressLine1)
                .NotEmpty()
                .MaximumLength(100);

            RuleFor(r => r.AddressLine2)
                .MaximumLength(100);

            RuleFor(r => r.AddressCity)
                .NotEmpty()
                .MaximumLength(100);

            RuleFor(r => r.AddressCountry)
                .NotEmpty()
                .MaximumLength(100);

            RuleFor(r => r.AddressPostalCode)
                .NotEmpty()
                .MaximumLength(20);

            RuleFor(r => r.AddressProvince)
                .NotEmpty()
                .MaximumLength(100);
        }
    }

    public record OrgInvitationLinkResponse(string OrgInvitationLinkUrl);
    public record OrgInviteVerifyResponse(Guid? OrgId, bool LinkIsValid = false, string? ErrMsg = null);
}