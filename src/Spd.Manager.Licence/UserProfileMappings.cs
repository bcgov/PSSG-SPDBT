using AutoMapper;
using Spd.Resource.Repository;
using Spd.Resource.Repository.Contact;
using Spd.Resource.Repository.Identity;
using System.Text.Json;

namespace Spd.Manager.Licence
{
    internal class UserProfileMappings : Profile
    {
        public UserProfileMappings()
        {
            CreateMap<Identity, ApplicantProfileResponse>()
                .ForMember(d => d.ApplicantId, opt => opt.MapFrom(s => s.ContactId))
                .ForMember(d => d.Email, opt => opt.MapFrom(s => s.EmailAddress))
            ;

            CreateMap<ManageApplicantProfileCommand, CreateContactCmd>()
               .ForMember(d => d.Sub, opt => opt.MapFrom(s => s.BcscIdentityInfo.Sub))
               .IncludeBase<ManageApplicantProfileCommand, ContactCmd>();

            CreateMap<ManageApplicantProfileCommand, UpdateContactCmd>()
                .IncludeBase<ManageApplicantProfileCommand, ContactCmd>();

            CreateMap<ManageApplicantProfileCommand, ContactCmd>()
               .ForMember(d => d.FirstName, opt => opt.MapFrom(s => s.BcscIdentityInfo.FirstName))
               .ForMember(d => d.LastName, opt => opt.MapFrom(s => s.BcscIdentityInfo.LastName))
               .ForMember(d => d.EmailAddress, opt => opt.MapFrom(s => s.BcscIdentityInfo.Email))
               .ForMember(d => d.MiddleName1, opt => opt.MapFrom(s => s.BcscIdentityInfo.MiddleName1))
               .ForMember(d => d.MiddleName2, opt => opt.MapFrom(s => s.BcscIdentityInfo.MiddleName2))
               .ForMember(d => d.BirthDate, opt => opt.MapFrom(s => s.BcscIdentityInfo.BirthDate))
               .ForMember(d => d.Gender, opt => opt.MapFrom(s => GetGenderEnum(s.BcscIdentityInfo.Gender)))
               .ForMember(d => d.MailingAddress, opt => opt.Ignore())
               .ForMember(d => d.ResidentialAddress, opt => opt.MapFrom(s => GetAddressFromStr(s.BcscIdentityInfo.Address)));

            CreateMap<ContactResp, ApplicantProfileResponse>()
               .ForMember(d => d.ApplicantId, opt => opt.MapFrom(s => s.Id));
        }

        public static GenderEnum? GetGenderEnum(string? bscsGender)
        {
            if (bscsGender == null) return null;
            string? str = bscsGender.ToLower();
            GenderEnum? gender = str switch
            {
                "female" => GenderEnum.F,
                "male" => GenderEnum.M,
                "diverse" => GenderEnum.U,
                _ => null,
            };
            return gender;
        }

        private static readonly JsonSerializerOptions jOption = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = true
        };

        private static Address? GetAddressFromStr(string? jsonStr)
        {
            if (jsonStr == null) return null;
            try
            {
                var result = JsonSerializer.Deserialize<BcscAddress>(jsonStr, jOption);
                return new Address()
                {
                    AddressLine1 = result?.Street_address,
                    City = result?.Locality,
                    Country = result?.Country,
                    PostalCode = result?.Postal_code,
                    Province = result?.Region,
                };
            }
            catch
            {
                return null;
            }
        }
    }

    internal class BcscAddress
    {
        public string? Street_address { get; set; }
        public string? Country { get; set; }
        public string? Locality { get; set; } //city
        public string? Postal_code { get; set; }
        public string? Region { get; set; } //province
    }
}
