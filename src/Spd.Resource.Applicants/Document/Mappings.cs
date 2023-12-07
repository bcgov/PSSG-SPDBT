using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.OData.Edm;
using Spd.Resource.Applicants.Application;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Tools;

namespace Spd.Resource.Applicants.Document
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<bcgov_documenturl, DocumentResp>()
            .ForMember(d => d.DocumentType, opt => opt.MapFrom(s => GetDocumentType(s)))
            .ForMember(d => d.DocumentType2, opt => opt.MapFrom(s => GetDocumentType2(s)))
            .ForMember(d => d.UploadedDateTime, opt => opt.MapFrom(s => s.bcgov_receiveddate))
            .ForMember(d => d.DocumentUrlId, opt => opt.MapFrom(s => s.bcgov_documenturlid))
            .ForMember(d => d.ClearanceId, opt => opt.MapFrom(s => s._spd_clearanceid_value))
            .ForMember(d => d.CaseId, opt => opt.MapFrom(s => s._bcgov_caseid_value))
            .ForMember(d => d.ApplicationId, opt => opt.MapFrom(s => s._spd_applicationid_value))
            .ForMember(d => d.ReportId, opt => opt.MapFrom(s => s._spd_pdfreportid_value))
            .ForMember(d => d.FileName, opt => opt.MapFrom(s => s.bcgov_filename))
            .ForMember(d => d.FileExtension, opt => opt.MapFrom(s => FileHelper.GetFileExtensionWithoutDot(s.bcgov_fileextension)))
            .ForMember(d => d.ExpiryDate, opt => opt.MapFrom(s => SharedMappingFuncs.GetDateOnly(s.spd_expirydate)));

            _ = CreateMap<SpdTempFile, bcgov_documenturl>()
            .ForMember(d => d.bcgov_documenturlid, opt => opt.MapFrom(s => Guid.NewGuid()))
            .ForMember(d => d.bcgov_filename, opt => opt.MapFrom(s => s.FileName))
            .ForMember(d => d.bcgov_filesize, opt => opt.MapFrom(s => $"{Math.Round((decimal)s.FileSize / 1024, 2)} KB"))
            .ForMember(d => d.bcgov_origincode, opt => opt.MapFrom(s => BcGovOriginCode.Web))
            .ForMember(d => d.bcgov_receiveddate, opt => opt.MapFrom(s => DateTimeOffset.UtcNow))
            .ForMember(d => d.bcgov_fileextension, opt => opt.MapFrom(s => FileHelper.GetFileExtension(s.FileName)));
        }

        private static DocumentTypeEnum? GetDocumentType(bcgov_documenturl documenturl)
        {
            string? docType = DynamicsContextLookupHelpers.BcGovTagDictionary
                .FirstOrDefault(t => t.Value == documenturl._bcgov_tag1id_value).Key;
            if (docType == null) { return null; }
            return Enum.Parse<DocumentTypeEnum>(docType);
        }

        private static DocumentTypeEnum? GetDocumentType2(bcgov_documenturl documenturl)
        {
            string? docType = DynamicsContextLookupHelpers.BcGovTagDictionary
                .FirstOrDefault(t => t.Value == documenturl._bcgov_tag2id_value).Key;
            if (docType == null) { return null; }
            return Enum.Parse<DocumentTypeEnum>(docType);
        }
    }
}
