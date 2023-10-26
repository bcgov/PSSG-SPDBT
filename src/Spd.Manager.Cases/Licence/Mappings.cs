using AutoMapper;
using Spd.Resource.Applicants.Application;

namespace Spd.Manager.Cases.Licence;
internal class Mappings : Profile
{
    public Mappings()
    {
        CreateMap<WorkerLicenceUpsertRequest, SaveLicenceApplicationCmd>();
    }
}
