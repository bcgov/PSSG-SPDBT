using AutoMapper;
using Microsoft.Dynamics.CRM;

namespace Spd.Resource.Applicants.Invoice
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<UpdateInvoiceCmd, spd_invoice>()
            //.ForMember(d => d.spd_delegateid, opt => opt.MapFrom(s => Guid.NewGuid()))
            //.ForMember(d => d.spd_role, opt => opt.MapFrom(s => (int)Enum.Parse<PSSOUserRoleOptionSet>(s.PSSOUserRoleCode.ToString())))
            //.ForMember(d => d.spd_fullname, opt => opt.MapFrom(s => s.Name));
            ;

            _ = CreateMap<spd_invoice, InvoiceResp>()
            .ForMember(d => d.Id, opt => opt.MapFrom(s => s.spd_invoiceid))
            .ForMember(d => d.SiteNumber, opt => opt.MapFrom(s => s.spd_OrganizationId.spd_cassitenumber))
            .ForMember(d => d.PartyNumber, opt => opt.MapFrom(s => s.spd_OrganizationId.spd_caspartynumber))
            .ForMember(d => d.AccountNumber, opt => opt.MapFrom(s => s.spd_OrganizationId.spd_casaccountnumber))
            .ForMember(d => d.InvoiceStatus, opt => opt.MapFrom(s => s.statuscode))
            .ForMember(d => d.NumberOfApplications, opt => opt.MapFrom(s => s.spd_numberofapplications))
            .ForMember(d => d.TotalAmount, opt => opt.MapFrom(s => s.spd_totalamount))
            .ForMember(d => d.OrganizationId, opt => opt.MapFrom(s => s._spd_organizationid_value))
            //.ForMember(d => d.TransactionDate, opt => opt.MapFrom(s => s.spd_d))
            //.ForMember(d => d.InvoiceNumber, opt => opt.MapFrom(s => s.spd_d))
            .ForMember(d => d.GlDate, opt => opt.MapFrom(s => s.spd_gldate))
            .ForMember(d => d.Comments, opt => opt.MapFrom(s => s.spd_comments))
            ;
        }
    }
}
