using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Applicants.LicenceApplication
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<SaveLicenceCmd, spd_application>()
                .ForMember(d => d.spd_applicationid, opt => opt.MapFrom(s => Guid.NewGuid()))
                .ForMember(d => d.spd_licenceapplicationtype, opt => opt.MapFrom(s => GetLicenceApplicationType(s.ApplicationTypeData)))
                .ForMember(d => d.spd_firstname, opt => opt.MapFrom(s => s.PersonalInformationData == null ? null : s.PersonalInformationData.GivenName))
                .ForMember(d => d.spd_lastname, opt => opt.MapFrom(s => s.PersonalInformationData == null ? null : s.PersonalInformationData.Surname))
                .ForMember(d => d.spd_middlename1, opt => opt.MapFrom(s => s.PersonalInformationData == null ? null : s.PersonalInformationData.MiddleName1))
                .ForMember(d => d.spd_middlename2, opt => opt.MapFrom(s => s.PersonalInformationData == null ? null : s.PersonalInformationData.MiddleName2))
                .ForMember(d => d.spd_dateofbirth, opt => opt.MapFrom(s => s.PersonalInformationData == null ? null : s.PersonalInformationData.DateOfBirth))
                .ForMember(d => d.spd_sex, opt => opt.MapFrom(s => GetGender(s.PersonalInformationData)))
                //.ForMember(d => d.spd, opt => opt.MapFrom(s => GetGender(s.PersonalInformationData)))
                .ForMember(d => d.statecode, opt => opt.MapFrom(s => DynamicsConstants.StateCode_Active))
                .ForMember(d => d.spd_response, opt => opt.MapFrom(s => GetResponseCode(s.Success)))
                .ForMember(d => d.spd_datetimeofpayment, opt => opt.MapFrom(s => s.TransDateTime))
                .ForMember(d => d.spd_errordescription, opt => opt.MapFrom(s => s.MessageText))
                .ForMember(d => d.spd_ordernumber, opt => opt.MapFrom(s => s.TransOrderId))
                .ForMember(d => d.statuscode, opt => opt.MapFrom(s => PaymentStatusCodeOptionSet.Pending));
        }

        private static int? GetLicenceApplicationType(ApplicationTypeData? applicationTypeData)
        {
            if (applicationTypeData?.ApplicationTypeCode == null)
                return null;
            return applicationTypeData.ApplicationTypeCode switch
            {
                ApplicationTypeEnum.Update => (int)LicenceApplicationTypeOptionSet.Update,
                ApplicationTypeEnum.Replacement => (int)LicenceApplicationTypeOptionSet.Replacement,
                ApplicationTypeEnum.New => (int)LicenceApplicationTypeOptionSet.New_Expired,
                ApplicationTypeEnum.Renewal => (int)LicenceApplicationTypeOptionSet.Renewal,
                _ => throw new ArgumentException("invalid application type code")
            };
        }
        private static int? GetAppFirstName(ApplicationTypeData? applicationTypeData)
        {
            if (applicationTypeData?.ApplicationTypeCode == null)
                return null;
            return applicationTypeData.ApplicationTypeCode switch
            {
                ApplicationTypeEnum.Update => (int)LicenceApplicationTypeOptionSet.Update,
                ApplicationTypeEnum.Replacement => (int)LicenceApplicationTypeOptionSet.Replacement,
                ApplicationTypeEnum.New => (int)LicenceApplicationTypeOptionSet.New_Expired,
                ApplicationTypeEnum.Renewal => (int)LicenceApplicationTypeOptionSet.Renewal,
                _ => throw new ArgumentException("invalid application type code")
            };
        }
        private static int? GetGender(PersonalInformationData? data)
        {
            if (data?.GenderCode == null) return (int)GenderOptionSet.U;
            return (int)Enum.Parse<GenderOptionSet>(data.GenderCode.ToString());
        }
    }
}
