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

    public enum ApplicationStatusOptionSet
    {
        Draft = 1,
        PaymentPending = 100000000,
        Incomplete = 100000001,
        ApplicantVerification = 100000003,
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
        SelfDisclosure = 100000004,
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

    public enum InvitationStatus
    {
        Draft = 1,
        Sent = 100000000,
        Failed = 100000001,
        Completed = 2,
        Cancelled = 100000002,
        Expired = 100000003
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
        ClosedNoResponse = 100000011,
        ClosedNoConsent = 100000012,
        CancelledByApplicant = 100000014,
        CancelledByOrganization = 100000013,
        Completed = 100000015,
        RefundRequested = 100000016
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
        PayBC_OnSubmission = 100000000,
        Cash = 100000001,
        CreditCard = 100000002,
        MoneyOrder = 100000003,
        Cheque = 100000004,
        CertifiedCheque = 100000005,
        CreditAccount = 100000006,
        JournalVoucher = 100000008,
        NoPayment = 100000007,
        PayBC_SecurePaymentLink = 100000009,
    }

    public enum ResponseOptionSet
    {
        Success = 100000000,
        Failure = 100000001,
    }

    public enum PaymentStatusCodeOptionSet
    {
        Pending = 1,
        Successful = 2,
        Failure = 100000000,
        Refunded = 100000001
    }

    public enum ClearanceAccessStatusOptionSet
    {
        Draft = 1, //active status
        Approved = 100000000, //active status
        Revoked = 2
    }

    public enum PSSOUserRoleOptionSet
    {
        Delegate = 100000000,
        Initiator = 100000001
    }

    public enum InvoiceStatusOptionSet
    {
        Draft = 1,
        Pending = 100000000,
        Sent = 100000001,
        Failed = 100000002,
        Paid = 2,
        Cancelled = 100000003
    }

    public enum LicenceApplicationTypeOptionSet
    {
        New = 100000000,
        Renewal = 100000001,
        Update = 100000002,
        Replacement = 100000003
    }

    public enum LicenceTermOptionSet
    {
        NinetyDays = 100000000,
        OneYear = 100000001,
        TwoYears = 100000002,
        ThreeYears = 100000003,
        FiveYears = 100000004
    }

    public enum BizTypeOptionSet
    {
        NonRegisteredSoleProprietor = 100000000,
        NonRegisteredPartnership = 100000001,
        RegisteredSoleProprietor = 100000002,
        RegisteredPartnership = 100000003,
        Corporation = 100000004,
        None = 100000005
    }

    public enum WorkerLicenceTypeOptionSet
    {
        SecurityWorkerLicence = 100000000,
        ArmouredVehiclePermit = 100000001,
        BodyArmourPermit = 100000002
    }

    public enum LicenceStatusOptionSet
    {
        Active = 1,
        Inactive = 2,
        Expired = 100000000,
        Suspended = 100000001
    }

    public enum HairColorOptionSet
    {
        Black = 100000000,
        Blonde = 100000001,
        Brown = 100000002,
        Red = 100000003,
        Grey = 100000004,
        Bald = 100000005
    }

    public enum EyeColorOptionSet
    {
        Blue = 100000000,
        Brown = 100000001,
        Black = 100000002,
        Green = 100000003,
        Hazel = 100000004,
    }

    public enum PoliceOfficerRoleOptionSet
    {
        AuxiliaryorReserveConstable = 100000000,
        SheriffDeputySheriff = 100000001,
        CorrectionsOfficer = 100000002,
        CourtAppointedBailiff = 100000003,
        SpecialProvincialOrMunicipalConstable = 100000004,
        PoliceOfficer = 100000005,
        Other = 100000006,
        None = 100000008
    }

    public enum RequestDogPurposeOptionSet
    {
        DetectionDrugs = 100000001,
        DetectionExplosives = 100000002,
        Protection = 100000000
    }

    public enum AliasSourceTypeOptionSet
    {
        UserEntered = 100000000,
        SpdEntered = 100000001,
        MigratedFromFigaro = 100000002
    }

    public enum AddressTypeOptionSet
    {
        Physical = 100000000,
        Mailing = 100000001,
        Branch = 100000002
    }

    public enum TaskPriorityOptionSet
    {
        Low = 0,
        Normal = 1,
        High = 2
    }

    public enum PermitPurposeOptionSet
    {
        ProtectionOfPersonalProperty = 100000006,
        ProtectionOfOtherProperty = 100000007,
        ProtectionOfAnotherPerson = 100000005,
        PersonalProtection = 100000000,
        MyEmployment = 100000001,
        OutdoorRecreation = 100000003,
        TravelInResponseToInternationalConflict = 100000004,
        Other = 100000002
    }

    public enum ServiceTypeCategoryOptionSet
    {
        Screening = 100000000,
        Licensing = 100000001,
    }

    public enum UploadedDocumentOptionSet
    {
        Fingerprint = 100000000,
        StudyPermit = 100000001,
        WorkPermit = 100000002
    }

    public enum PortalUserServiceCategoryOptionSet
    {
        Screening = 100000000,
        Licensing = 100000001
    }

    public enum BizContactRoleOptionSet
    {
        ControllingMember = 100000000,
        Employee = 100000001
    }

    public enum EventTypeOptionSet
    {
        BCMPScreeningFingerprintPrinting = 100000008,
        BCMPSecurityWorkerLicencePrinting = 100000009,
        BCMPArmouredVehiclePermitPrinting = 100000010,
        BCMPBodyArmourPermitPrinting = 100000011,
        BCMPBusinessLicencePrinting = 100000012,
        BCMPMetalDealersPermitPrinting = 100000013
    }

    public enum EventStatusReasonOptionSet
    {
        Ready = 1, //Active state status reason
        Error = 100000001, //Active state status reason
        Processed = 2, //Inactive State status reason
        Cancelled = 100000000, //Inactive State status reason
        Success = 100000002, //Inactive State status reason
        Fail = 100000003 //Inactive State status reason
    }
}
