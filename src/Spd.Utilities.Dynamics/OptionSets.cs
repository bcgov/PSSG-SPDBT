namespace Spd.Utilities.Dynamics
{
    public enum EmployerOrganizationTypeOptionSet
    {
        Childcare = 100000000,
        Healthcare = 100000001,
        Education = 100000002,
        Funding = 100000003,
        CrownCorp = 100000004,
        ProvGovt = 100000005,
        Registrant = 100000006,
        GovnBody = 100000007,
        Appointed = 100000008
    }

    public enum VolunteerOrganizationTypeOptionSet
    {
        NonProfit = 100000000,
        Childcare = 100000001,
        Healthcare = 100000002,
        Education = 100000003,
        ProvFunded = 100000004,
        CrownCorp = 100000005,
        ProvGovt = 100000006,
        Registrant = 100000007,
        Municipality = 100000008,
        PostSec = 100000009,
    }

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

    public enum PortalUserIdentityTypeCode
    {
        BusinessBceId = 100000000,
        BcServicesCard = 100000001,
        Idir = 100000002
    }
}
