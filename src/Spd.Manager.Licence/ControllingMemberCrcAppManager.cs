using AutoMapper;
using MediatR;
using Spd.Resource.Repository.ControllingMemberCrcApplication;
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
    protected readonly IMapper _mapper;

    public ControllingMemberCrcAppManager(IMapper mapper)
    {
        _mapper = mapper;
    }

    public async Task<ControllingMemberCrcAppCommandResponse> Handle(ControllingMemberCrcAppSubmitRequestCommand cmd, CancellationToken ct)
    {
        ControllingMemberCrcAppSubmitRequest request = cmd.ControllingMemberCrcAppSubmitRequest;
        //save the application
        CreateControllingMemberCrcAppCmd createApp = _mapper.Map<CreateControllingMemberCrcAppCmd>(request);
        //var response = await _controllingMemberCrcAppRepository.CreateControllingMemberCrcApplicationAsync(createApp, ct);
        
        throw new NotImplementedException();
    }
}
