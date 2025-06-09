using AutoMapper;
using Microsoft.Dynamics.CRM;

namespace Spd.Resource.Repository.MDRARegistration;
internal class Mappings : Profile
{
    public Mappings()
    {
        _ = CreateMap<CreateMDRARegistrationCmd, spd_orgregistration>()
        //.ForMember(d => d.spd_applicationid, opt => opt.MapFrom(s => Guid.NewGuid()))
        //.ForMember(d => d.spd_licenceapplicationtype, opt => opt.MapFrom(s => SharedMappingFuncs.GetLicenceApplicationTypeOptionSet(s.ApplicationTypeCode)))
        //.ForMember(d => d.spd_firstname, opt => opt.MapFrom(s => s.TrainerGivenName))
        //.ForMember(d => d.spd_lastname, opt => opt.MapFrom(s => s.TrainerSurname))
        //.ForMember(d => d.spd_middlename1, opt => opt.MapFrom(s => s.TrainerMiddleName))
        //.ForMember(d => d.spd_dateofbirth, opt => opt.MapFrom(s => SharedMappingFuncs.GetDateFromDateOnly(s.TrainerDateOfBirth)))
        //.ForMember(d => d.spd_emailaddress1, opt => opt.MapFrom(s => s.TrainerEmailAddress))
        //.ForMember(d => d.spd_phonenumber, opt => opt.MapFrom(s => s.TrainerPhoneNumber))
        //.ForMember(d => d.spd_origin, opt => opt.MapFrom(s => SharedMappingFuncs.GetOptionset<ApplicationOriginTypeEnum, ApplicationOriginOptionSet>(s.ApplicationOriginTypeCode)))
        //.ForMember(d => d.statecode, opt => opt.MapFrom(s => DynamicsConstants.StateCode_Active))
        //.ForMember(d => d.spd_addressline1, opt => opt.MapFrom(s => s.TrainerMailingAddress == null ? null : StringHelper.SanitizeEmpty(s.TrainerMailingAddress.AddressLine1)))
        //.ForMember(d => d.spd_addressline2, opt => opt.MapFrom(s => s.TrainerMailingAddress == null ? null : StringHelper.SanitizeEmpty(s.TrainerMailingAddress.AddressLine2)))
        //.ForMember(d => d.spd_city, opt => opt.MapFrom(s => s.TrainerMailingAddress == null ? null : StringHelper.SanitizeEmpty(s.TrainerMailingAddress.City)))
        //.ForMember(d => d.spd_postalcode, opt => opt.MapFrom(s => s.TrainerMailingAddress == null ? null : StringHelper.SanitizeEmpty(s.TrainerMailingAddress.PostalCode)))
        //.ForMember(d => d.spd_province, opt => opt.MapFrom(s => s.TrainerMailingAddress == null ? null : StringHelper.SanitizeEmpty(s.TrainerMailingAddress.Province)))
        //.ForMember(d => d.spd_country, opt => opt.MapFrom(s => s.TrainerMailingAddress == null ? null : StringHelper.SanitizeEmpty(s.TrainerMailingAddress.Country)))
        //.ForMember(d => d.spd_submittedon, opt => opt.Ignore())
        //.ForMember(d => d.spd_portalmodifiedon, opt => opt.MapFrom(s => DateTimeOffset.UtcNow))
        //.ForMember(d => d.spd_licenceterm, opt => opt.MapFrom(s => SharedMappingFuncs.GetOptionset<LicenceTermEnum, LicenceTermOptionSet>(s.LicenceTermCode)))
        //.ForMember(d => d.spd_declaration, opt => opt.MapFrom(s => s.AgreeToCompleteAndAccurate))
        //.ForMember(d => d.spd_consent, opt => opt.MapFrom(s => s.AgreeToCompleteAndAccurate))
        //.ForMember(d => d.spd_declarationdate, opt => opt.MapFrom(s => SharedMappingFuncs.GetDeclarationDate(s.AgreeToCompleteAndAccurate)))
        //.ReverseMap()
        //.ForMember(d => d.ServiceTypeCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetServiceType(s._spd_servicetypeid_value)))
        //.ForMember(d => d.ApplicationOriginTypeCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetEnum<ApplicationOriginOptionSet, ApplicationOriginTypeEnum>(s.spd_origin)))
        //.ForMember(d => d.ApplicationTypeCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetLicenceApplicationTypeEnum(s.spd_licenceapplicationtype)))
        //.ForMember(d => d.LicenceTermCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetLicenceTermEnum(s.spd_licenceterm)))
        //.ForMember(d => d.TrainerDateOfBirth, opt => opt.MapFrom(s => SharedMappingFuncs.GetDateOnly(s.spd_dateofbirth)))
        //.ForMember(d => d.TrainerMailingAddress, opt => opt.MapFrom(s => SharedMappingFuncs.GetMailingAddressData(s)))
        ;



    }
}
