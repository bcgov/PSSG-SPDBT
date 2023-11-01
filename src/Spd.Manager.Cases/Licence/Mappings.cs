using AutoMapper;
using Spd.Resource.Applicants.Document;
using Spd.Resource.Applicants.LicenceApplication;

namespace Spd.Manager.Cases.Licence;
internal class Mappings : Profile
{
    public Mappings()
    {
        CreateMap<WorkerLicenceApplicationUpsertRequest, SaveLicenceApplicationCmd>();
        CreateMap<LicenceApplicationCmdResp, WorkerLicenceUpsertResponse>();
        CreateMap<LicenceApplicationResp, WorkerLicenceResponse>();
        CreateMap<DocumentResp, LicenceAppFileCreateResponse>();
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
