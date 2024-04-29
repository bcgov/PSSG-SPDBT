namespace Spd.Presentation.Dynamics.Models
{
    public record PrintJobRequest
    {
        public string? JobId { get; set; }
        public DocumentType DocumentType { get; set; }
        public Guid ApplicationId { get; set; }
    };
    public enum DocumentType
    {
        FingerprintLetter,
        BCMailPlusBusinessLicence,
    }
}
