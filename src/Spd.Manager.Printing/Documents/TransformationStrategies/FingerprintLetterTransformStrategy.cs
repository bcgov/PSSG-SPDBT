using AutoMapper;
using Spd.Resource.Repository;
using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.Contact;
using Spd.Resource.Repository.OptionSet;
using Spd.Resource.Repository.Org;
using Spd.Resource.Repository.ServiceTypes;
using Spd.Utilities.Printing.BCMailPlus;
using Spd.Utilities.Shared.Exceptions;
using System.Text.Json.Serialization;

namespace Spd.Manager.Printing.Documents.TransformationStrategies;

internal class FingerprintLetterTransformStrategy(IApplicationRepository applicationRepository,
    IContactRepository contactRepository,
    IOrgRepository orgRepository,
    IOptionSetRepository optionsetRepository,
    IServiceTypeRepository serviceTypeRepository,
    IMapper mapper)
    : BcMailPlusTransformStrategyBase<FingerprintLetterTransformRequest, FingerprintLetter>(Jobs.FingerprintsLetter)
{
    protected override async Task<FingerprintLetter> CreateDocument(FingerprintLetterTransformRequest request, CancellationToken cancellationToken)
    {
        ApplicationResult app = await applicationRepository.QueryApplicationAsync(new ApplicationQry(request.ApplicationId), cancellationToken);
        if (app == null) throw new ApiException(System.Net.HttpStatusCode.BadRequest, "Cannot find the application");

        ContactResp applicant = await contactRepository.GetAsync((Guid)app.ApplicantId, cancellationToken);
        OrgQryResult org = (OrgQryResult)await orgRepository.QueryOrgAsync(new OrgByIdentifierQry(app.OrgId), cancellationToken);

        FingerprintLetter letter = mapper.Map<FingerprintLetter>(app);
        letter.ServiceType = await GetServiceTypeForLetter(app.ServiceType, cancellationToken);

        if (org.OrgResult?.EmployeeInteractionType == null)
            letter.WorksWithCategory = string.Empty;
        else
            letter.WorksWithCategory = await optionsetRepository.GetLabelAsync(
                (EmployeeInteractionTypeCode)org.OrgResult.EmployeeInteractionType,
                cancellationToken);

        letter.Applicant = mapper.Map<Applicant>(applicant);
        if (applicant.Gender == null)
            letter.Applicant.Sex = string.Empty;
        else
            letter.Applicant.Sex = await optionsetRepository.GetLabelAsync((Gender)applicant.Gender, CancellationToken.None);

        letter.Organization = mapper.Map<Organization>(org.OrgResult);
        return letter;
    }

    private async Task<string> GetServiceTypeForLetter(ServiceTypeCode? serviceType, CancellationToken cancellationToken)
    {
        if (serviceType == null) return string.Empty;
        var serviceTypeListResp = await serviceTypeRepository.QueryAsync(
            new ServiceTypeQry(null, serviceType), cancellationToken);
        string name = serviceTypeListResp.Items.First().ServiceTypeName;
        if (name.StartsWith("CRRP - ")) return name.Substring(7);
        return name;
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
    public string MailingAddress2 { get; set; }

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