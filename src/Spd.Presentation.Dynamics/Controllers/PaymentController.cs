using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Payment;
using Spd.Utilities.Shared;
using System.Configuration;

namespace Spd.Presentation.Dynamics.Controllers;

/// <summary>
/// Payment support for dynamics
/// </summary>
[Authorize]
public class PaymentController : SpdControllerBase
{
    private readonly IMediator _mediator;
    private readonly IConfiguration _configuration;

    public PaymentController(IMediator mediator, IConfiguration configuration) : base()
    {
        _mediator = mediator;
        _configuration = configuration;
    }

    /// <summary>
    /// Get a pre payment link
    /// </summary>
    /// <param name="applicationId">the GUID of the screening application</param>
    /// <param name="ct">cancellation token, generated by dotnetcore</param>
    /// <response code="200">Ok, with the correct link generated</response>
    /// <response code="403">if the application cannot be found</response>
    /// <returns>
    /// </returns>
    [HttpGet]
    [Route("api/pre-payment-link/{applicationId}")]
    public async Task<PrePaymentLinkResponse> GetPrePaymentLinkAsync(
        [FromRoute] Guid applicationId,
        CancellationToken ct)
    {
        string? screeningHostUrl = _configuration.GetValue<string>("ScreeningHostUrl");
        string? screeningPaymentPath = _configuration.GetValue<string>("ScreeningAppPaymentPath");
        if (screeningHostUrl == null || screeningPaymentPath == null)
        {
            throw new ConfigurationErrorsException("ScreeningHostUrl or screeningPaymentPath is not set correctly.");
        }

        string? licensingHostUrl = _configuration.GetValue<string>("LicensingHostUrl");
        string? licensingPaymentPath = _configuration.GetValue<string>("LicensingAppPaymentPath");
        if (licensingHostUrl == null || licensingPaymentPath == null)
        {
            throw new ConfigurationErrorsException("ScreeningHostUrl or screeningPaymentPath is not set correctly.");
        }

        return await _mediator.Send(new PrePaymentLinkCreateCommand(applicationId,
            $"{screeningHostUrl}{screeningPaymentPath}",
            $"{licensingHostUrl}{licensingPaymentPath}"), ct);

    }

    /// <summary>
    /// Payment refund
    /// </summary>
    /// <param name="paymentId">the GUID of the payment</param>
    /// <param name="ct">cancellation token, generated by dotnetcore</param>
    /// <response code="200">Ok, refund request processed</response>
    /// <response code="403">if the payment cannot be found or payment is in wrong status</response>
    /// <returns>
    /// </returns>
    [HttpGet]
    [Route("api/payment/{paymentId}/refund")]
    public async Task<PaymentRefundResponse> RefundPaymentAsync(
        [FromRoute] Guid paymentId,
        CancellationToken ct)
    {
        return await _mediator.Send(new PaymentRefundCommand(paymentId), ct);
    }

    /// <summary>
    /// Payment create invoices in CAS
    /// </summary>
    /// <param name="ct">cancellation token, generated by dotnetcore</param>
    /// <response code="200">Ok,create invoices request processed</response>
    /// <returns>
    /// </returns>
    [HttpGet]
    [Route("api/payment/invoices/create-in-cas")]
    public async Task<CreateInvoicesInCasResponse> CreateInvoiceInCasAsync(CancellationToken ct)
    {
        return await _mediator.Send(new CreateInvoicesInCasCommand(), ct);
    }

    /// <summary>
    /// Payment create invoices in CAS
    /// </summary>
    /// <param name="ct">cancellation token, generated by dotnetcore</param>
    /// <response code="200">Ok,create invoices request processed</response>
    /// <returns>
    /// </returns>
    [HttpGet]
    [Route("api/payment/invoices/create-one-in-cas/{invoiceId}")]
    public async Task<CreateOneInvoiceInCasResponse> CreateOneInvoiceInCasAsync([FromRoute] Guid invoiceId, CancellationToken ct)
    {
        return await _mediator.Send(new CreateOneInvoiceInCasCommand(invoiceId), ct);
    }

    /// <summary>
    /// Payment update invoices status from CAS
    /// </summary>
    /// <param name="ct">cancellation token, generated by dotnetcore</param>
    /// <response code="200">Ok,create invoices request processed</response>
    /// <returns>
    /// </returns>
    [HttpGet]
    [Route("api/payment/invoices/update-from-cas")]
    public async Task<UpdateInvoicesFromCasResponse> UpdateInvoiceFromCasAsync(CancellationToken ct)
    {
        return await _mediator.Send(new UpdateInvoicesFromCasCommand(), ct);
    }
}
