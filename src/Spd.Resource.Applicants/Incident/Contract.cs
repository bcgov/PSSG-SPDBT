using Spd.Resource.Applicants.Application;

namespace Spd.Resource.Applicants.Incident
{
    public interface IIncidentRepository
    {
        public Task<IncidentResp> ManageAsync(IncidentCmd cmd, CancellationToken cancellationToken);
    }

    public record IncidentResp
    {
        public Guid IncidentId { get; set; }
        public Guid ApplicationId { get; set; }
        public string Title { get; set; } = null!;
    }

    public abstract record IncidentCmd;

    public record UpdateIncidentCmd : IncidentCmd
    {
        public Guid ApplicationId { get; set; }
        public CaseStatusEnum CaseStatus { get; set; }
        public CaseSubStatusEnum CaseSubStatus { get; set; }

    }

    public enum CaseStatusEnum
    {
        New,
        InProgress,
        WaitingForDetails,
        OnHold,
        UnderReview,
        Incomplete,
        Completed,
        InformationProvided,
        Cancelled,
        Merged
    }

    public enum CaseSubStatusEnum
    {
        InReview,
        OpportunityToRespond,
        JUSTINCheck,
        CORNETCheck,
        CPICCheck,
        PRIMECheck,
        Fingerprints,
        StatutoryDeclaration,
        ApplicantInformation,
        AwaitingRCC,
        Incomplete,
        CategoryReview,
        NoRiskFound,
        RiskFound,
        AssessmentTriage,
        ReadyForInvestigation,
        UnderInvestigation,
        PeerReview,
        ManagerReview,
        DirectorReview,
        DeputyRegistrarReview,
        AwaitingInformation,
        RegistrarReview,
        JudicialReview,
        NoResponse,
        NoConsent,
        OrganizationInitiated,
        ApplicantInitiated,
        PendingApplicantClearances
    }
}
