using AutoMapper;
using Spd.Resource.Repository.User;

namespace Spd.Manager.Licence;
internal class BizPortalUserMapping : Profile
{
    public BizPortalUserMapping()
    {
        CreateMap<BizPortalUserCreateRequest, User>();
        CreateMap<BizPortalUserCreateRequest, UserResult>()
            .ForMember(d => d.Id, opt => opt.Ignore())
            .IncludeBase<BizPortalUserCreateRequest, User>();
    }
}
