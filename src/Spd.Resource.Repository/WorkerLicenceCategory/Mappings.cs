using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Resource.Repository.PersonLicApplication;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.WorkerLicenceCategory;

internal class Mappings : Profile
{
    public Mappings()
    {
        _ = CreateMap<spd_licencecategory, WorkerLicenceCategoryResp>()
         .ForMember(d => d.WorkerCategoryTypeName, opt => opt.MapFrom(s => s.spd_categoryname))
         .ForMember(d => d.Id, opt => opt.MapFrom(s => s.spd_licencecategoryid))
         .ForMember(d => d.WorkerCategoryTypeCode, opt => opt.MapFrom(s => GeWorkerCategoryTypeCode(s.spd_licencecategoryid)));
    }

    internal static WorkerCategoryType GeWorkerCategoryTypeCode(Guid? workerCatgoryId)
    {
        string key = DynamicsContextLookupHelpers.LicenceCategoryDictionary.FirstOrDefault(s => s.Value == workerCatgoryId).Key;
        return Enum.Parse<WorkerCategoryType>(key);
    }
}

