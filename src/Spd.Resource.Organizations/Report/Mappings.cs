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
            .ForMember(d => d.ReportName, opt => opt.MapFrom(s => "Monthly Screening Report - May 2023 " + s.spd_name));
        }
    }
}