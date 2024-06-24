using AutoMapper;
using MediatR;
using Spd.Resource.Repository.Identity;
using Spd.Resource.Repository.Org;
using Spd.Resource.Repository.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Spd.Manager.Licence;
internal class BizPortalUserManager
    : IRequestHandler<BizPortalUserCreateCommand, BizPortalUserResponse>,
    IBizPortalUserManager
{
    private readonly IMapper _mapper;

    public BizPortalUserManager(IMapper mapper)
    {
        _mapper = mapper;
    }

    public async Task<BizPortalUserResponse> Handle(BizPortalUserCreateCommand request, CancellationToken ct)
    {
        
    }
}
