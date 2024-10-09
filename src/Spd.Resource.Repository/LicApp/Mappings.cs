using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.LicApp;

internal class Mappings : Profile
{
    public Mappings()
    {
        _ = CreateMap<spd_application, LicenceAppListResp>()
          .ForMember(d => d.LicenceAppId, opt => opt.MapFrom(s => s.spd_applicationid))
          .ForMember(d => d.ServiceTypeCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetServiceType(s._spd_servicetypeid_value)))
          .ForMember(d => d.CreatedOn, opt => opt.MapFrom(s => s.createdon))
          .ForMember(d => d.SubmittedOn, opt => opt.MapFrom(s => s.spd_submittedon))
          .ForMember(d => d.UpdatedOn, opt => opt.MapFrom(s => s.modifiedon))
          .ForMember(d => d.ApplicationTypeCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetLicenceApplicationTypeEnum(s.spd_licenceapplicationtype)))
          .ForMember(d => d.CaseNumber, opt => opt.MapFrom(s => s.spd_name))
          .ForMember(d => d.ApplicationPortalStatusCode, opt => opt.MapFrom(s => s.spd_portalstatus == null ? null : ((ApplicationPortalStatus)s.spd_portalstatus.Value).ToString()));

    }


}

