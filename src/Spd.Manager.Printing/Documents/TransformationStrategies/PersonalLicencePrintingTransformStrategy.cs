using AutoMapper;
using Spd.Resource.Repository.Licence;
using Spd.Utilities.Printing.BCMailPlus;
using System.Text.Json.Serialization;

namespace Spd.Manager.Printing.Documents.TransformationStrategies;

internal class PersonalLicencePrintingTransformStrategy(
    ILicenceRepository licenceRepository,
    IMapper mapper)
    : BcMailPlusTransformStrategyBase<PersonalLicencePrintingTransformRequest, PersonalLicencePrinting>(Jobs.SecurityWorkerLicenseRelease)
{
    protected override async Task<PersonalLicencePrinting> CreateDocument(PersonalLicencePrintingTransformRequest request, CancellationToken cancellationToken)
    {
        var licence = await licenceRepository.GetAsync(request.LicenceId, cancellationToken);

        //todo: temp testing data, when dynamics complete, we can add code back.
        //if(licence.jobId == null)
        //throw new ApiException with bad request;
        return new PersonalLicencePrinting()
        {
            //Jobs=new List<string> { licence.jobId }
            Jobs = new List<string> { "SPDCARD.Sep.09.2024_161255_4fa87843a5a30c0f1166d87f908ce42a" }
        };
    }

}

public record PersonalLicencePrintingTransformRequest(Guid LicenceId) : DocumentTransformRequest;

public record PersonalLicencePrinting
{
    [JsonPropertyName("Jobs")]
    public List<string> Jobs { get; set; }

}

