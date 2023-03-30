using AutoMapper;
using Spd.Presentation.Dynamics.Models;
using Spd.Utilities.FileStorage;
using System.Text;
using File = Spd.Utilities.FileStorage.File;

namespace Spd.Presentation.Dynamics.Mapper
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<UploadFileRequest, File>()
                .ForMember(d => d.Content, opt => opt.Ignore())
                .ForMember(d => d.Metadata, opt => opt.MapFrom(s => GetMetadata(s)))
                .ForMember(d => d.Tags, opt => opt.MapFrom(s => GetTags(s)));

            CreateMap<UploadFileRequestJson, File>()
                .ForMember(d => d.Content, opt => opt.MapFrom(s => Encoding.ASCII.GetBytes(s.Body)));

            CreateMap<File, DownloadFileResponse>()
                .ForMember(d => d.Body, opt => opt.MapFrom(s => Encoding.ASCII.GetString(s.Content)))
                .ForMember(d => d.Key, opt => opt.MapFrom(s => s.Key));
        }

        private static IEnumerable<Tag> GetTags(UploadFileRequest request)
        {
            List<Tag> tags = new List<Tag>();
            if (!string.IsNullOrWhiteSpace(request.Tag1)) tags.Add(new Tag { Key = "tag1", Value = request.Tag1 });
            if (!string.IsNullOrWhiteSpace(request.Tag2)) tags.Add(new Tag { Key = "tag2", Value = request.Tag2 });
            if (!string.IsNullOrWhiteSpace(request.Tag3)) tags.Add(new Tag { Key = "tag3", Value = request.Tag3 });
            return tags;
        }
        private static IEnumerable<Metadata> GetMetadata(UploadFileRequest request)
        {
            List<Metadata> metadata = new List<Metadata>
            {
                new Metadata{ Key = "entityId", Value = request.EntityId.ToString() },
                new Metadata{ Key = "entityName", Value = request.EntityName},
                new Metadata{ Key = "classification", Value= request.Classification}
            };
            return metadata.AsEnumerable();
        }
    }
}
