namespace Spd.Utilities.BCeIDWS
{
    public interface IBCeIDService
    {
        Task<BCeIDResult?> HandleQuery(BCeIDQuery qry);
    }

#pragma warning disable S2094 // Classes should not be empty
    public record BCeIDResult;

    public record BCeIDQuery;

#pragma warning restore S2094 // Classes should not be empty

#pragma warning disable S101 // Types should be named in PascalCase
    public record IDIRUserDetailQuery : BCeIDQuery
    {
        public string RequesterGuid { get; set; } = null!;
        public RequesterAccountType RequesterAccountType { get; set; }
        public string UserGuid { get; set; } = null!;
    }

    public record IDIRUserDetailResult : BCeIDResult
    {
        public string? MinistryName { get; set; }
        public string? MinistryCode { get; set; }
    }

#pragma warning restore S101 // Types should be named in PascalCase

    public enum RequesterAccountType
    {
        Void,
        Internal,
    }

    public record BCeIDAccountDetailQuery : BCeIDQuery
    {
        public Guid UserGuid { get; set; }
    }

    public record BCeIDUserDetailResult : BCeIDResult
    {
        public string? TradeName { get; set; }
        public string? LegalName { get; set; }
        public Address? MailingAddress { get; set; }
        public BusinessTypeCode? BusinessTypeCode { get; set; }
        public string? OtherBusinessTypeDetail { get; set; }
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