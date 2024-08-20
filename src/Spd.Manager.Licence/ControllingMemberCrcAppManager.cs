using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Spd.Manager.Licence;
internal class ControllingMemberCrcAppManager :
        IRequestHandler<ControllingMemberCrcAppSubmitRequestCommand, ControllingMemberCrcAppCommandResponse>,
        IControllingMemberCrcAppManager

{
    public async Task<ControllingMemberCrcAppCommandResponse> Handle(ControllingMemberCrcAppSubmitRequestCommand cmd, CancellationToken ct)
    {
        throw new NotImplementedException();
    }
}
