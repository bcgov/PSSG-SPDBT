using AutoMapper;
using Spd.Resource.Repository;
using Spd.Resource.Repository.Biz;
using Spd.Resource.Repository.Incident;
using Spd.Resource.Repository.Licence;
using Spd.Resource.Repository.PersonLicApplication;
using Spd.Resource.Repository.ServiceTypes;
using Spd.Resource.Repository.WorkerLicenceCategory;
using Spd.Utilities.Printing.BCMailPlus;
using Spd.Utilities.Shared.Exceptions;
using System.Net;
using System.Text.Json.Serialization;

namespace Spd.Manager.Printing.Documents.TransformationStrategies;

internal class BizLicencePrintingTransformStrategy(
    ILicenceRepository licRepository,
    IServiceTypeRepository serviceTypeRepository,
    IWorkerLicenceCategoryRepository workerLicenceCategoryRepository,
    IBizRepository bizRepository,
    IIncidentRepository incidentRepository,
    IMapper mapper)
    : BcMailPlusTransformStrategyBase<BizLicencePrintingTransformRequest, BizLicencePrintingJson>(Jobs.BusinessLicense)
{
    protected override async Task<BizLicencePrintingJson> CreateDocument(BizLicencePrintingTransformRequest request, CancellationToken cancellationToken)
    {
        LicenceListResp lics = await licRepository.QueryAsync(new LicenceQry() { LicenceId = request.LicenceId }, cancellationToken);
        if (lics == null || !lics.Items.Any())
            throw new ApiException(HttpStatusCode.BadRequest, "No licence found for the licenceId");
        LicenceResp lic = lics.Items.First();
        if (lic.WorkerLicenceTypeCode != WorkerLicenceTypeEnum.SecurityBusinessLicence)
            throw new ApiException(HttpStatusCode.BadRequest, "The licence is not a business licence.");

        BizLicencePrintingJson bizLicJson = mapper.Map<BizLicencePrintingJson>(lic);
        var serviceTypeListResp = await serviceTypeRepository.QueryAsync(
                new ServiceTypeQry(null, Enum.Parse<ServiceTypeEnum>(bizLicJson.LicenceType)), cancellationToken);
        bizLicJson.LicenceType = serviceTypeListResp.Items.First().ServiceTypeName;
        if (lic.WorkerLicenceTypeCode == WorkerLicenceTypeEnum.SecurityBusinessLicence)
            bizLicJson.LicenceCategories = await GetCategoryNamesAsync(lic.CategoryCodes, cancellationToken);

        BizResult? biz = await bizRepository.GetBizAsync((Guid)lic.LicenceHolderId, cancellationToken);
        mapper.Map(biz, bizLicJson);

        //conditions
        IncidentListResp resp = await incidentRepository.QueryAsync(
            new IncidentQry() { ApplicationId = lic.LicenceAppId, IncludeInactive = true },
            cancellationToken);
        bizLicJson.Conditions = resp.Items.First().Conditions.Select(c => c.Name);

        return bizLicJson;
    }

    private async Task<IEnumerable<string>> GetCategoryNamesAsync(IEnumerable<WorkerCategoryTypeEnum> categoryTypeEnums, CancellationToken ct)
    {
        List<string> names = new();
        foreach (WorkerCategoryTypeEnum categoryTypeEnum in categoryTypeEnums)
        {
            var listResult = await workerLicenceCategoryRepository.QueryAsync(
                new WorkerLicenceCategoryQry(null, categoryTypeEnum),
                ct);
            names.Add(listResult.Items.First().WorkerCategoryTypeName);
        }
        return names;
    }
}

public record BizLicencePrintingTransformRequest(Guid LicenceId) : DocumentTransformRequest;

public record BizLicencePrintingJson
{
    [JsonPropertyName("licenceNumber")]
    public string LicenceNumber { get; set; } = null!;

    [JsonPropertyName("licenceType")]
    public string LicenceType { get; set; } = null!; //Armoured Vehicle Permit, Body Armour Permit, Security Worker Licence, Security Business Licence

    [JsonPropertyName("photo")]
    public string Photo { get; set; } = null!; //only apply to personal licence, no photo for biz licence

    [JsonPropertyName("licenceCategories")]
    public IEnumerable<string> LicenceCategories { get; set; } = Enumerable.Empty<string>();//["Security Guard", "Locksmith"], only has value for swl and biz licence

    [JsonPropertyName("applicantName")]
    public string ApplicantName { get; set; } = null!; //we guess it is biz legal name

    [JsonPropertyName("doingBusinessAsName")]
    public string? DoingBusinessAsName { get; set; } //only apply to biz licence

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
    public IEnumerable<BranchAddress> BranchOffices { get; set; } = Enumerable.Empty<BranchAddress>(); //only apply to biz licence

    [JsonPropertyName("conditions")]
    public IEnumerable<string> Conditions { get; set; } = Enumerable.Empty<string>(); //only apply to personal licence, no conditions for biz licence

    [JsonPropertyName("SPD_CARD")]
    public SPD_CARD? SPD_CARD { get; set; } //only apply to personal licence, no spd_card for biz licence
}

