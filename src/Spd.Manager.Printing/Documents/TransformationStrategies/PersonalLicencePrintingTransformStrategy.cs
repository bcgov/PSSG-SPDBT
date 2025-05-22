using AutoMapper;
using Spd.Resource.Repository.Licence;
using Spd.Utilities.Printing.BCMailPlus;
using System.Text.Json.Serialization;

namespace Spd.Manager.Printing.Documents.TransformationStrategies;

internal class PersonalLicencePrintingTransformStrategy(
    ILicenceRepository licenceRepository,
    IMapper mapper)
    : BcMailPlusTransformStrategyBase<PersonalLicenceBatchPrintingTransformRequest, PersonalLicencePrinting>(Jobs.PersonalLicenseRelease)
{
    protected override async Task<PersonalLicencePrinting> CreateDocument(PersonalLicenceBatchPrintingTransformRequest request, CancellationToken cancellationToken)
    {
        if (request.CardPrintEvents.Any())
        {
            var result = new PersonalLicencePrinting()
            {
                Jobs = request.CardPrintEvents.Where(p => p.PrintingPreviewJobId != null)
                .Select(p => p.PrintingPreviewJobId)
                .ToList(),
            };
            if (result.Jobs.Any()) return result;
        }
        return null;
    }
}

public record PersonalLicenceBatchPrintingTransformRequest(List<CardPrintEvent> CardPrintEvents) : DocumentTransformRequest;
public record CardPrintEvent
{
    public Guid EventQueueId { get; set; }
    public string? PrintingPreviewJobId { get; set; }
    public bool? IsSuccess { get; set; }
    public string? ErrMsg { get; set; }
}
public record PersonalLicencePrinting
{
    [JsonPropertyName("Jobs")]
    public List<string> Jobs { get; set; }

}

