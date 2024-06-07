namespace Spd.Presentation.Dynamics.Models
{
    public record PrintPreviewJobRequest
    {
        public string? JobId { get; set; }
        public DocumentType DocumentType { get; set; }
        public Guid? LicenceId { get; set; } //used for LicencePreview
    };
    public enum DocumentType
    {
        FingerprintLetter,
        BCMailPlusBusinessLicence,
        PersonalLicencePreview
    }
}
