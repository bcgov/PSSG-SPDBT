using AutoMapper;
using Microsoft.Dynamics.CRM;

namespace Spd.Resource.Repository.JobSchedule.Org
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<spd_MonthlyInvoiceResponse, ResultResp>()
                 .ForMember(d => d.ResultStr, opt => opt.MapFrom(s => s.Result))
                 ;
        }
    }
}
