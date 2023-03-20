using AutoMapper;

namespace Spd.Manager.Membership.Org
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<OrgUpdateRequest, OrgUpdateCommand>();
            CreateMap<OrgResponse, OrgResponse>();
        }
    }
}
