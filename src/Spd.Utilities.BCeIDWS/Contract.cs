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
        public Guid UserGuid { get; set; }
    }
    public class BCeIDUserDetailResult : BCeIDResult
    {
        public string TradeName { get; set; }
        public string LegalName { get; set; }
        public Address MailingAddress { get; set; }
        public BusinessTypeCode? BusinessTypeCode { get; set; }
        public string OtherBusinessTypeDetail { get; set; }
    }
    public record Address
    {
        public string? AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }
        public string? PostalCode { get; set; }
        public string? Province { get; set; }
    }
    public enum BusinessTypeCode
    {
        Void,
        Proprietorship,
        Partnership,
        Corporation,
        ExtraProvinciallyRegisteredCompany,
        Other,
    }
}


