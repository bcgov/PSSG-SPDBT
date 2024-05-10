using AutoMapper;
using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.Contact;
using Spd.Resource.Repository.OptionSet;
using Spd.Resource.Repository.Org;
using Spd.Resource.Repository.ServiceTypes;
using Spd.Utilities.Printing.BCMailPlus;
using System.Text.Json.Serialization;

namespace Spd.Manager.Printing.Documents.TransformationStrategies;

internal class PersonalLicencePreviewTransformStrategy(IApplicationRepository applicationRepository,
    IContactRepository contactRepository,
    IOrgRepository orgRepository,
    IOptionSetRepository optionsetRepository,
    IServiceTypeRepository serviceTypeRepository,
    IMapper mapper)
    : BcMailPlusTransformStrategyBase<PersonalLicencePreviewTransformRequest, PersonalLicencePreviewJson>(Jobs.SecurityWorkerLicense)
{
    protected override async Task<PersonalLicencePreviewJson> CreateDocument(PersonalLicencePreviewTransformRequest request, CancellationToken cancellationToken)
    {
        //ApplicationResult app = await applicationRepository.QueryApplicationAsync(new ApplicationQry(request.ApplicationId), cancellationToken);
        //if (app == null) throw new ApiException(System.Net.HttpStatusCode.BadRequest, "Cannot find the application");

        //ContactResp applicant = await contactRepository.GetAsync((Guid)app.ApplicantId, cancellationToken);
        //OrgQryResult org = (OrgQryResult)await orgRepository.QueryOrgAsync(new OrgByIdentifierQry(app.OrgId), cancellationToken);

        //FingerprintLetter letter = mapper.Map<FingerprintLetter>(app);
        //letter.ServiceType = await GetServiceTypeForLetter(app.ServiceType, cancellationToken);

        //if (org.OrgResult?.EmployeeInteractionType == null)
        //    letter.WorksWithCategory = string.Empty;
        //else
        //    letter.WorksWithCategory = await optionsetRepository.GetLabelAsync(
        //        (EmployeeInteractionTypeCode)org.OrgResult.EmployeeInteractionType,
        //        cancellationToken);

        //letter.Applicant = mapper.Map<Applicant>(applicant);
        //if (applicant.Gender == null)
        //    letter.Applicant.Sex = string.Empty;
        //else
        //    letter.Applicant.Sex = await optionsetRepository.GetLabelAsync((GenderEnum)applicant.Gender, CancellationToken.None);

        //letter.Organization = mapper.Map<Organization>(org.OrgResult);
        //return letter;
        return new PersonalLicencePreviewJson();
    }


}

public record PersonalLicencePreviewTransformRequest(Guid ApplicationId) : DocumentTransformRequest;
public record PersonalLicencePreviewJson()
{
    [JsonPropertyName("licenceNumber")]
    public string LicenceNumber { get; set; } = null!;

    [JsonPropertyName("licenceType")]
    public string LicenceType { get; set; } = null!; //Armoured Vehicle Permit, Body Armour Permit, Security Worker Licence

    [JsonPropertyName("photo")]
    public string photo { get; set; } = null!;

    [JsonPropertyName("licenceCategories")]
    public IEnumerable<string> LicenceCategories { get; set; } = Enumerable.Empty<string>();//["Security Guard", "Locksmith"], only has value for swl

    [JsonPropertyName("applicantName")]
    public string ApplicantName { get; set; } = null!; //firstname middlename1 lastName

    [JsonPropertyName("doingBusinessAsName")]
    public string? DoingBusinessAsName { get; set; }

    [JsonPropertyName("issuedDate")]
    public string? IssuedDate { get; set; } //yyyy-MM-dd

    [JsonPropertyName("expiryDate")]
    public string? ExpiryDate { get; set; } //yyyy-MM-dd

    [JsonPropertyName("mailingAddress1")]
    public string? MailingAddress1 { get; set; }

    [JsonPropertyName("mailingAddress2")]
    public string? MailingAddress2 { get; set; }

    [JsonPropertyName("city")]
    public string? City { get; set; }

    [JsonPropertyName("provinceState")]
    public string? ProvinceState { get; set; }

    [JsonPropertyName("postalCode")]
    public string? PostalCode { get; set; }

    [JsonPropertyName("country")]
    public string? Country { get; set; }

    [JsonPropertyName("branchOffices")]
    public IEnumerable<string> BranchOffices { get; set; } = Enumerable.Empty<string>();

    [JsonPropertyName("conditions")]
    public IEnumerable<string> Conditions { get; set; } = Enumerable.Empty<string>();

    [JsonPropertyName("SPD_CARD")]
    public SPD_CARD? SPD_CARD { get; set; }
}

public record SPD_CARD
{
    [JsonPropertyName("eyes")]
    public string? Eyes { get; set; }

    [JsonPropertyName("hair")]
    public string? Hair { get; set; }

    [JsonPropertyName("height")]
    public string? Height { get; set; } //175cm

    [JsonPropertyName("weight")]
    public string? Weight { get; set; } //67kg

    [JsonPropertyName("temporaryLicence")]
    public bool TemporaryLicence { get; set; }

    [JsonPropertyName("cardType")]
    public string? CardType { get; set; } //SECURITY-WORKER-AND-ARMOUR
}


