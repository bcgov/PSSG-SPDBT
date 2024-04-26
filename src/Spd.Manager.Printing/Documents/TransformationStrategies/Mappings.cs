using AutoMapper;
using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.Contact;
using Spd.Resource.Repository.OptionSet;
using Spd.Resource.Repository.Org;

namespace Spd.Manager.Printing.Documents.TransformationStrategies
{
    public class Mappings : Profile
    {
        public IOptionSetRepository _optionSetRepository { get; }

        public Mappings()
        {
            CreateMap<ApplicationResult, FingerprintLetter>()
                .ForMember(d => d.Date, opt => opt.MapFrom(s => DateTime.Now.ToString("yyyy-MM-dd")))
                .ForMember(d => d.CaseNumber, opt => opt.MapFrom(s => s.ApplicationNumber))
                .ForMember(d => d.ServiceType, opt => opt.MapFrom(s => s.ServiceType.ToString()));

            CreateMap<ContactResp, Applicant>()
                .ForMember(d => d.Name, opt => opt.MapFrom(s => s.FullName))
                .ForMember(d => d.Sex, opt => opt.MapFrom(s => s.Gender))
                .ForMember(d => d.DateoOfBirth, opt => opt.MapFrom(s => s.BirthDate.ToString("yyyy-MM-dd")))
                .ForMember(d => d.PlaceOfBirth, opt => opt.MapFrom(s => s.BirthPlace))
                .ForMember(d => d.MailingAddress1, opt => opt.MapFrom(s => s.MailingAddress.AddressLine1))
                .ForMember(d => d.MailingAddress2, opt => opt.MapFrom(s => s.MailingAddress.AddressLine2))
                .ForMember(d => d.City, opt => opt.MapFrom(s => s.MailingAddress.City))
                .ForMember(d => d.ProvinceState, opt => opt.MapFrom(s => s.MailingAddress.Province))
                .ForMember(d => d.PostalCode, opt => opt.MapFrom(s => s.MailingAddress.PostalCode))
                .ForMember(d => d.Country, opt => opt.MapFrom(s => s.MailingAddress.Country));

            CreateMap<OrgResult, Organization>()
                .ForMember(d => d.Name, opt => opt.MapFrom(s => s.OrganizationName))
                .ForMember(d => d.MailingAddress1, opt => opt.MapFrom(s => s.AddressLine1))
                .ForMember(d => d.MailingAddress2, opt => opt.MapFrom(s => s.AddressLine2))
                .ForMember(d => d.City, opt => opt.MapFrom(s => s.AddressCity))
                .ForMember(d => d.ProvinceState, opt => opt.MapFrom(s => s.AddressProvince))
                .ForMember(d => d.PostalCode, opt => opt.MapFrom(s => s.AddressPostalCode))
                .ForMember(d => d.Country, opt => opt.MapFrom(s => s.AddressCountry));
        }
    }
}
