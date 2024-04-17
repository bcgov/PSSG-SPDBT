using System.Text.Json;
using System.Text.Json.Serialization;
using Spd.Resource.Repository.Application;
using Spd.Utilities.Printing.BCMailPlus;

namespace Spd.Engines.Transformation.Documents.TransformationStrategies;

internal class FingerPrintLetterTransformStrategy(IApplicationRepository applicationRepository) : IDocumentTransformStrategy
{
    private const string JobTemplate = Jobs.FingerprintsLetter;

    public bool CanTransform(DocumentTransformRequest request) => request is FingerprintLetterTransformRequest;

    public async Task<DocumentTransformResponse> Transform(DocumentTransformRequest request, CancellationToken cancellationToken)
    {
        return new BcMailPlusTransformResponse(Jobs.FingerprintsLetter, await CreateDocument(((FingerprintLetterTransformRequest)request).ApplicationId, cancellationToken));
    }

    private async Task<JsonDocument> CreateDocument(Guid applicationId, CancellationToken cancellationToken)
    {
        var application = await applicationRepository.QueryApplicationAsync(new ApplicationQry(applicationId), cancellationToken);

        //TODO: map to document data
        var documentData = new FingerprintLetter();

        return JsonSerializer.SerializeToDocument(documentData);
    }
}

public record FingerprintLetterTransformRequest(Guid ApplicationId) : DocumentTransformRequest;

public record FingerprintLetter
{
    [JsonPropertyName("date")]
    public string Date { get; set; }

    [JsonPropertyName("caseNumber")]
    public string CaseNumber { get; set; }

    [JsonPropertyName("serviceType")]
    public string ServiceType { get; set; }

    [JsonPropertyName("worksWithCategory")]
    public string WorksWithCategory { get; set; }

    [JsonPropertyName("applicant")]
    public Applicant Applicant { get; set; }

    [JsonPropertyName("organization")]
    public Organization Organization { get; set; }
}

public record Applicant
{
    [JsonPropertyName("name")]
    public string Name { get; set; }

    [JsonPropertyName("sex")]
    public string Sex { get; set; }

    [JsonPropertyName("dateoOfBirth")]
    public string DateoOfBirth { get; set; }

    [JsonPropertyName("placeOfBirth")]
    public string PlaceOfBirth { get; set; }

    [JsonPropertyName("mailingAddress1")]
    public string MailingAddress1 { get; set; }

    [JsonPropertyName("mailingAddress2")]
    public object MailingAddress2 { get; set; }

    [JsonPropertyName("city")]
    public string City { get; set; }

    [JsonPropertyName("provinceState")]
    public string ProvinceState { get; set; }

    [JsonPropertyName("postalCode")]
    public string PostalCode { get; set; }

    [JsonPropertyName("country")]
    public object Country { get; set; }
}

public record Organization
{
    [JsonPropertyName("name")]
    public string Name { get; set; }

    [JsonPropertyName("mailingAddress1")]
    public string MailingAddress1 { get; set; }

    [JsonPropertyName("mailingAddress2")]
    public object MailingAddress2 { get; set; }

    [JsonPropertyName("city")]
    public string City { get; set; }

    [JsonPropertyName("provinceState")]
    public string ProvinceState { get; set; }

    [JsonPropertyName("postalCode")]
    public string PostalCode { get; set; }

    [JsonPropertyName("country")]
    public object Country { get; set; }
}