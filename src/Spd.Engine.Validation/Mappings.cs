using AutoMapper;

namespace Spd.Engine.Validation;
internal class Mappings : Profile
{
    public Mappings()
    {
        _ = CreateMap<AppBulkDuplicateCheck, AppBulkDuplicateCheckResult>();
    }
}
