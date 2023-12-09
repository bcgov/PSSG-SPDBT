using AutoMapper;
using Spd.Resource.Applicants.Application;
using Spd.Resource.Applicants.Document;
using Spd.Resource.Applicants.Licence;
using Spd.Resource.Applicants.LicenceApplication;
using Spd.Resource.Applicants.LicenceFee;

namespace Spd.Manager.Licence;
internal class Mappings : Profile
{
    public Mappings()
    {
        CreateMap<WorkerLicenceAppUpsertRequest, SaveLicenceApplicationCmd>()
            .ForMember(d => d.CategoryData, opt => opt.MapFrom(s => s.CategoryData));
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
        CreateMap<WorkerLicenceAppAnonymousSubmitRequest, SaveLicenceApplicationCmd>()
            .ForMember(d => d.CategoryData, opt => opt.MapFrom(s => GetCategories(s.CategoryCodes)));
        CreateMap<UploadFileRequest, SpdTempFile>()
            .ForMember(d => d.TempFilePath, opt => opt.MapFrom(s => s.FilePath)); 
    }

    private WorkerLicenceAppCategory[] GetCategories(WorkerCategoryTypeCode[] codes)
    {
        List<WorkerLicenceAppCategory> categories = new List<WorkerLicenceAppCategory> { };
        foreach (WorkerCategoryTypeCode code in codes)
        {
            categories.Add(new WorkerLicenceAppCategory() { WorkerCategoryTypeCode=Enum.Parse<WorkerCategoryTypeEnum>( code.ToString() )});
        }
        return categories.ToArray();
    }
}
