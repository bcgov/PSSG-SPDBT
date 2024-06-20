namespace Spd.Utilities.BCeIDWS
{
    public interface IBCeIDService
    {
        Task<BCeIDResult?> HandleQuery(BCeIDQuery cmd);
    }

    public interface BCeIDResult { };
    public interface BCeIDQuery { };
    public class IDIRUserDetailQuery : BCeIDQuery
    {
        public string RequesterGuid { get; set; }
        public RequesterAccountTypeEnum RequesterAccountType { get; set; }
        public string UserGuid { get; set; }
    }
    public class IDIRUserDetailResult : BCeIDResult
    {
        public string? MinistryName { get; set; }
        public string? MinistryCode { get; set; }
    }
    public enum RequesterAccountTypeEnum
    {
        Void,
        Internal,
    }

    public class BCeIDAccountDetailQuery : BCeIDQuery
    {
        public string RequesterGuid { get; set; }
        public string BizGuid { get; set; }
    }
    public class BCeIDUserDetailResult : BCeIDResult
    {
        public string TradeName { get; set; }
    }
}


