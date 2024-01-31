using AutoMapper;
using Spd.Resource.Repository.Org;
using Spd.Resource.Repository.Registration;

namespace Spd.Manager.Screening
{
    internal class OrgRegistrationMappings : Profile
    {
        public OrgRegistrationMappings()
        {
            CreateMap<OrgRegistrationCreateRequest, Spd.Resource.Repository.Registration.OrgRegistration>();
            CreateMap<OrgRegistrationCreateRequest, SearchRegistrationQry>();
            CreateMap<OrgRegistrationCreateRequest, SearchOrgQry>();
        }
    }
}
