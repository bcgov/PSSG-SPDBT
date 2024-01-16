using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.ResourceContracts;

namespace Spd.Resource.Applicants.Licence
{
    internal class Mappings : Profile
    {
        public Mappings()
        {

            _ = CreateMap<spd_licence, LicenceResp>()
             .ForMember(d => d.LicenceId, opt => opt.MapFrom(s => s.spd_licenceid))
             .ForMember(d => d.LicenceAppId, opt => opt.MapFrom(s => s.spd_CaseId._spd_applicationid_value))
             .ForMember(d => d.LicenceNumber, opt => opt.MapFrom(s => s.spd_licencenumber))
             .ForMember(d => d.ExpiryDate, opt => opt.MapFrom(s => SharedMappingFuncs.GetDateOnlyFromDateTimeOffset(s.spd_expirydate)))
             .ForMember(d => d.WorkerLicenceTypeCode, opt => opt.MapFrom(s => GetServiceType(s._spd_licencetype_value)));
        }

        private static ServiceTypeEnum? GetServiceType(Guid? licenceTypeGuid)
        {
            if (licenceTypeGuid == null) return null;
            return Enum.Parse<ServiceTypeEnum>(DynamicsContextLookupHelpers.LookupServiceTypeKey(licenceTypeGuid));
        }
    }
}
