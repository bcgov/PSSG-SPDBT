using AutoMapper;
using Microsoft.Dynamics.CRM;

namespace Spd.Resource.Applicants.BulkHistory
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<spd_genericupload, BulkHistoryResp>()
            .ForMember(d => d.Id, opt => opt.MapFrom(s => s.spd_genericuploadid))
            .ForMember(d => d.BatchNumber, opt => opt.MapFrom(s => s.spd_batchnumber))
            .ForMember(d => d.FileName, opt => opt.MapFrom(s => s.spd_filename))
            .ForMember(d => d.UploadedDateTime, opt => opt.MapFrom(s => s.spd_datetimeuploaded))
            .ForMember(d => d.UploadedByUserFullName, opt => opt.MapFrom(s => s.spd_UploadedBy.spd_fullname));
        }

    }
}
