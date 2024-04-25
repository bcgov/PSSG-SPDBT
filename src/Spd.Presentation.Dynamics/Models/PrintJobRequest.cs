namespace Spd.Presentation.Dynamics.Models
{
    public record PrintJobRequest
    {
        public string? JobId { get; set; }
        public DocumentType DocumentType { get; set; }
        public Guid DocumentReferenceId { get; set; }
    };
    public enum DocumentType
    {
        FingerprintLetter,
        BCMailPlusBusinessLicence,
    }
}
