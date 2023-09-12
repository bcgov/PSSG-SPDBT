using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Applicants.Invoice;
internal class PortalUserRepository : IInvoiceRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;

    public PortalUserRepository(IDynamicsContextFactory ctx,
        IMapper mapper)
    {
        _context = ctx.Create();
        _mapper = mapper;
    }

    public async Task<InvoiceListResp> QueryAsync(InvoiceQry qry, CancellationToken ct)
    {
        IQueryable<spd_invoice> invoices = _context.spd_invoices
            .Expand(d => d.spd_OrganizationId);

        if (!qry.IncludeInactive)
            invoices = invoices.Where(d => d.statecode != DynamicsConstants.StateCode_Inactive);
        if (qry.OrganizationId != null) invoices = invoices.Where(d => d._spd_organizationid_value == qry.OrganizationId);
        if (qry.InvoiceStatus != null)
        {
            int status = (int)Enum.Parse<InvoiceStatusOptionSet>(qry.InvoiceStatus.ToString());
            invoices = invoices.Where(d => d.statuscode == status);
        }
        return new InvoiceListResp
        {
            Items = _mapper.Map<IEnumerable<InvoiceResp>>(invoices.ToList())
        };
    }

    public async Task<InvoiceResp> ManageAsync(InvoiceCmd cmd, CancellationToken ct)
    {
        return cmd switch
        {
            UpdateInvoiceCmd c => await UpdateInvoiceAsync(c, ct),
            _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
        };
    }

    private async Task<InvoiceResp> UpdateInvoiceAsync(UpdateInvoiceCmd c, CancellationToken ct)
    {
        spd_invoice? invoice = await _context.spd_invoices
            .Where(i => i.spd_invoiceid == c.InvoiceId)
            .FirstOrDefaultAsync();
        if (invoice == null)
            throw new InvalidOperationException("Cannot find the correct invoice.");
        if (c.InvoiceStatus != null)
        {
            int status = (int)Enum.Parse<InvoiceStatusOptionSet>(c.InvoiceStatus.ToString());
            invoice.statuscode = status;
            if (status == (int)InvoiceStatusOptionSet.Paid || status == (int)InvoiceStatusOptionSet.Cancelled)
            {
                invoice.statecode = DynamicsConstants.StateCode_Inactive;
            }
        }
        if (c.InvoiceNumber != null) invoice.spd_castransactionid = c.InvoiceNumber;
        if (c.CasResponse != null) invoice.spd_casresponse = c.CasResponse;
        _context.UpdateObject(invoice);
        await _context.SaveChangesAsync(ct);
        return _mapper.Map<InvoiceResp>(invoice);
    }

}


