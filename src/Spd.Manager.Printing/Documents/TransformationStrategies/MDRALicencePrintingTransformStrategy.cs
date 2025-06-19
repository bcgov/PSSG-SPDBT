using AutoMapper;
using Spd.Resource.Repository;
using Spd.Resource.Repository.Biz;
using Spd.Resource.Repository.Licence;
using Spd.Resource.Repository.ServiceTypes;
using Spd.Utilities.Printing.BCMailPlus;
using Spd.Utilities.Shared.Exceptions;
using System.Net;
using System.Text.Json.Serialization;

namespace Spd.Manager.Printing.Documents.TransformationStrategies;

internal class MDRALicencePrintingTransformStrategy(
    ILicenceRepository licRepository,
    IServiceTypeRepository serviceTypeRepository,
    IBizRepository bizRepository,
    IMapper mapper)
    : BcMailPlusTransformStrategyBase<MDRALicencePrintingTransformRequest, MDRALicencePrintingJson>(Jobs.MetalDealerAndRecyclersPermit)
{
    protected override async Task<MDRALicencePrintingJson> CreateDocument(MDRALicencePrintingTransformRequest request, CancellationToken cancellationToken)
    {
        LicenceListResp lics = await licRepository.QueryAsync(new LicenceQry() { LicenceId = request.LicenceId }, cancellationToken);
        if (lics == null || !lics.Items.Any())
            throw new ApiException(HttpStatusCode.BadRequest, "No licence found for the licenceId");
        LicenceResp lic = lics.Items.First();
        if (lic.ServiceTypeCode != ServiceTypeEnum.MDRA)
            throw new ApiException(HttpStatusCode.BadRequest, "The licence is not a business licence.");

        MDRALicencePrintingJson bizLicJson = mapper.Map<MDRALicencePrintingJson>(lic);
        var serviceTypeListResp = await serviceTypeRepository.QueryAsync(
                new ServiceTypeQry(null, Enum.Parse<ServiceTypeEnum>(bizLicJson.LicenceType)), cancellationToken);
        bizLicJson.LicenceType = serviceTypeListResp.Items.First().ServiceTypeName;

        BizResult? biz = await bizRepository.GetBizAsync((Guid)lic.LicenceHolderId, cancellationToken, includeMainOffice: true);
        mapper.Map(biz, bizLicJson);

        return bizLicJson;
    }
}

public record MDRALicencePrintingTransformRequest(Guid LicenceId) : DocumentTransformRequest;

public record MDRALicencePrintingJson
{
    [JsonPropertyName("licenceNumber")]
    public string LicenceNumber { get; set; } = null!;

    [JsonPropertyName("licenceType")]
    public string LicenceType { get; set; } = null!; //Metal Dealers and Recyclers Permit

    [JsonPropertyName("photo")]
    public string Photo { get; set; } = null!; //only apply to personal licence, no photo for mdra licence

    [JsonPropertyName("licenceCategories")]
    public IEnumerable<string> LicenceCategories { get; set; } = Enumerable.Empty<string>();//no use here

    [JsonPropertyName("applicantName")]
    public string ApplicantName { get; set; } = null!; //we guess it is mdra biz legal name

    [JsonPropertyName("doingBusinessAsName")]
    public string? DoingBusinessAsName { get; set; } //only apply to mdra biz trade name

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
    public IEnumerable<BranchAddress> BranchOffices { get; set; } = Enumerable.Empty<BranchAddress>(); //only apply to mdra biz licence

    [JsonPropertyName("conditions")]
    public IEnumerable<string> Conditions { get; set; } = Enumerable.Empty<string>(); //only apply to personal licence, no conditions for biz licence

    [JsonPropertyName("SPD_CARD")]
    public SPD_CARD? SPD_CARD { get; set; } //only apply to personal licence, no spd_card for mdra biz licence
}

