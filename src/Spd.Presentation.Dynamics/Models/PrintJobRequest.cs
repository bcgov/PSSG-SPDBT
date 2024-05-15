namespace Spd.Presentation.Dynamics.Models
{
    public record PrintJobRequest
    {
        public string? JobId { get; set; }
        public DocumentType DocumentType { get; set; }
        public Guid? ApplicationId { get; set; } //used for fingerprint letter
        public Guid? LicenceId { get; set; } //used for LicencePreview
    };
    public enum DocumentType
    {
        FingerprintLetter,
        BCMailPlusBusinessLicence,
        PersonalLicencePreview
    }
}
