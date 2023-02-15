using AutoMapper;
using Microsoft.Dynamics.CRM;
using SPD.Common.ViewModels.Organization;
using SPD.Services.DynamicsEnum;

namespace SPD.Services.Mappings

{
    public class OrgRegistrationMapping : Profile
    {
        public OrgRegistrationMapping()
        {
            CreateMap<OrgRegistrationCreateRequest, Spd_orgregistration>()
                .ForMember(d => d.Spd_city, opt => opt.MapFrom(s => s.MailingCity))
                .ForMember(d => d.Spd_country, opt => opt.MapFrom(s => s.MailingCountry))
                .ForMember(d => d.Spd_postalcode, opt => opt.MapFrom(s => s.MailingPostalCode))
                .ForMember(d => d.Spd_province, opt => opt.MapFrom(s => s.MailingProvince))
                .ForMember(d => d.Spd_street1, opt => opt.MapFrom(s => s.MailingAddressLine1))
                .ForMember(d => d.Spd_street2, opt => opt.MapFrom(s => s.MailingAddressLine2))
                .ForMember(d => d.Spd_organizationname, opt => opt.MapFrom(s => s.OrganizationName))
                .ForMember(d => d.Spd_orgregistrationid, opt => opt.MapFrom(s => Guid.NewGuid()))
                .ForMember(d => d.Spd_source, opt => opt.MapFrom(s => SourceOptionSet.Online))
                .ForMember(d => d.Spd_registrationtype, opt => opt.MapFrom(s => (int)Enum.Parse<RegistrationTypeOptionSet>(s.RegistrationTypeCode.ToString())))
                .ForMember(d => d.Spd_employerorganizationtype, opt => opt.MapFrom(s => (int)Enum.Parse<EmployerOrganizationTypeOptionSet>(s.EmployerOrganizationTypeCode.ToString())))
            ;
        }
    }
}
