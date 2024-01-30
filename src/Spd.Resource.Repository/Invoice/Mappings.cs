using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.Invoice
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<spd_invoice, InvoiceResp>()
            .ForMember(d => d.Id, opt => opt.MapFrom(s => s.spd_invoiceid))
            .ForMember(d => d.SiteNumber, opt => opt.MapFrom(s => s.spd_OrganizationId.spd_cassitenumber))
            .ForMember(d => d.PartyNumber, opt => opt.MapFrom(s => s.spd_OrganizationId.spd_caspartynumber))
            .ForMember(d => d.AccountNumber, opt => opt.MapFrom(s => s.spd_OrganizationId.spd_casaccountnumber))
            .ForMember(d => d.InvoiceStatus, opt => opt.MapFrom(s => GetInvoiceStatus(s.statuscode)))
            .ForMember(d => d.NumberOfApplications, opt => opt.MapFrom(s => s.spd_numberofapplications))
            .ForMember(d => d.TotalAmount, opt => opt.MapFrom(s => s.spd_totalamount))
            .ForMember(d => d.OrganizationId, opt => opt.MapFrom(s => s._spd_organizationid_value))
            .ForMember(d => d.TransactionDate, opt => opt.MapFrom(s => s.spd_castransactiondate))
            .ForMember(d => d.InvoiceNumber, opt => opt.MapFrom(s => s.spd_castransactionid))
            .ForMember(d => d.GlDate, opt => opt.MapFrom(s => new DateTimeOffset(s.spd_gldate.Value.Year, s.spd_gldate.Value.Month, s.spd_gldate.Value.Day, 0, 0, 0, TimeSpan.Zero)))
            .ForMember(d => d.Comments, opt => opt.MapFrom(s => s.spd_comments))
            ;
        }

        private static InvoiceStatusEnum GetInvoiceStatus(int? optionset)
        {
            if (optionset == null) return InvoiceStatusEnum.Draft;
            return Enum.Parse<InvoiceStatusEnum>(Enum.GetName(typeof(InvoiceStatusOptionSet), optionset));
        }
    }
}
