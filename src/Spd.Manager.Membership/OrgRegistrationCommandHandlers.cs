using Microsoft.Extensions.DependencyInjection;
using Spd.Infrastructure.Common;
using Spd.Manager.Membership.ViewModels;
using Spd.Utilities.Messaging.Contract;
using SPD.DynamicsProxy;

namespace Spd.Manager.Membership
{
    public class OrgRegistrationCommandHandlers
    {
        public async Task Handle(CreateOrgRegistrationCommand createOrgRegistrationCommand, AppExecutionContext ctx)
        {
            var crmCtx = ctx.Services.GetRequiredService<IDynamicsContextFactory>().Create();

        }
    }
    public record CreateOrgRegistrationCommand(OrgRegistrationCreateRequest CreateOrgRegistrationRequest) : Command;
}
