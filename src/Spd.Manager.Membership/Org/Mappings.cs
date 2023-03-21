using AutoMapper;
using Spd.Resource.Organizations.Org;

namespace Spd.Manager.Membership.Org
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<OrgUpdateRequest, OrgUpdateCmd>();
            CreateMap<OrgResp, OrgResponse>();
        }
    }
}
