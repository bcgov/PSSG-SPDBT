using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Applicants.ApplicationInvite
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<ApplicationInvite, spd_portalinvitation>()
            .ForMember(d => d.spd_portalinvitationid, opt => opt.MapFrom(s => Guid.NewGuid()))
            .ForMember(d => d.spd_firstname, opt => opt.MapFrom(s => s.FirstName))
            .ForMember(d => d.spd_surname, opt => opt.MapFrom(s => s.LastName))
            .ForMember(d => d.spd_email, opt => opt.MapFrom(s => s.Email))
            .ForMember(d => d.spd_jobtitle, opt => opt.MapFrom(s => s.JobTitle))
            .ForMember(d => d.spd_invitationtype, opt => opt.MapFrom(s => InvitationTypeOptionSet.ScreeningRequest))
            .ForMember(d => d.spd_screeningrequesttype, opt => opt.MapFrom(s => (int)Enum.Parse<ScreenTypeOptionSet>(s.ScreenType.ToString())))
            .ForMember(d => d.spd_views, opt => opt.MapFrom(s => 0))
            .ForMember(d => d.spd_payeetype, opt => opt.MapFrom(s => (int)Enum.Parse<PayerPreferenceOptionSet>(s.PayeeType.ToString())))
            .ReverseMap();

            _ = CreateMap<spd_portalinvitation, ApplicationInviteResult>()
            .IncludeBase<spd_portalinvitation, ApplicationInvite>()
            .ForMember(d => d.PayeeType, opt => opt.MapFrom(s => GetPayeeType(s.spd_payeetype)))
            .ForMember(d => d.Id, opt => opt.MapFrom(s => s.spd_portalinvitationid))
            .ForMember(d => d.ErrorMsg, opt => opt.MapFrom(s => s.spd_errormessage))
            .ForMember(d => d.Status, opt => opt.MapFrom(s => s.statuscode == null ? string.Empty : ((InvitationActiveStatus)s.statuscode).ToString()))
            .ForMember(d => d.Viewed, opt => opt.MapFrom(s => s.spd_views != null && s.spd_views > 0));

            _ = CreateMap<spd_portalinvitation, AppInviteVerifyResp>()
            .ForMember(d => d.AddressPostalCode, opt => opt.MapFrom(s => s.spd_OrganizationId.address1_postalcode))
            .ForMember(d => d.OrgId, opt => opt.MapFrom(s => s.spd_OrganizationId.accountid))
            .ForMember(d => d.OrganizationName, opt => opt.MapFrom(s => s.spd_OrganizationId.spd_organizationlegalname))
            .ForMember(d => d.PhoneNumber, opt => opt.MapFrom(s => s.spd_OrganizationId.address1_telephone1))
            .ForMember(d => d.AddressLine1, opt => opt.MapFrom(s => s.spd_OrganizationId.address1_line1))
            .ForMember(d => d.AddressLine2, opt => opt.MapFrom(s => s.spd_OrganizationId.address1_line2))
            .ForMember(d => d.AddressCity, opt => opt.MapFrom(s => s.spd_OrganizationId.address1_city))
            .ForMember(d => d.AddressCountry, opt => opt.MapFrom(s => s.spd_OrganizationId.address1_country))
            .ForMember(d => d.AddressPostalCode, opt => opt.MapFrom(s => s.spd_OrganizationId.address1_postalcode))
            .ForMember(d => d.AddressProvince, opt => opt.MapFrom(s => s.spd_OrganizationId.address1_stateorprovince))
            .ForMember(d => d.PayeeType, opt => opt.MapFrom(s => GetPayeeType(s.spd_payeetype)))
            .ForMember(d => d.EmployeeOrganizationTypeCode, opt => opt.MapFrom(s => DynamicsContextLookupHelpers.GetTypeFromTypeId(s.spd_OrganizationId._spd_organizationtypeid_value).Item1))
            .ForMember(d => d.VolunteerOrganizationTypeCode, opt => opt.MapFrom(s => DynamicsContextLookupHelpers.GetTypeFromTypeId(s.spd_OrganizationId._spd_organizationtypeid_value).Item2));
        }
        private static string? GetPayeeType(int? code)
        {
            if (code == null) return null;
            return Enum.GetName(typeof(PayerPreferenceOptionSet), code);
        }
    }
}
