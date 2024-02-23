using AutoMapper;
using Microsoft.Dynamics.CRM;

namespace Spd.Resource.Repository.Licence
{
    internal class Mappings : Profile
    {
        public Mappings()
        {

            _ = CreateMap<spd_licence, LicenceResp>()
             .ForMember(d => d.LicenceId, opt => opt.MapFrom(s => s.spd_licenceid))
             .ForMember(d => d.LicenceAppId, opt => opt.MapFrom(s => s.spd_CaseId._spd_applicationid_value))
             .ForMember(d => d.LicenceHolderId, opt => opt.MapFrom(s => s.spd_LicenceHolder_contact.contactid))
             .ForMember(d => d.LicenceNumber, opt => opt.MapFrom(s => s.spd_licencenumber))
             .ForMember(d => d.ExpiryDate, opt => opt.MapFrom(s => SharedMappingFuncs.GetDateOnlyFromDateTimeOffset(s.spd_expirydate)))
             .ForMember(d => d.WorkerLicenceTypeCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetServiceType(s._spd_licencetype_value)))
             .ForMember(d => d.LicenceTermCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetLicenceTermEnum(s.spd_licenceterm)))
             .ForMember(d => d.LicenceHolderFirstName, opt => opt.MapFrom(s => s.spd_LicenceHolder_contact.firstname))
             .ForMember(d => d.LicenceHolderLastName, opt => opt.MapFrom(s => s.spd_LicenceHolder_contact.lastname));
        }
    }
}
