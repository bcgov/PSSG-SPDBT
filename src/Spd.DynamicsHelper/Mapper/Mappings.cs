using AutoMapper;
using Spd.DynamicsHelper.Models;
using Spd.Utilities.FileStorage;

namespace Spd.DynamicsHelper.Mapper
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<UploadFileRequest, SpdFile>()
                .ForMember(d => d.Content, opt => opt.Ignore());

            CreateMap<UploadFileRequestJson, SpdFile>()
                .ForMember(d => d.Content, opt => opt.MapFrom(s => Convert.FromBase64String(s.Body)));
        }
    }
}
