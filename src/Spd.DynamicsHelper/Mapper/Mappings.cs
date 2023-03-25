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

            CreateMap<SpdFile, DownloadFileResponse>()
                .ForMember(d => d.Body, opt => opt.MapFrom(s => Convert.ToBase64String(s.Content)))
                .ForMember(d => d.Key, opt => opt.MapFrom(s => s.Key));
        }
    }
}
