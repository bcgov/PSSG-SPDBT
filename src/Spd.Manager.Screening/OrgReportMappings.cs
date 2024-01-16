using AutoMapper;
using Spd.Resource.Organizations.Report;

namespace Spd.Manager.Screening
{
    internal class OrgReportMappings : Profile
    {
        public OrgReportMappings()
        {
            CreateMap<OrgReportResult, OrgReportResponse>();
        }
    }
}
