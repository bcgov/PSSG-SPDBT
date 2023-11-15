using AutoMapper;
using Spd.Resource.Applicants.Document;
using Spd.Resource.Applicants.LicenceApplication;

namespace Spd.Manager.Cases.Licence;
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
        CreateMap<LicenceLookupResp, LicenceLookupResponse>();
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
    }
}
