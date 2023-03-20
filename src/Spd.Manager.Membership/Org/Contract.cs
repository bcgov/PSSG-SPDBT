using FluentValidation;
using MediatR;
using Spd.Manager.Membership.Shared;

namespace Spd.Manager.Membership.Org
{
    public interface IOrgManager
    {
        public Task<OrgResponse> Handle(UpdateOrgCommand request, CancellationToken cancellationToken);
        public Task<OrgResponse> Handle(GetOrgCommand request, CancellationToken cancellationToken);
    }

    public record UpdateOrgCommand(UpdateOrgRequest UpdateOrgRequest, Guid OrgId) : IRequest<OrgResponse>;
    public record GetOrgCommand(Guid OrgId) : IRequest<OrgResponse>;

    public class UpdateOrgRequest
    {
        public Guid Id { get; set; }
        public PayerPreferenceTypeCode PayerPreference { get; set; }
        public BooleanTypeCode ContractorsNeedVulnerableSectorScreening { get; set; }
        public BooleanTypeCode LicenseesNeedVulnerableSectorScreening { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string? AddressCity { get; set; }
        public string? AddressCountry { get; set; }
        public string? AddressPostalCode { get; set; }
        public string? AddressProvince { get; set; }
        public string? OrganizationName { get; set; }
        public string? OrganizationLegalName { get; set; }
    }

    public class OrgResponse
    {
        public Guid Id { get; set; }
        public PayerPreferenceTypeCode PayerPreference { get; set; }
        public BooleanTypeCode ContractorsNeedVulnerableSectorScreening { get; set; }
        public BooleanTypeCode LicenseesNeedVulnerableSectorScreening { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string? AddressCity { get; set; }
        public string? AddressCountry { get; set; }
        public string? AddressPostalCode { get; set; }
        public string? AddressProvince { get; set; }
        public string? OrganizationName { get; set; }
        public string? OrganizationLegalName { get; set; }
    }

    public class UpdateOrgRequestValidator : AbstractValidator<UpdateOrgRequest>
    {
        public UpdateOrgRequestValidator()
        {
            RuleFor(r => r.PayerPreference)
                    .IsInEnum();

            RuleFor(r => r.ContractorsNeedVulnerableSectorScreening)
                    .IsInEnum();

            RuleFor(r => r.LicenseesNeedVulnerableSectorScreening)
                    .IsInEnum();

            RuleFor(r => r.OrganizationName)
                .NotEmpty()
                .MaximumLength(160);

            RuleFor(r => r.OrganizationLegalName)
                .NotEmpty()
                .MaximumLength(160);

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
}
