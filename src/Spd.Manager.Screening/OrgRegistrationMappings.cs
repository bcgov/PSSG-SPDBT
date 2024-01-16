using AutoMapper;
using Spd.Resource.Organizations.Org;
using Spd.Resource.Organizations.Registration;

namespace Spd.Manager.Screening
{
    internal class OrgRegistrationMappings : Profile
    {
        public OrgRegistrationMappings()
        {
            CreateMap<OrgRegistrationCreateRequest, Spd.Resource.Organizations.Registration.OrgRegistration>();
            CreateMap<OrgRegistrationCreateRequest, SearchRegistrationQry>();
            CreateMap<OrgRegistrationCreateRequest, SearchOrgQry>();
        }
    }
}
