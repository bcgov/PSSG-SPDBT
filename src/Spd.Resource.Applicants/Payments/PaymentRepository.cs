using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Applicants.Payment;
internal class PaymentRepository : IPaymentRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;
    public PaymentRepository(IDynamicsContextFactory ctx,
        IMapper mapper)
    {
        _context = ctx.Create();
        _mapper = mapper;
    }
    public async Task<PaymentListResp> QueryAsync(PaymentQry qry, CancellationToken ct)
    {
        var payments = _context.spd_payments
            .Expand(p => p.spd_ApplicationId)
            .Where(p => p.statecode != DynamicsConstants.StateCode_Inactive);

        if (qry.ApplicationId != null)
            payments = payments.Where(d => d._spd_applicationid_value == qry.ApplicationId);

        if (qry.PaymentId != null)
            payments = payments.Where(d => d.spd_paymentid == qry.PaymentId);

        var result = await payments.GetAllPagesAsync(ct);
        result = result.OrderByDescending(a => a.createdon);

        return new PaymentListResp
        {
            Items = _mapper.Map<IEnumerable<PaymentResp>>(result)
        };
    }
    public async Task<Guid> ManageAsync(PaymentCmd cmd, CancellationToken ct)
    {
        return cmd switch
        {
            UpdatePaymentCmd c => await PaymentUpdateAsync(c, ct),
            CreatePaymentCmd c => await PaymentCreateAsync(c, ct),
            _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
        };
    }

    private async Task<Guid> PaymentCreateAsync(CreatePaymentCmd cmd, CancellationToken ct)
    {
        spd_application? application = await _context.GetApplicationById(cmd.ApplicationId, ct);
        if (application == null)
            throw new ArgumentException("invalid application id");

        spd_payment payment = _mapper.Map<spd_payment>(cmd);
        _context.AddTospd_payments(payment);
        _context.SetLink(payment, nameof(payment.spd_ApplicationId), application);
        await _context.SaveChangesAsync(ct);
        return (Guid)payment.spd_paymentid;
    }
    private async Task<Guid> PaymentUpdateAsync(UpdatePaymentCmd cmd, CancellationToken ct)
    {
        spd_payment? payment = await _context.GetPaymentById(cmd.PaymentId, ct);
        if (payment == null)
            throw new ArgumentException("invalid payment id");

        if (payment.spd_transactionid != cmd.TransNumber)
            throw new ArgumentException("invalid payment transaction");

        payment = _mapper.Map<UpdatePaymentCmd, spd_payment>(cmd, payment);
        _context.UpdateObject(payment);
        await _context.SaveChangesAsync(ct);
        return (Guid)payment.spd_paymentid;
    }


}


