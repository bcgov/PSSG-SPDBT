using AutoMapper;
using MediatR;
using Spd.Resource.Repository.BizLicApplication;
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
    private readonly IControllingMemberCrcRepository _controllingMemberCrcRepository;


    public ControllingMemberCrcAppManager(IMapper mapper,
        IControllingMemberCrcRepository controllingMemberCrcRepository)
    {
        _mapper = mapper;
        _controllingMemberCrcRepository = controllingMemberCrcRepository;
    }

    public async Task<ControllingMemberCrcAppCommandResponse> Handle(ControllingMemberCrcAppSubmitRequestCommand cmd, CancellationToken ct)
    {

        ControllingMemberCrcAppSubmitRequest request = cmd.ControllingMemberCrcAppSubmitRequest;
        //save the application
        CreateControllingMemberCrcAppCmd createApp = _mapper.Map<CreateControllingMemberCrcAppCmd>(request);
        var response = await _controllingMemberCrcRepository.CreateControllingMemberCrcApplicationAsync(createApp, ct);

        return new ControllingMemberCrcAppCommandResponse
        {
            ControllingMemberAppId = response.ControllingMemberCrcAppId
        };
    }
}
