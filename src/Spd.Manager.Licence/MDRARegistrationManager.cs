using MediatR;

namespace Spd.Manager.Licence;
internal class MDRARegistrationManager :
        IRequestHandler<MDRARegistrationNewCommand, MDRARegistrationCommandResponse>,
        IRequestHandler<MDRARegistrationRenewCommand, MDRARegistrationCommandResponse>,
        IRequestHandler<MDRARegistrationUpdateCommand, MDRARegistrationCommandResponse>,
        IMDRARegistrationManager
{
    public MDRARegistrationManager()
    {
    }

    #region anonymous
    public async Task<MDRARegistrationCommandResponse> Handle(MDRARegistrationNewCommand cmd, CancellationToken ct)
    {
        return new MDRARegistrationCommandResponse { OrgRegistrationId = Guid.Empty };
    }

    public async Task<MDRARegistrationCommandResponse> Handle(MDRARegistrationRenewCommand cmd, CancellationToken ct)
    {
        return new MDRARegistrationCommandResponse { OrgRegistrationId = Guid.Empty };
    }

    public async Task<MDRARegistrationCommandResponse> Handle(MDRARegistrationUpdateCommand cmd, CancellationToken ct)
    {
        return new MDRARegistrationCommandResponse { OrgRegistrationId = Guid.Empty };
    }
    #endregion

}
