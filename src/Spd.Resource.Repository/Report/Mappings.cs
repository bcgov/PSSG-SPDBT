using AutoMapper;
using Microsoft.Dynamics.CRM;

namespace Spd.Resource.Repository.Report
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<spd_pdfreport, OrgReportResult>()
            .ForMember(d => d.Id, opt => opt.MapFrom(s => s.spd_pdfreportid))
            .ForMember(d => d.ReportDate, opt => opt.MapFrom(s => s.spd_reportdate != null ? new DateOnly(s.spd_reportdate.Value.Year, s.spd_reportdate.Value.Month, s.spd_reportdate.Value.Day) : (DateOnly?)null));
        }
    }
}