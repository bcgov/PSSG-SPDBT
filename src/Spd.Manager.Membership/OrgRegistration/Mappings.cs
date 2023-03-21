using AutoMapper;
using Spd.Resource.Organizations.Org;
using Spd.Resource.Organizations.Registration;

namespace Spd.Manager.Membership.OrgRegistration
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<OrgRegistrationCreateRequest, OrgRegistrationCreateCmd>();
            CreateMap<OrgRegistrationCreateRequest, SearchRegistrationQry>();
            CreateMap<OrgRegistrationCreateRequest, SearchOrgQry>();
        }
    }
}
