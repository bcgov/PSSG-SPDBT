using MediatR;

namespace Spd.Manager.Common.Admin;

internal partial class AdminManager
: IRequestHandler<SendToPrintCommand, PrintJobResponse>,
  IRequestHandler<PrintJobStatusQuery, PrintJobStatusResponse>
{
    public Task<PrintJobResponse> Handle(SendToPrintCommand request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public Task<PrintJobStatusResponse> Handle(PrintJobStatusQuery request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}
