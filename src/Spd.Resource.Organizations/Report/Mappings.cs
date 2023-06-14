using AutoMapper;
using Microsoft.Dynamics.CRM;

namespace Spd.Resource.Organizations.Report
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<spd_pdfreport, OrgReportResult>()
            .ForMember(d => d.Id, opt => opt.MapFrom(s => s.spd_pdfreportid))
            .ForMember(d => d.ReportDate, opt => opt.MapFrom(s => new DateTimeOffset(s.spd_reportdate.Value.Year, s.spd_reportdate.Value.Month, s.spd_reportdate.Value.Day, 0, 0, 0, TimeSpan.Zero)));
        }
    }
}