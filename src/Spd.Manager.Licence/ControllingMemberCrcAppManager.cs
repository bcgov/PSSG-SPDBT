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
        //ValidateFilesForNewApp(cmd);

        //save the application
        CreateControllingMemberCrcAppCmd createApp = _mapper.Map<CreateControllingMemberCrcAppCmd>(request);
        
        //var response = await _personLicAppRepository.CreateLicenceApplicationAsync(createApp, cancellationToken);
        //await UploadNewDocsAsync(request.DocumentExpiredInfos, cmd.LicAppFileInfos, response.LicenceAppId, response.ContactId, null, null, null, null, null, cancellationToken);
        throw new NotImplementedException();
    }
}
