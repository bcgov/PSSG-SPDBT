using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using Spd.Resource.Repository.Contact;
using Spd.Resource.Repository.Identity;
using Spd.Resource.Repository.Registration;

namespace Spd.Manager.Licence;
internal class BizProfileManager :
        IRequestHandler<BizLoginCommand, BizUserLoginResponse>,
        IRequestHandler<GetBizProfileQuery, BizProfileResponse>,
        IRequestHandler<BizTermAgreeCommand, Unit>,
        IRequestHandler<BizProfileUpdateCommand, Unit>,
        IBizProfileManager
{

    private readonly ILogger<IFeeManager> _logger;
    private readonly IIdentityRepository _idRepository;
    private readonly IMapper _mapper;

    public BizProfileManager(
        ILogger<IFeeManager> logger,
        IIdentityRepository idRepository,
        IMapper mapper)
    {
        _mapper = mapper;
        _logger = logger;
        this.idRepository = idRepository;
    }

    public async Task<BizUserLoginResponse> Handle(BizLoginCommand cmd, CancellationToken ct)
    {
        ContactResp? contactResp = null;
        var result = await _idRepository.Query(new IdentityQry(cmd.BcscIdentityInfo.Sub, null, IdentityProviderTypeEnum.BcServicesCard), ct);

        if (result == null || !result.Items.Any()) //first time to use system
        {
            //add identity
            var id = await _idRepository.Manage(new CreateIdentityCmd(cmd.BcscIdentityInfo.Sub, null, IdentityProviderTypeEnum.BcServicesCard), ct);
            CreateContactCmd createContactCmd = _mapper.Map<CreateContactCmd>(cmd);
            createContactCmd.IdentityId = id.Id;
            contactResp = await _contactRepository.ManageAsync(createContactCmd, ct);
        }
        else
        {
            Identity? id = result.Items.FirstOrDefault();
            if (id?.ContactId != null)
            {
                //contact exists
                UpdateContactCmd updateContactCmd = _mapper.Map<UpdateContactCmd>(cmd);
                updateContactCmd.Id = (Guid)id.ContactId;
                updateContactCmd.IdentityId = id.Id;
                contactResp = await _contactRepository.ManageAsync(updateContactCmd, ct);
            }
            else
            {
                //there is identity, but no contact
                CreateContactCmd createContactCmd = _mapper.Map<CreateContactCmd>(cmd);
                createContactCmd.IdentityId = id.Id;
                contactResp = await _contactRepository.ManageAsync(createContactCmd, ct);
            }
        }
        return _mapper.Map<ApplicantLoginResponse>(contactResp);
        return new BizUserLoginResponse
        {
            BizUserId = Guid.NewGuid(),
        };
    }

    public Task<BizProfileResponse> Handle(GetBizProfileQuery query, CancellationToken ct)
    {
        throw new NotImplementedException();
    }

    public Task<Unit> Handle(BizTermAgreeCommand cmd, CancellationToken ct)
    {
        throw new NotImplementedException();
    }

    public Task<Unit> Handle(BizProfileUpdateCommand cmd, CancellationToken ct)
    {
        throw new NotImplementedException();
    }
}
