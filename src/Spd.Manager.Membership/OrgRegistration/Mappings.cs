using AutoMapper;
using Spd.Resource.Organizations;

namespace Spd.Manager.Membership.OrgRegistration
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<OrgRegistrationCreateRequest, CreateRegistrationCmd>();
        }
    }
}
