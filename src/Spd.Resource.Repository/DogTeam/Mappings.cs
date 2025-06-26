using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.DogTeam
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<spd_dogteam, DogTeamResp>()
            .ForMember(d => d.Id, opt => opt.MapFrom(s => s.spd_dogteamid))
            .ForMember(d => d.DogId, opt => opt.MapFrom(s => s.spd_DogId.spd_dogid))
            .ForMember(d => d.DogBreed, opt => opt.MapFrom(s => s.spd_DogId.spd_breed))
            .ForMember(d => d.MicrochipNumber, opt => opt.MapFrom(s => s.spd_DogId.spd_microchipnumber))
            .ForMember(d => d.DogColorAndMarkings, opt => opt.MapFrom(s => s.spd_DogId.spd_colourandmarkings))
            .ForMember(d => d.DogDateOfBirth, opt => opt.MapFrom(s => s.spd_DogId.spd_dateofbirth))
            .ForMember(d => d.DogGender, opt => opt.MapFrom(s => SharedMappingFuncs.GetEnum<GenderOptionSet, GenderEnum>(s.spd_DogId.spd_gender)))
            .ForMember(d => d.DogName, opt => opt.MapFrom(s => s.spd_DogId.spd_dogname))
            .ForMember(d => d.IsDogTrainedByAccreditedSchool, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_DogId.spd_dogstrainingaccredited)))
            .ForMember(d => d.HandlerId, opt => opt.MapFrom(s => s._spd_contactid_value))
            .ForMember(d => d.HandlerFirstName, opt => opt.MapFrom(s => s.spd_ContactId.firstname))
            .ForMember(d => d.HandlerMiddleName1, opt => opt.MapFrom(s => s.spd_ContactId.spd_middlename1))
            .ForMember(d => d.HandlerLastName, opt => opt.MapFrom(s => s.spd_ContactId.lastname));
        }
    }
}
