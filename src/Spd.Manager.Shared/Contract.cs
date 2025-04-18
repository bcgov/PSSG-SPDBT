using System.ComponentModel;

namespace Spd.Manager.Shared
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
        [Description("Unspecified")]
        U
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

    public enum ServiceTypeCode
    {
        PSSO,
        CRRP_EMPLOYEE,
        CRRP_VOLUNTEER,
        MCFD,
        PE_CRC,
        PE_CRC_VS,
        SecurityWorkerLicence,
        PSSO_VS,
        SecurityBusinessLicence,
        ArmouredVehiclePermit,
        BodyArmourPermit,
        MDRA,
        SECURITY_BUSINESS_LICENCE_CONTROLLING_MEMBER_CRC,
        GDSDTeamCertification,
        DogTrainerCertification,
        RetiredServiceDogCertification
    }

    public enum ApplicationInviteStatusCode
    {
        Draft,
        Sent,
        Failed,
        Completed, //inactive Status code
        Cancelled,//inactive Status code
        Expired //inactive Status code
    }

    public record FileResponse
    {
        public string ContentType { get; set; } = null!;
        public byte[] Content { get; set; } = Array.Empty<byte>();
        public string? FileName { get; set; } = null!;
    }

    public enum IdentityProviderTypeCode
    {
        BusinessBceId,
        BcServicesCard,
        Idir,
    }

    public enum ApplicationTypeCode
    {
        New,
        Renewal,
        Replacement,
        Update,
    }

    public enum LicenceTermCode
    {
        NinetyDays,
        OneYear,
        TwoYears,
        ThreeYears,
        FiveYears
    }

    public enum LicenceStatusCode
    {
        Active,
        Inactive,
        Expired,
        Suspended,
        Preview
    }

    public enum PortalUserServiceCategoryCode
    {
        Screening,
        Licensing
    }

    public enum ContactAuthorizationTypeCode
    {
        [Description("Primary Authorized Contact")]
        Primary,

        [Description("Authorized Contact")]
        Contact,

        [Description("Primary Authorized Business Manager Contact")]
        PrimaryBusinessManager,

        [Description("Authorized Business Manager Contact")]
        BusinessManager
    }

    public enum ApplicationOriginTypeCode
    {
        //applicant authenticated with bcsc submit app
        [Description("Portal")]
        Portal,

        [Description("Email")]
        Email,

        //applicant anonymous submit app
        [Description("Web Form")]
        WebForm,

        [Description("Mail")]
        Mail,

        [Description("Fax")]
        Fax,

        [Description("Generic Upload")]
        GenericUpload,

        //organization submit app manually
        [Description("Organization Submitted")]
        OrganizationSubmitted
    }

    public enum PaymentTypeCode
    {
        PayBC_OnSubmission,
        Cash,
        CreditCard,
        MoneyOrder,
        Cheque,
        CertifiedCheque,
        CreditAccount,
        JournalVoucher,
        NoPayment,
        PayBC_SecurePaymentLink,
    }
}
