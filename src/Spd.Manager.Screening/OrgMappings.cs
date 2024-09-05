using AutoMapper;
using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.Org;

namespace Spd.Manager.Screening
{
    internal class OrgMappings : Profile
    {
        public OrgMappings()
        {
            CreateMap<OrgUpdateRequest, Org>();
            CreateMap<Org, OrgResponse>();
            CreateMap<OrgResult, OrgResponse>()
                .ForMember(d => d.EmployeeOrganizationTypeCode, opt => opt.MapFrom(s => GetNullableEnum<Spd.Manager.Shared.EmployeeOrganizationTypeCode>(s.EmployeeOrganizationTypeCode)))
                .ForMember(d => d.VolunteerOrganizationTypeCode, opt => opt.MapFrom(s => GetNullableEnum<Spd.Manager.Shared.VolunteerOrganizationTypeCode>(s.VolunteerOrganizationTypeCode)))
                .ForMember(d => d.ServiceTypes, opt => opt.MapFrom(s => GetScreeningServiceTypes(s.ServiceTypes)))
                .IncludeBase<Org, OrgResponse>();
        }

        private T? GetNullableEnum<T>(string? enumName) where T : struct, Enum
        {
            if (enumName == null) return null;
            return (T)Enum.Parse(typeof(T), enumName, true);
        }

        private IEnumerable<Shared.ServiceTypeCode> GetScreeningServiceTypes(IEnumerable<Resource.Repository.ServiceTypeCode> services)
        {
            return services
                .Where(s => IApplicationRepository.ScreeningServiceTypes.Contains(s))
                .Select(s => Enum.Parse<Shared.ServiceTypeCode>(s.ToString()));
        }
    }
}