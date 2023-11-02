using AutoMapper;
using Spd.Resource.Applicants.Document;
using Spd.Resource.Applicants.LicenceApplication;

namespace Spd.Manager.Cases.Licence;
internal class Mappings : Profile
{
    public Mappings()
    {
        CreateMap<WorkerLicenceAppUpsertRequest, SaveLicenceApplicationCmd>();
        CreateMap<LicenceApplicationCmdResp, WorkerLicenceAppUpsertResponse>();
        CreateMap<LicenceApplicationResp, WorkerLicenceResponse>();
        CreateMap<DocumentResp, LicenceAppDocumentResponse>()
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
