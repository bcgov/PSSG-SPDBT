using AutoMapper;
using Spd.Resource.Organizations.Registration;

namespace Spd.Manager.Membership.OrgRegistration
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<OrgRegistrationCreateRequest, OrgRegistrationCreateCmd>();
        }
    }
}
