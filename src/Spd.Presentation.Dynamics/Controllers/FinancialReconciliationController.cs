using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.FinanceReconciliation;

namespace Spd.Presentation.Dynamics.Controllers;

[ApiController]
[Authorize]
public class FinancialReconciliationController : ControllerBase
{
    private readonly IMediator _mediator;

    public FinancialReconciliationController(IMediator mediator) : base()
    {
        _mediator = mediator;
    }

    [HttpPost]
    [Route("api/financial-reconciliation/success-payments")]
    public async Task<SuccessPaymentResultProcessResponse> SubmitSuccessPaymentResults([FromBody] List<DuplicatedPaymentApplicationInfo> paymentResults, CancellationToken ct)
    {
        return await _mediator.Send(new GetDuplicatedApplicationNumberCommand(paymentResults), ct);
    }
}