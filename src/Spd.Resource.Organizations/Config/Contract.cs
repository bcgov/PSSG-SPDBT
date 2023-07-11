namespace Spd.Resource.Organizations.Config
{
    public interface IConfigRepository
    {
        public static readonly string BANNER_MSG_CONFIG_KEY = "ScreeningPortalProcessingTimeBanner";
        public static readonly string PAYBC_GROUP = "PAYBC";
        public static readonly string PAYBC_REVENUEACCOUNT_KEY = "RevenueAccount";
        public static readonly string PAYBC_PBCREFNUMBER_KEY = "PbcRefNumber";
        Task<ConfigResult> Query(ConfigQuery query, CancellationToken ct);
    }

    //query
    public record ConfigQuery(string Key);
    public record ConfigResult(string Value);



}
