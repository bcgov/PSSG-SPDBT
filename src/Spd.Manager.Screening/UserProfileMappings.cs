using AutoMapper;
using Spd.Manager.Shared;
using Spd.Resource.Repository;
using Spd.Resource.Repository.Contact;
using Spd.Resource.Repository.Identity;
using Spd.Resource.Repository.Org;
using Spd.Resource.Repository.PortalUser;
using Spd.Resource.Repository.Users;

namespace Spd.Manager.Screening
{
    internal class UserProfileMappings : Profile
    {
        public UserProfileMappings()
        {
            CreateMap<OrgResult, OrgSettings>();
            CreateMap<UserResult, UserInfo>()
               .ForMember(d => d.OrgName, opt => opt.Ignore())
               .ForMember(d => d.OrgSettings, opt => opt.Ignore())
               .ForMember(d => d.UserId, opt => opt.MapFrom(s => s.Id))
               .ForMember(d => d.OrgRegistrationId, opt => opt.Ignore())
               .ForMember(d => d.OrgId, opt => opt.MapFrom(s => s.OrganizationId));

            CreateMap<Identity, ApplicantProfileResponse>()
                .ForMember(d => d.ApplicantId, opt => opt.MapFrom(s => s.ContactId))
                .ForMember(d => d.Email, opt => opt.MapFrom(s => s.EmailAddress))
            ;

            CreateMap<PortalUserResp, IdirUserProfileResponse>()
               .ForMember(d => d.OrgId, opt => opt.MapFrom(s => s.OrganizationId))
               .ForMember(d => d.IdentityProviderType, opt => opt.MapFrom(s => IdentityProviderTypeCode.Idir))
               .ForMember(d => d.UserId, opt => opt.MapFrom(s => s.Id));

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
               .ForMember(d => d.Gender, opt => opt.MapFrom(s => GetGenderEnum(s.BcscIdentityInfo.Gender)));

            CreateMap<ContactResp, ApplicantProfileResponse>()
               .ForMember(d => d.ApplicantId, opt => opt.MapFrom(s => s.Id));
        }

        public static Gender? GetGenderEnum(string? bscsGender)
        {
            if (bscsGender == null) return null;
            string? str = bscsGender?.ToLower();
            Gender? gender = str switch
            {
                "female" => Gender.F,
                "male" => Gender.M,
                "diverse" => Gender.U,
                _ => null,
            };
            return gender;
        }
    }
}
