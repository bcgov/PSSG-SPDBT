using Spd.Resource.Applicants.Document;

namespace Spd.Resource.Applicants.DocumentTemplate
{
    public interface IDocumentTemplateRepository
    {
        public Task<GeneratedDocumentResp> ManageAsync(DocumentTemplateCmd cmd, CancellationToken cancellationToken);
    }

    public abstract record DocumentTemplateCmd;
    public record GenerateDocBasedOnTemplateCmd : DocumentTemplateCmd
    {
        public Guid RegardingObjectId { get; set; }
        public DocTemplateTypeEnum DocTemplateType { get; set; }
    }

    public enum DocTemplateTypeEnum
    {
        MonthlyReport,
        ManualPaymentForm,
        StatutoryDeclaration,
        ClearanceLetter
    }

    public record GeneratedDocumentResp
    {
        public string? FileName { get; set; }
        public DocumentTypeEnum? DocumentType { get; set; } = null;
        public string ContentType { get; set; } = null!;
        public byte[] Content { get; set; } = Array.Empty<byte>();
    }
}