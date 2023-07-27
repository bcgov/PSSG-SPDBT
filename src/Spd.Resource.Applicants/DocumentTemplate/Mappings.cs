using AutoMapper;
using Microsoft.Dynamics.CRM;

namespace Spd.Resource.Applicants.DocumentTemplate
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<bcgov_GenerateDocumentWithAEMResponse, GeneratedDocumentResp>()
                .ForMember(d => d.FileName, opt => opt.MapFrom(s => s.FileName))
                .ForMember(d => d.ContentType, opt => opt.MapFrom(s => s.MimeType))
                .ForMember(d => d.Content, opt => opt.MapFrom(s => GetFileContent(s)));
        }

        private byte[] GetFileContent(bcgov_GenerateDocumentWithAEMResponse resp)
        {
            if (resp.IsSuccess == null || !(bool)resp.IsSuccess) return Array.Empty<byte>();

            return Convert.FromBase64String(resp.Body);
        }
    }
}
