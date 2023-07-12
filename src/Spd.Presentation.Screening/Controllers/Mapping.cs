using AutoMapper;
using Spd.Manager.Cases.Application;
using Spd.Manager.Membership.Org;
using Spd.Manager.Membership.UserProfile;
using Spd.Utilities.LogonUser;

namespace Spd.Presentation.Screening.Controllers;

internal class Mappings : Profile
{
    public Mappings()
    {
        CreateMap<PortalUserIdentityInfo, PortalUserIdentity>();
        CreateMap<OrgResponse, AppOrgResponse>()
           .ForMember(d => d.OrgId, opt => opt.MapFrom(s => s.Id))
           .ForMember(d => d.OrgName, opt => opt.MapFrom(s => s.OrganizationName))
           .ForMember(d => d.OrgPhoneNumber, opt => opt.MapFrom(s => s.PhoneNumber))
           .ForMember(d => d.OrgEmail, opt => opt.MapFrom(s => s.Email))
           .ForMember(d => d.OrgAddressLine1, opt => opt.MapFrom(s => s.AddressLine1))
           .ForMember(d => d.OrgAddressLine2, opt => opt.MapFrom(s => s.AddressLine2))
           .ForMember(d => d.OrgCity, opt => opt.MapFrom(s => s.AddressCity))
           .ForMember(d => d.OrgProvince, opt => opt.MapFrom(s => s.AddressProvince))
           .ForMember(d => d.OrgCountry, opt => opt.MapFrom(s => s.AddressCountry))
           .ForMember(d => d.OrgPostalCode, opt => opt.MapFrom(s => s.AddressPostalCode))
           .ForMember(d => d.WorksWith, opt => opt.MapFrom(s => s.EmployeeInteractionType))
           .ForMember(d => d.GivenName, opt => opt.Ignore())
           .ForMember(d => d.Surname, opt => opt.Ignore())
           .ForMember(d => d.EmailAddress, opt => opt.Ignore())
           .ForMember(d => d.JobTitle, opt => opt.Ignore())
           .ForMember(d => d.PayeeType, opt => opt.MapFrom(s => s.PayerPreference))
           .ForMember(d => d.ScreeningType, opt => opt.Ignore())
           .ForMember(d => d.ServiceType, opt => opt.MapFrom(s => s.ServiceTypes.FirstOrDefault()));
    }
}

