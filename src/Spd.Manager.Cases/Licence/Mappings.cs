using AutoMapper;
using Spd.Resource.Applicants.Application;
using Spd.Resource.Applicants.Document;

namespace Spd.Manager.Cases.Licence;
internal class Mappings : Profile
{
    public Mappings()
    {
        CreateMap<WorkerLicenceUpsertRequest, SaveLicenceApplicationCmd>();
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
    }
}
