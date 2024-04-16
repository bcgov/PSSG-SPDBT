using System.Text.Json.Serialization;
using Microsoft.OData.UriParser;
using Spd.Resource.Repository.Application;

namespace Spd.Engines.Transformation.Documents;

public record FingerprintLetterTransformRequest(Guid ApplicationId) : DocumentTransformRequest;

public record FingerprintLetter : DocumentData
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

internal class FingerPrintLetterTransformStrategy(IApplicationRepository applicationRepository) : IDocumentTransformStrategy
{
    public bool CanTransform(DocumentTransformRequest request) => request is FingerprintLetterTransformRequest;

    public async Task<DocumentTransformResponse> Transform(DocumentTransformRequest request, CancellationToken cancellationToken)
    {
        var req = (FingerprintLetterTransformRequest)request;
        var application = await applicationRepository.QueryApplicationAsync(new ApplicationQry(req.ApplicationId), cancellationToken);
        
        //TODO: map to document data

        return new DocumentTransformResponse(new FingerprintLetter
        {
        }, "application/pdf");
    }
}
