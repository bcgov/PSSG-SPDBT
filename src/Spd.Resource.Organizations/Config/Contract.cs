namespace Spd.Resource.Organizations.Config
{
    public interface IConfigRepository
    {
        Task<ConfigResult?> Query(ConfigQuery query, CancellationToken ct);
    }

    //query
    public record ConfigQuery;
    public record ConfigResult(string BannerMsg);

}
