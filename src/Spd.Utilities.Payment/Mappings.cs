using AutoMapper;

namespace Spd.Utilities.Payment
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<CreateInvoiceCmd, CreateInvoiceRequest>()
                .ForMember(d => d.TransactionNumber, opt => opt.MapFrom(s => string.Empty))
                .ForMember(d => d.Lines, opt => opt.MapFrom(s => s.Lines));
            CreateMap<InvoiceLine, Line>()
                 .ForMember(d => d.LineNumber, o => o.MapFrom(s => s.LineNumber));
            CreateMap<CreateInvoiceResp, CreateInvoiceResult>();
        }
    }


}
