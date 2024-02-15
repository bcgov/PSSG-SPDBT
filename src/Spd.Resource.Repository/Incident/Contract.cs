using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.Document;

namespace Spd.Resource.Repository.Incident
{
    public interface IIncidentRepository
    {
        public Task<IncidentResp> ManageAsync(IncidentCmd cmd, CancellationToken cancellationToken);
        public Task<IncidentListResp> QueryAsync(IncidentQry cmd, CancellationToken cancellationToken);
    }

    public record IncidentListResp
    {
        public IEnumerable<IncidentResp> Items { get; set; } = Array.Empty<IncidentResp>();
    }

    public record IncidentResp
    {
        public Guid IncidentId { get; set; }
        public Guid ApplicationId { get; set; }
        public string Title { get; set; } = null!;
    }

    public abstract record IncidentCmd;
    public record IncidentQry
    {
        public Guid? IncidentId { get; set; }
        public Guid? ApplicationId { get; set; }
        public string? CaseNumber { get; set; }
    };
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
