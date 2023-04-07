using AutoMapper;

namespace Spd.Manager.Membership.Org
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<OrgUpdateRequest, Spd.Resource.Organizations.Org.Org>();
            CreateMap<Spd.Resource.Organizations.Org.Org, OrgResponse>();
        }
    }
}
