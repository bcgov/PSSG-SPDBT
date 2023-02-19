using AutoMapper;
using Spd.Manager.Membership.ViewModels;

namespace Spd.Resource.Organizations
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<OrgRegistrationCreateRequest, CreateRegistrationCmd>();
        }
    }
}
