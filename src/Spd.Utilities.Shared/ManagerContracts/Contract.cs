using System.ComponentModel;

namespace Spd.Utilities.Shared.ManagerContract
{
    public record PaginationRequest(int Page, int PageSize);
    public record PaginationResponse
    {
        public int PageSize { get; set; }
        public int PageIndex { get; set; }
        public int Length { get; set; }
    }
    public enum GenderCode
    {
        [Description("Male")]
        M,
        [Description("Female")]
        F,
        [Description("Non-Binary")]
        X
    }
    public enum PayerPreferenceTypeCode
    {
        [Description("Organization")]
        Organization,

        [Description("Applicant")]
        Applicant
    }

    public enum BooleanTypeCode
    {
        [Description("Yes")]
        Yes,

        [Description("No")]
        No
    }
    public enum EmployeeOrganizationTypeCode
    {

        [Description("A childcare facility or daycare")]
        Childcare,

        [Description("A health board, hospital, or care facility")]
        Healthcare,

        [Description("A school board or education authority")]
        Education,

        [Description("An organization or person who receives ongoing provincial funding")]
        Funding,

        [Description("A mainly government-owned corporation")]
        CrownCorp,

        [Description("A provincial government ministry or related agency")]
        ProvGovt,

        [Description("A registered health professional or social worker")]
        Registrant,

        [Description("A governing body under the Health Professions Act or the Social Workers Act")]
        GovnBody,

        [Description("An act- or minister-appointed board, commission, or council")]
        Appointed
    }

    public enum VolunteerOrganizationTypeCode
    {
        [Description("A registered health professional or social worker")]
        Registrant,

        [Description("A registered non profit organization")]
        NonProfit,

        [Description("A childcare facility or daycare")]
        Childcare,

        [Description("A health board, hospital or care facility")]
        Healthcare,

        [Description("A school board or education authority")]
        Education,

        [Description("An organization or person who receives ongoing provincial funding")]
        ProvFunded,

        [Description("A mainly government-owned corporation")]
        CrownCorp,

        [Description("A provincial government ministry or related agency")]
        ProvGovt,

        [Description("A municipality")]
        Municipality,

        [Description("A post-secondary institution")]
        PostSec,
    }
    public enum EmployeeInteractionTypeCode
    {
        [Description("My employees work with children")]
        Children,

        [Description("My employees work with vulnerable adults")]
        Adults,

        [Description("My employees work with children and vulnerable adults")]
        ChildrenAndAdults,

        [Description("Neither")]
        Neither
    }
}
