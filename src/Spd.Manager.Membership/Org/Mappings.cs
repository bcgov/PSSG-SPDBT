using AutoMapper;
using Spd.Resource.Organizations.Org;

namespace Spd.Manager.Membership.Org
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<OrgUpdateRequest, OrgUpdateCommand>();
            CreateMap<OrgResp, OrgResponse>();
        }
    }
}
