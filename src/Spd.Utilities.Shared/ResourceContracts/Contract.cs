namespace Spd.Utilities.Shared.ResourceContracts
{
    public enum PayerPreferenceTypeCode
    {
        Organization,
        Applicant
    }

    public record Paging(int Page, int PageSize);
    public record PaginationResp
    {
        public int PageSize { get; set; }
        public int PageIndex { get; set; }
        public int Length { get; set; }
    }
    public enum EmployeeOrganizationTypeCode
    {
        Childcare,
        Healthcare,
        Education,
        Funding,
        CrownCorp,
        ProvGovt,
        Registrant,
        GovnBody,
        Appointed
    }

    public enum VolunteerOrganizationTypeCode
    {
        NonProfit,
        Childcare,
        Healthcare,
        Education,
        ProvFunded,
        CrownCorp,
        ProvGovt,
        Registrant,
        Municipality,
        PostSec,
    }

    public enum BooleanTypeCode
    {
        Yes,
        No
    }

    public enum EmployeeInteractionTypeCode
    {
        Children,
        Adults,
        ChildrenAndAdults,
        Neither
    }
}
