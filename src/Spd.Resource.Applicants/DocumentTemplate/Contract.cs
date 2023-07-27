namespace Spd.Resource.Applicants.DocumentTemplate
{
    public interface IDocumentTemplateRepository
    {
        public Task<string> ManageAsync(DocumentTemplateCmd cmd, CancellationToken cancellationToken);
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
}