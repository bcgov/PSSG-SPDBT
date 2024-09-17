using AutoMapper;
using Spd.Resource.Repository.Licence;
using Spd.Utilities.Printing.BCMailPlus;
using Spd.Utilities.Shared.Exceptions;
using System.Text.Json.Serialization;

namespace Spd.Manager.Printing.Documents.TransformationStrategies;

internal class PersonalLicencePrintingTransformStrategy(
    ILicenceRepository licenceRepository,
    IMapper mapper)
    : BcMailPlusTransformStrategyBase<PersonalLicencePrintingTransformRequest, PersonalLicencePrinting>(Jobs.SecurityWorkerLicenseRelease)
{
    protected override async Task<PersonalLicencePrinting> CreateDocument(PersonalLicencePrintingTransformRequest request, CancellationToken cancellationToken)
    {
        LicenceResp? licence = await licenceRepository.GetAsync(request.LicenceId, cancellationToken);

        if (licence?.PrintingPreviewJobId == null)
            throw new ApiException(System.Net.HttpStatusCode.BadRequest, "Cannot find the preview job id");

        return new PersonalLicencePrinting()
        {
            Jobs = new List<string> { licence?.PrintingPreviewJobId }
        };
    }

}

public record PersonalLicencePrintingTransformRequest(Guid LicenceId) : DocumentTransformRequest;

public record PersonalLicencePrinting
{
    [JsonPropertyName("Jobs")]
    public List<string> Jobs { get; set; }

}

