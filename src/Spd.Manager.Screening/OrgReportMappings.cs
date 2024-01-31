using AutoMapper;
using Spd.Resource.Repository.Report;

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
