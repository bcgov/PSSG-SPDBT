namespace Spd.Resource.Repository.Config
{
    public interface IConfigRepository
    {
        public static readonly string BANNER_MSG_CONFIG_KEY = "ScreeningPortalProcessingTimeBanner";
        public static readonly string PAYBC_GROUP = "PAYBC";
        public static readonly string PAYBC_REVENUEACCOUNT_KEY = "RevenueAccount";
        public static readonly string PAYBC_PBCREFNUMBER_KEY = "PbcRefNumber";
        public static readonly string PAYBC_PBCREFNUMBER_LICENSING_KEY = "PbcRefNumberLicensing";
        public static readonly string PAYBC_REVENUEACCOUNT_LICENSING_KEY = "RevenueAccountLicensing";
        public static readonly string LICENSING_REPLACEMENTPROCESSINGTIME_KEY = "ReplacementProcessingTime";

        Task<ConfigResult> Query(ConfigQuery query, CancellationToken ct);
    }

    //query
    public record ConfigQuery(string? Key = null, string? Group = null);
    public record ConfigResult(IEnumerable<ConfigItem> ConfigItems);
    public record ConfigItem
    {
        public string Key { get; set; } = null!;
        public string? Group { get; set; }
        public string? Value { get; set; }
    }
}