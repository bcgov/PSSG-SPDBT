using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Resource.Repository.JobSchedule.GeneralizeScheduleJob;

namespace Spd.Resource.Repository.JobSchedule.Org
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<spd_MonthlyInvoiceResponse, ResultResp>()
                 .ForMember(d => d.ResultStr, opt => opt.MapFrom(s => s.Result))
                 ;

            _ = CreateMap<spd_OrgMonthlyReportResponse, ResultResp>()
                 .ForMember(d => d.ResultStr, opt => opt.MapFrom(s => s.Result))
                 ;
        }
    }
}
