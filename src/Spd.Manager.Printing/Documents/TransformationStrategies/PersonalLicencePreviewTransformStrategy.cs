using AutoMapper;
using SkiaSharp;
using Spd.Resource.Repository;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.Incident;
using Spd.Resource.Repository.Licence;
using Spd.Resource.Repository.PersonLicApplication;
using Spd.Resource.Repository.ServiceTypes;
using Spd.Resource.Repository.WorkerLicenceCategory;
using Spd.Utilities.FileStorage;
using Spd.Utilities.Printing.BCMailPlus;
using Spd.Utilities.Shared.Exceptions;
using Spd.Utilities.Shared.Tools;
using System.Net;
using System.Text.Json.Serialization;

namespace Spd.Manager.Printing.Documents.TransformationStrategies;

internal class PersonalLicencePreviewTransformStrategy(IPersonLicApplicationRepository personLicAppRepository,
    ILicenceRepository licRepository,
    IServiceTypeRepository serviceTypeRepository,
    IDocumentRepository documentRepository,
    IMainFileStorageService fileStorageService,
    IWorkerLicenceCategoryRepository workerLicenceCategoryRepository,
    IIncidentRepository incidentRepository,
    IMapper mapper)
    : BcMailPlusTransformStrategyBase<PersonalLicencePreviewTransformRequest, LicencePreviewJson>(Jobs.SecurityWorkerLicense)
{
    protected override async Task<LicencePreviewJson> CreateDocument(PersonalLicencePreviewTransformRequest request, CancellationToken cancellationToken)
    {
        LicenceListResp lics = await licRepository.QueryAsync(new LicenceQry() { LicenceId = request.LicenceId }, cancellationToken);
        if (lics == null || !lics.Items.Any())
            throw new ApiException(HttpStatusCode.BadRequest, "no licence found for the licenceId");

        LicenceResp lic = lics.Items.First();
        LicencePreviewJson preview = mapper.Map<LicencePreviewJson>(lic);
        var serviceTypeListResp = await serviceTypeRepository.QueryAsync(
                new ServiceTypeQry(null, Enum.Parse<ServiceTypeEnum>(preview.LicenceType)), cancellationToken);
        preview.LicenceType = serviceTypeListResp.Items.First().ServiceTypeName;
        if (lic.ServiceTypeCode == ServiceTypeEnum.SecurityWorkerLicence)
            preview.LicenceCategories = await GetCategoryNamesAsync(lic.CategoryCodes, cancellationToken);

        LicenceApplicationResp app = await personLicAppRepository.GetLicenceApplicationAsync((Guid)lic.LicenceAppId, cancellationToken);
        mapper.Map(app, preview);

        if (lic.PhotoDocumentUrlId == null)
            throw new ApiException(HttpStatusCode.InternalServerError, "No photograph for the licence");
        preview.Photo = await EncodedPhoto((Guid)lic.PhotoDocumentUrlId, cancellationToken);

        preview.SPD_CARD = mapper.Map<SPD_CARD>(app);
        preview.SPD_CARD.TemporaryLicence = lic.IsTemporary ?? false;

        //conditions
        IncidentListResp resp = await incidentRepository.QueryAsync(
            new IncidentQry() { ApplicationId = lic.LicenceAppId, IncludeInactive = true },
            cancellationToken);
        preview.Conditions = resp.Items.First().Conditions.Select(c => c.Name);

        return preview;
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

    private async Task<string> EncodedPhoto(Guid documentUrlId, CancellationToken cancellationToken)
    {
        DocumentResp photoDoc = await documentRepository.GetAsync(
            documentUrlId,
            cancellationToken);
        if (photoDoc == null)
            throw new ApiException(System.Net.HttpStatusCode.InternalServerError, "cannot find photograph for the applicant");

        FileQueryResult fileResult = (FileQueryResult)await fileStorageService.HandleQuery(
            new FileQuery { Key = photoDoc.DocumentUrlId.ToString(), Folder = photoDoc.Folder },
            cancellationToken);
        using (var ms = new MemoryStream(fileResult.File.Content))
        {
            SKImage photo = SKImage.FromEncodedData(ms);
            SKImage finalPhoto;
            if (photo.Width <= 600 && photo.Height <= 800)
            {
                //no need to resize as it is within 600 x 800 scope
                finalPhoto = photo;
            }
            else
            {
                //resize the image
                decimal widthRatio = Convert.ToDecimal(photo.Width) / 600;
                decimal heightRatio = Convert.ToDecimal(photo.Height) / 800;
                decimal existingImageRatio = Convert.ToDecimal(photo.Width) / Convert.ToDecimal(photo.Height);
                if (widthRatio > heightRatio)
                {
                    finalPhoto = ResizeImage(photo, 600, (int)(600 / existingImageRatio));
                }
                else
                {
                    finalPhoto = ResizeImage(photo, (int)(800 * existingImageRatio), 800);
                }
            }

            SKData encoded = finalPhoto.Encode(); //default is png
            // get a stream over the encoded data
            Stream memoryStream = encoded.AsStream();
            return memoryStream.ConvertToBase64();
        }
    }

    /// <summary>
    /// Resize the image to the specified width and height.
    /// </summary>
    /// <param name="image">The image to resize.</param>
    /// <param name="width">The width to resize to.</param>
    /// <param name="height">The height to resize to.</param>
    /// <returns>The resized image.</returns>
    private static SKImage ResizeImage(SKImage image, int width, int height)
    {
        using (var surface = SKSurface.Create(width, height, SKImageInfo.PlatformColorType, SKAlphaType.Premul))
        using (var paint = new SKPaint())
        {
            // high quality with antialiasing
            paint.IsAntialias = true;
            paint.FilterQuality = SKFilterQuality.High;

            // draw the bitmap to fill the surface
            surface.Canvas.DrawImage(image, new SKRectI(0, 0, width, height), paint);
            surface.Canvas.Flush();
            return surface.Snapshot();
        }
    }
}

public record PersonalLicencePreviewTransformRequest(Guid LicenceId) : DocumentTransformRequest;
public record LicencePreviewJson()
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
    public string ApplicantName { get; set; } = null!; //firstname middlename1 lastName

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

public record BranchAddress
{
    [JsonPropertyName("mailingAddress1")]
    public string? MailingAddress1 { get; set; }

    [JsonPropertyName("mailingAddress2")]
    public string? MailingAddress2 { get; set; }

    [JsonPropertyName("city")]
    public string? City { get; set; }

    [JsonPropertyName("country")]
    public string? Country { get; set; }

    [JsonPropertyName("postalCode")]
    public string? PostalCode { get; set; }

    [JsonPropertyName("provinceState")]
    public string? ProvinceState { get; set; }
}

