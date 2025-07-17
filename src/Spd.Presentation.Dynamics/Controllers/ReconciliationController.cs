using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.FinanceReconciliation;

namespace Spd.Presentation.Dynamics.Controllers;

[ApiController]
[Authorize]
public class ReconciliationController : ControllerBase
{
    private readonly IMediator _mediator;

    public ReconciliationController(IMediator mediator) : base()
    {
        _mediator = mediator;
    }

    [HttpPost]
    [Route("api/financial-reconciliation/success-payments")]
    public async Task<SuccessPaymentResultProcessResponse> SubmitSuccessPaymentResults([FromBody] List<DuplicatedPaymentApplicationInfo> paymentResults, CancellationToken ct)
    {
        return await _mediator.Send(new GetDuplicatedApplicationNumberCommand(paymentResults), ct);
    }

    [HttpGet]
    [Route("api/printing-reconciliation/addresses")]
    public async Task<IEnumerable<CardPrintAddressReconcilationResponse>> CardPrintAddressReconcilation(CancellationToken ct)
    {
        return await _mediator.Send(new CardPrintAddressReconcilationCommand(), ct);
    }
}