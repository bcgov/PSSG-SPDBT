using AutoMapper;
using Microsoft.Dynamics.CRM;

namespace Spd.Resource.Repository.DogTeam
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<spd_dogteam, DogTeamResp>()
            .ForMember(d => d.Id, opt => opt.MapFrom(s => s.spd_dogteamid))
            .ForMember(d => d.DogBreed, opt => opt.MapFrom(s => s.spd_DogId.spd_breed))
            .ForMember(d => d.MicrochipNumber, opt => opt.MapFrom(s => s.spd_DogId.spd_microchipnumber))
            .ForMember(d => d.DogColorAndMarkings, opt => opt.MapFrom(s => s.spd_DogId.spd_colourandmarkings))
            .ForMember(d => d.DogDateOfBirth, opt => opt.MapFrom(s => s.spd_DogId.spd_dateofbirth))
            .ForMember(d => d.DogGender, opt => opt.MapFrom(s => s.spd_DogId.spd_gender))
            .ForMember(d => d., opt => opt.MapFrom(s => s.spd_DogId.spd_breed));
        }
    }
}
