namespace Spd.Utilities.Dynamics
{
    public enum WorksWithChildrenOptionSet
    {
        Children = 100000000,
        Adults = 100000001,
        ChildrenAndAdults = 100000002,
    }

    public enum EstimatedApplicationsSubmittedPerYearOptionSet
    {
        LessThanOneHundred = 100000000,
        OneToFiveHundred = 100000001,
        MoreThanFiveHundred = 100000002,
    }

    public enum FundsFromBcGovtExceedsThresholdOptionSet
    {
        Yes = 100000000,
        NotSure = 100000001
    }

    public enum YesNoOptionSet
    {
        No = 100000000,
        Yes = 100000001,
    }

    public enum GenderOptionSet
    {
        M = 100000000,
        F = 100000001,
        U = 100000003,
    }

    public enum SourceOptionSet
    {
        Online = 100000000,
        Manual = 100000001,
        Bulk = 100000002,
    }

    public enum RegistrationTypeOptionSet
    {
        Employee = 100000000,
        Volunteer = 100000001,
    }

    public enum PayerPreferenceOptionSet
    {
        Organization = 100000000,
        Applicant = 100000001,
    }

    public enum IdentityTypeOptionSet
    {
        BusinessBceId = 100000000,
        BcServicesCard = 100000001,
        Idir = 100000002
    }

    public enum ApplicationOriginOptionSet
    {
        Portal = 1,
        Email = 2,
        WebForm = 3,
        Mail = 2483,
        Fax = 3986,
        GenericUpload = 100000000,
        OrganizationSubmitted = 100000001
    }

    public enum ApplicationActiveStatus
    {
        Draft = 1,
        PaymentPending = 100000000,
        Incomplete = 100000001,
        ApplicantVerification = 100000003
    }

    public enum ApplicationInactiveStatus
    {
        Submitted = 2,
        Cancelled = 100000002
    }

    public enum CaseStatusOptionSet
    {
        New = 1,
        InProgress = 2,
        WaitingForDetails = 3,
        OnHold = 4,
        UnderReview = 100000000,
        Incomplete = 100000001,
        Completed = 5,
        InformationProvided = 1000,
        Cancelled = 6,
        Merged = 2000
    }

    public enum CaseSubStatusOptionSet
    {
        InReview = 100000029,
        OpportunityToRespond = 100000028,
        JUSTINCheck = 100000026,
        CORNETCheck = 100000000,
        CPICCheck = 100000001,
        PRIMECheck = 100000002,
        Fingerprints = 100000003,
        StatutoryDeclaration = 100000004,
        ApplicantInformation = 100000005,
        AwaitingRCC = 100000006,
        Incomplete = 100000007,
        CategoryReview = 100000008,
        NoRiskFound = 100000009,
        RiskFound = 100000010,
        AssessmentTriage = 100000011,
        ReadyForInvestigation = 100000012,
        UnderInvestigation = 100000013,
        PeerReview = 100000014,
        ManagerReview = 100000015,
        DirectorReview = 100000016,
        DeputyRegistrarReview = 100000017,
        AwaitingInformation = 100000027,
        RegistrarReview = 100000018,
        Reconsideration = 100000019,
        JudicialReview = 100000020,
        NoResponse = 100000021,
        NoConsent = 100000022,
        OrganizationInitiated = 100000023,
        ApplicantInitiated = 100000024,
        PendingApplicantClearances = 100000025
    }

    public enum AliasTypeOptionSet
    {
        LegalName = 100000000,
        BirthName = 100000001,
        FormerName = 100000002,
        PrimeAlias = 100000003,
        CornetAlias = 100000004
    }

    public enum InvitationTypeOptionSet
    {
        PortalUser = 100000000,
        ScreeningRequest = 100000001,
    }

    public enum InvitationActiveStatus
    {
        Draft = 1,
        Sent = 100000000,
        Failed = 100000001
    }

    public enum ApplicationPortalStatus
    {
        Draft = 100000000,
        VerifyIdentity = 100000001,
        InProgress = 100000002,
        AwaitingPayment = 100000003,
        AwaitingThirdParty = 100000004,
        AwaitingApplicant = 100000005,
        UnderAssessment = 100000006,
        Incomplete = 100000007,
        CompletedCleared = 100000008,
        RiskFound = 100000009,
        ClosedJudicialReview = 100000010,
        ClosedNoResponse = 100000011,
        ClosedNoConsent = 100000012,
        CancelledByApplicant = 100000014,
        CancelledByOrganization = 100000013
    }

    public enum BcGovOriginCode
    {
        Web = 931490000
    }

    public enum OrgRegistrationStatus
    {
        New = 100000000,
        InProgress = 100000001,
        AwaitingOrganization = 100000002,
        Approved = 100000003,
        NoJurisdiction = 100000004,
        Cancelled = 100000005
    }

    public enum ScreenTypeOptionSet
    {
        Staff = 100000000,
        Contractor = 100000001,
        Licensee = 100000002
    }

    public enum PaymentTypeOptionSet
    {
        PayBC = 100000000,
        Cash = 100000001,
        CreditCard = 100000002,
        MoneyOrder = 100000003,
        Cheque = 100000004,
        CertifiedCheque = 100000005,
        CreditAccount = 100000006,
        JournalVoucher = 100000008,
        NoPayment = 100000007,
    }

    public enum ResponseOptionSet
    {
        Success = 100000000,
        Failure = 100000001,
    }
}
