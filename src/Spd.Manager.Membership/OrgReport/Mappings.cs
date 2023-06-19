using AutoMapper;
using Spd.Resource.Organizations.Report;

namespace Spd.Manager.Membership.Report
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<OrgReportResult, OrgReportResponse>();
            CreateMap<ReportFileResp, ReportFileResponse>();

        }
    }
}
