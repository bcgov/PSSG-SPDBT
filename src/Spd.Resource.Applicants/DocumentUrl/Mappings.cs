using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Applicants.DocumentUrl
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<bcgov_documenturl, DocumentUrlResp>()
            .ForMember(d => d.DocumentType, opt => opt.MapFrom(s => GetDocumentType(s)))
            .ForMember(d => d.UploadedDateTime, opt => opt.MapFrom(s => s.createdon))
            .ForMember(d => d.DocumentUrlId, opt => opt.MapFrom(s => s.bcgov_documenturlid))
            .ForMember(d => d.ClearanceId, opt => opt.MapFrom(s => s._spd_clearanceid_value))
            .ForMember(d => d.ApplicationId, opt => opt.MapFrom(s => s._spd_applicationid_value))
            .ForMember(d => d.ReportId, opt => opt.MapFrom(s => s._spd_pdfreportid_value))
            .ForMember(d => d.FileName, opt => opt.MapFrom(s => s.bcgov_filename));

        }

        private static DocumentTypeEnum? GetDocumentType(bcgov_documenturl documenturl)
        {
            string? docType = DynamicsContextLookupHelpers.BcGovTagDictionary
                .FirstOrDefault(t => (t.Value == documenturl._bcgov_tag1id_value || t.Value==documenturl._bcgov_tag2id_value || t.Value==documenturl._bcgov_tag3id_value)).Key;
            if (docType == null) { return null; }
            return Enum.Parse<DocumentTypeEnum>(docType);
        }

    }
}
