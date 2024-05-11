using AutoMapper;
using Spd.Resource.Repository.Contact;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.LicenceApplication;
using Spd.Resource.Repository.OptionSet;
using Spd.Resource.Repository.Org;
using Spd.Resource.Repository.ServiceTypes;
using Spd.Utilities.FileStorage;
using Spd.Utilities.Printing.BCMailPlus;
using Spd.Utilities.Shared.Exceptions;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Text.Json.Serialization;

namespace Spd.Manager.Printing.Documents.TransformationStrategies;

internal class LicencePreviewTransformStrategy(ILicenceApplicationRepository licAppRepository,
    IContactRepository contactRepository,
    IOrgRepository orgRepository,
    IOptionSetRepository optionsetRepository,
    IServiceTypeRepository serviceTypeRepository,
    IDocumentRepository documentRepository,
    IMainFileStorageService fileStorageService,
    IMapper mapper)
    : BcMailPlusTransformStrategyBase<LicencePreviewTransformRequest, LicencePreviewJson>(Jobs.SecurityWorkerLicense)
{
    protected override async Task<LicencePreviewJson> CreateDocument(LicencePreviewTransformRequest request, CancellationToken cancellationToken)
    {
        //following is for personal licence.
        LicenceApplicationResp app = await licAppRepository.GetLicenceApplicationAsync(request.ApplicationId, cancellationToken);
        if (app == null) throw new ApiException(System.Net.HttpStatusCode.BadRequest, "Cannot find the application");

        LicencePreviewJson preview = mapper.Map<LicencePreviewJson>(app);
        preview.Photo = await EncodedPhoto((Guid)app.ContactId, cancellationToken);



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
        return new LicencePreviewJson();
    }

    private async Task<string> EncodedPhoto(Guid applicantId, CancellationToken cancellationToken)
    {
        DocumentListResp resp = await documentRepository.QueryAsync(
            new DocumentQry(ApplicantId: applicantId, FileType: DocumentTypeEnum.Photograph),
            cancellationToken);
        DocumentResp? photoDoc = resp.Items.OrderByDescending(d => d.UploadedDateTime).FirstOrDefault();
        if (photoDoc == null) throw new ApiException(System.Net.HttpStatusCode.InternalServerError, "cannot find photograph for the applicant");
        FileQueryResult fileResult = (FileQueryResult)await fileStorageService.HandleQuery(
            new FileQuery { Key = photoDoc.DocumentUrlId.ToString(), Folder = photoDoc.Folder },
            cancellationToken);
        using (var ms = new MemoryStream(fileResult.File.Content))
        {
            Image photo = Image.FromStream(ms);
            Image finalPhoto;
            if (photo.Size.Width < 600 && photo.Size.Height < 800)
            {
                //no need to resize as it is within 800 x 600 scope
                finalPhoto = photo;

            }
            else
            {
                //resize the image
                decimal widthRatio = Convert.ToDecimal(photo.Size.Width) / 600;
                decimal heightRatio = Convert.ToDecimal(photo.Size.Height) / 800;
                decimal existingImageRatio = Convert.ToDecimal(photo.Size.Width) / Convert.ToDecimal(photo.Size.Height);
                if (widthRatio > heightRatio)
                {
                    finalPhoto = ResizeImage(photo, 600, (int)(600 / existingImageRatio));
                }
                else
                {
                    finalPhoto = ResizeImage(photo, (int)(800 * existingImageRatio), 800);
                }
            }

            finalPhoto.Save("C:\\Users\\PeggyZ\\tempImage.jpg", ImageFormat.Jpeg);
            return Convert.ToBase64String(fileResult.File.Content);
        }

        return null;
    }

    /// <summary>
    /// Resize the image to the specified width and height.
    /// </summary>
    /// <param name="image">The image to resize.</param>
    /// <param name="width">The width to resize to.</param>
    /// <param name="height">The height to resize to.</param>
    /// <returns>The resized image.</returns>
    private static Bitmap ResizeImage(Image image, int width, int height)
    {
        var destRect = new Rectangle(0, 0, width, height);
        var destImage = new Bitmap(width, height);

        destImage.SetResolution(image.HorizontalResolution, image.VerticalResolution);

        using (var graphics = Graphics.FromImage(destImage))
        {
            graphics.CompositingMode = CompositingMode.SourceCopy;
            graphics.CompositingQuality = CompositingQuality.HighQuality;
            graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
            graphics.SmoothingMode = SmoothingMode.HighQuality;
            graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;

            using (var wrapMode = new ImageAttributes())
            {
                wrapMode.SetWrapMode(WrapMode.TileFlipXY);
                graphics.DrawImage(image, destRect, 0, 0, image.Width, image.Height, GraphicsUnit.Pixel, wrapMode);
            }
        }

        return destImage;
    }
}

public record LicencePreviewTransformRequest(Guid ApplicationId) : DocumentTransformRequest;
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

    ////[JsonPropertyName("mailingAddress1")]
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


