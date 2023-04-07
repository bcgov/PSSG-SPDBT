using AutoMapper;
using Spd.Resource.Organizations.Org;

namespace Spd.Manager.Membership.Org
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<OrgUpdateRequest, Spd.Resource.Organizations.Org.Org>();
            CreateMap<OrgResult, OrgResponse>();
        }
    }
}
