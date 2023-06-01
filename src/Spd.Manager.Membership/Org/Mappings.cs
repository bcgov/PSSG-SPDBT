using AutoMapper;
using Spd.Resource.Organizations.Org;
using Spd.Utilities.Shared.ManagerContract;

namespace Spd.Manager.Membership.Org
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<OrgUpdateRequest, Spd.Resource.Organizations.Org.Org>();
            CreateMap<Spd.Resource.Organizations.Org.Org, OrgResponse>();
            CreateMap<OrgResult, OrgResponse>()
                .ForMember(d => d.EmployeeOrganizationTypeCode, opt => opt.MapFrom(s => GetNullableEnum<EmployeeOrganizationTypeCode>(s.EmployeeOrganizationTypeCode)))
                .ForMember(d => d.VolunteerOrganizationTypeCode, opt => opt.MapFrom(s => GetNullableEnum<VolunteerOrganizationTypeCode>(s.VolunteerOrganizationTypeCode)))
                .IncludeBase<Spd.Resource.Organizations.Org.Org, OrgResponse>();
        }

        private T? GetNullableEnum<T>(string? enumName) where T : struct, Enum
        {
            if (enumName == null) return null;
            return (T)Enum.Parse(typeof(T), enumName, true);
        }
    }
}
