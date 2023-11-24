using AutoMapper;
using Spd.Resource.Applicants.Document;
using Spd.Resource.Applicants.Licence;
using Spd.Resource.Applicants.LicenceApplication;
using Spd.Resource.Applicants.LicenceFee;

namespace Spd.Manager.Cases.Licence;
internal class Mappings : Profile
{
    public Mappings()
    {
        CreateMap<WorkerLicenceAppUpsertRequest, SaveLicenceApplicationCmd>()
            .ForMember(d => d.CategoryData, opt => opt.MapFrom(s => s.CategoryData))
            .ForMember(d => d.CarryAndUseRetraints, opt => opt.MapFrom(s => GetCarryAndUseRetraints(s.CategoryData)))
            .ForMember(d => d.IsDogsPurposeDetectionDrugs, opt => opt.MapFrom(s => GetDogsPurposeDetectionDrugs(s.CategoryData)))
            .ForMember(d => d.IsDogsPurposeDetectionExplosives, opt => opt.MapFrom(s => GetIsDogsPurposeDetectionExplosives(s.CategoryData)))
            .ForMember(d => d.IsDogsPurposeProtection, opt => opt.MapFrom(s => GetIsDogsPurposeProtection(s.CategoryData)));
        CreateMap<WorkerLicenceAppCategoryData, WorkerLicenceAppCategory>()
            .ReverseMap();
        CreateMap<LicenceApplicationCmdResp, WorkerLicenceAppUpsertResponse>();
        CreateMap<LicenceApplicationResp, WorkerLicenceResponse>();
        CreateMap<LicenceResp, LicenceLookupResponse>();
        CreateMap<LicenceFeeResp, LicenceFeeResponse>();
        CreateMap<DocumentResp, LicenceAppDocumentResponse>()
             .ForMember(d => d.DocumentExtension, opt => opt.MapFrom(s => s.FileExtension))
             .ForMember(d => d.DocumentName, opt => opt.MapFrom(s => s.FileName))
             .ForMember(d => d.LicenceAppId, opt => opt.MapFrom(s => s.ApplicationId));
        CreateMap<Address, Addr>()
            .ReverseMap();
        CreateMap<ResidentialAddress, ResidentialAddr>()
            .IncludeBase<Address, Addr>()
            .ReverseMap();
        CreateMap<MailingAddress, MailingAddr>()
            .IncludeBase<Address, Addr>()
            .ReverseMap();
        CreateMap<Alias, Spd.Resource.Applicants.LicenceApplication.Alias>()
            .ReverseMap();
        CreateMap<LicenceAppListResp, WorkerLicenceAppListResponse>();
    }

    private bool? GetCarryAndUseRetraints(WorkerLicenceAppCategoryData[] categories)
    {
        if (categories == null) return null;
        return categories.FirstOrDefault(c => c.WorkerCategoryTypeCode == WorkerCategoryTypeCode.SecurityGuard)?.UseCarryRestraints;
    }

    private bool? GetDogsPurposeDetectionDrugs(WorkerLicenceAppCategoryData[] categories)
    {
        if (categories == null) return null;
        return categories.FirstOrDefault(c => c.WorkerCategoryTypeCode == WorkerCategoryTypeCode.SecurityGuard)?.IsDogsPurposeDetectionDrugs;
    }
    private bool? GetIsDogsPurposeDetectionExplosives(WorkerLicenceAppCategoryData[] categories)
    {
        if (categories == null) return null;
        return categories.FirstOrDefault(c => c.WorkerCategoryTypeCode == WorkerCategoryTypeCode.SecurityGuard)?.IsDogsPurposeDetectionExplosives;
    }

    private bool? GetIsDogsPurposeProtection(WorkerLicenceAppCategoryData[] categories)
    {
        if (categories == null) return null;
        return categories.FirstOrDefault(c => c.WorkerCategoryTypeCode == WorkerCategoryTypeCode.SecurityGuard)?.IsDogsPurposeProtection;
    }
}
