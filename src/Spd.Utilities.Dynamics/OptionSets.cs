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

    public enum PortalUserIdentityOptionSet
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
}
