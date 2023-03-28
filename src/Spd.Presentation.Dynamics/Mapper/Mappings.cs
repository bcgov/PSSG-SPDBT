using AutoMapper;
using Spd.Presentation.Dynamics.Models;
using Spd.Utilities.FileStorage;
using System.Text;

namespace Spd.Presentation.Dynamics.Mapper
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<UploadFileRequest, SpdFile>()
                .ForMember(d => d.Content, opt => opt.Ignore());

            CreateMap<UploadFileRequestJson, SpdFile>()
                .ForMember(d => d.Content, opt => opt.MapFrom(s => Encoding.ASCII.GetBytes(s.Body)));

            CreateMap<SpdFile, DownloadFileResponse>()
                .ForMember(d => d.Body, opt => opt.MapFrom(s => Encoding.ASCII.GetString(s.Content)))
                .ForMember(d => d.Key, opt => opt.MapFrom(s => s.Key));
        }
    }
}
