using AutoMapper;
using Spd.Resource.Organizations.Report;
using Spd.Utilities.Shared.Tools;

namespace Spd.Manager.Membership.Report
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<OrgReportResult, OrgReportResponse>()
              .ForMember(d => d.ReportDate, opt => opt.MapFrom(s => (s.ReportDate).ToDateOnly(TimeZoneInfo.Utc)));
        }
    }
}
