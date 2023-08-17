using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Applicants.Invoice;
internal class InvoiceRepository : IInvoiceRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;

    public InvoiceRepository(IDynamicsContextFactory ctx,
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
            Items = _mapper.Map<IEnumerable<InvoiceResp>>(invoices)
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
        spd_application app = await _context.GetApplicationById(c.ApplicationId, ct);
        spd_portaluser user = await _context.GetUserById(c.PortalUserId, ct);
        spd_delegate d = _mapper.Map<spd_delegate>(c);
        _context.AddTospd_delegates(d);
        _context.SetLink(d, nameof(d.spd_ApplicationId), app);
        _context.SetLink(d, nameof(d.spd_PortalUserId), user);

        await _context.SaveChangesAsync(ct);
        return _mapper.Map<InvoiceResp>(d);
    }

}


