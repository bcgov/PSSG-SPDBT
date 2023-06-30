using AutoMapper;
using Microsoft.Dynamics.CRM;

namespace Spd.Resource.Applicants.Incident
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<bcgov_documenturl, IncidentResp>();
            //.ForMember(d => d.DocumentType, opt => opt.MapFrom(s => GetDocumentType(s)))
            //.ForMember(d => d.UploadedDateTime, opt => opt.MapFrom(s => s.bcgov_receiveddate))
            //.ForMember(d => d.DocumentUrlId, opt => opt.MapFrom(s => s.bcgov_documenturlid))
            //.ForMember(d => d.ClearanceId, opt => opt.MapFrom(s => s._spd_clearanceid_value))
            //.ForMember(d => d.ApplicationId, opt => opt.MapFrom(s => s._spd_applicationid_value))
            //.ForMember(d => d.ReportId, opt => opt.MapFrom(s => s._spd_pdfreportid_value))
            //.ForMember(d => d.FileName, opt => opt.MapFrom(s => s.bcgov_filename));
        }
    }
}
