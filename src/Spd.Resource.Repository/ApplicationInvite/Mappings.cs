using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Tools;

namespace Spd.Resource.Repository.ApplicationInvite
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<ApplicationInvite, spd_portalinvitation>()
            .ForMember(d => d.spd_portalinvitationid, opt => opt.MapFrom(s => Guid.NewGuid()))
            .ForMember(d => d.spd_firstname, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.FirstName)))
            .ForMember(d => d.spd_surname, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.LastName)))
            .ForMember(d => d.spd_email, opt => opt.MapFrom(s => s.Email))
            .ForMember(d => d.spd_jobtitle, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.JobTitle)))
            .ForMember(d => d.spd_invitationtype, opt => opt.MapFrom(s => InvitationTypeOptionSet.ScreeningRequest))
            .ForMember(d => d.spd_screeningrequesttype, opt => opt.MapFrom(s => (int)Enum.Parse<ScreenTypeOptionSet>(s.ScreeningType.ToString())))
            .ForMember(d => d.spd_views, opt => opt.MapFrom(s => 0))
            .ForMember(d => d.spd_payeetype, opt => opt.MapFrom(s => GetPayeeTypeCode(s.PayeeType)))
            .ReverseMap()
            .ForMember(d => d.FirstName, opt => opt.MapFrom(s => s.spd_firstname))
            .ForMember(d => d.LastName, opt => opt.MapFrom(s => s.spd_surname))
            .ForMember(d => d.JobTitle, opt => opt.MapFrom(s => s.spd_jobtitle));

            _ = CreateMap<spd_portalinvitation, ApplicationInviteResult>()
            .IncludeBase<spd_portalinvitation, ApplicationInvite>()
            .ForMember(d => d.PayeeType, opt => opt.MapFrom(s => GetPayeeType(s.spd_payeetype)))
            .ForMember(d => d.OrgId, opt => opt.MapFrom(s => s._spd_organizationid_value))
            .ForMember(d => d.Id, opt => opt.MapFrom(s => s.spd_portalinvitationid))
            .ForMember(d => d.ErrorMsg, opt => opt.MapFrom(s => s.spd_errormessage))
            .ForMember(d => d.CreatedByUserId, opt => opt.MapFrom(s => s._spd_invitedby_value))
            .ForMember(d => d.Status, opt => opt.MapFrom(s => s.statuscode == null ? ApplicationInviteStatus.Draft : Enum.Parse<ApplicationInviteStatus>(((InvitationStatus)s.statuscode).ToString())))
            .ForMember(d => d.Viewed, opt => opt.MapFrom(s => s.spd_views != null && s.spd_views > 0));

            _ = CreateMap<spd_portalinvitation, AppInviteVerifyResp>()
            .ForMember(d => d.AppInviteId, opt => opt.MapFrom(s => s.spd_portalinvitationid))
            .ForMember(d => d.OrgPostalCode, opt => opt.MapFrom(s => s.spd_OrganizationId.address1_postalcode))
            .ForMember(d => d.OrgId, opt => opt.MapFrom(s => s.spd_OrganizationId.accountid))
            .ForMember(d => d.OrgName, opt => opt.MapFrom(s => s.spd_OrganizationId.spd_organizationlegalname ?? s.spd_OrganizationId.name))
            .ForMember(d => d.OrgPhoneNumber, opt => opt.MapFrom(s => s.spd_OrganizationId.telephone1))
            .ForMember(d => d.OrgEmail, opt => opt.MapFrom(s => s.spd_OrganizationId.emailaddress1))
            .ForMember(d => d.OrgAddressLine1, opt => opt.MapFrom(s => s.spd_OrganizationId.address1_line1))
            .ForMember(d => d.OrgAddressLine2, opt => opt.MapFrom(s => s.spd_OrganizationId.address1_line2))
            .ForMember(d => d.OrgCity, opt => opt.MapFrom(s => s.spd_OrganizationId.address1_city))
            .ForMember(d => d.OrgCountry, opt => opt.MapFrom(s => s.spd_OrganizationId.address1_country))
            .ForMember(d => d.OrgPostalCode, opt => opt.MapFrom(s => s.spd_OrganizationId.address1_postalcode))
            .ForMember(d => d.OrgProvince, opt => opt.MapFrom(s => s.spd_OrganizationId.address1_stateorprovince))
            .ForMember(d => d.WorksWith, opt => opt.MapFrom(s => GetEmployeeInteractionType(s.spd_OrganizationId.spd_workswith)))
            .ForMember(d => d.PayeeType, opt => opt.MapFrom(s => GetPayeeType(s.spd_payeetype)))
            .ForMember(d => d.EmailAddress, opt => opt.MapFrom(s => s.spd_email))
            .ForMember(d => d.GivenName, opt => opt.MapFrom(s => s.spd_firstname))
            .ForMember(d => d.Surname, opt => opt.MapFrom(s => s.spd_surname))
            .ForMember(d => d.JobTitle, opt => opt.MapFrom(s => s.spd_jobtitle))
            .ForMember(d => d.ScreeningType, opt => opt.MapFrom(s => GetScreenType(s.spd_screeningrequesttype)))
            .ForMember(d => d.ServiceType, opt => opt.MapFrom(s => SharedMappingFuncs.GetServiceType(s._spd_servicetypeid_value)))
            .ForMember(d => d.EmployeeOrganizationTypeCode, opt => opt.MapFrom(s => DynamicsContextLookupHelpers.GetTypeFromTypeId(s.spd_OrganizationId._spd_organizationtypeid_value).Item1))
            .ForMember(d => d.VolunteerOrganizationTypeCode, opt => opt.MapFrom(s => DynamicsContextLookupHelpers.GetTypeFromTypeId(s.spd_OrganizationId._spd_organizationtypeid_value).Item2));
        }
        private static string? GetPayeeType(int? code)
        {
            if (code == null) return null;
            return Enum.GetName(typeof(PayerPreferenceOptionSet), code);
        }

        private static int? GetPayeeTypeCode(PayerPreferenceTypeCode? code)
        {
            if (code == null) return null;
            try
            {
                return (int)Enum.Parse<PayerPreferenceOptionSet>(code.ToString());
            }
            catch
            {
                return null;
            }
        }
        private static string? GetEmployeeInteractionType(int? code)
        {
            if (code == null) return null;
            return Enum.GetName(typeof(WorksWithChildrenOptionSet), code);
        }
        private static ScreenTypeEnum? GetScreenType(int? code)
        {
            if (code == null) return null;
            return Enum.Parse<ScreenTypeEnum>(Enum.GetName(typeof(ScreenTypeOptionSet), code));
        }
    }
}
