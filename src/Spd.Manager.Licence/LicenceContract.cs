using MediatR;
using Spd.Manager.Shared;

namespace Spd.Manager.Licence;

public interface ILicenceManager
{
    public Task<LicenceResponse> Handle(LicenceByIdQuery query, CancellationToken ct);
    public Task<LicenceResponse> Handle(LicenceQuery query, CancellationToken ct);
    public Task<IEnumerable<LicenceBasicResponse>> Handle(LicenceListQuery query, CancellationToken ct);
    public Task<FileResponse> Handle(LicencePhotoQuery query, CancellationToken ct);
}

public record LicenceBasicResponse
{
    public Guid? LicenceId { get; set; }
    public Guid? LicenceAppId { get; set; }
    public string? LicenceNumber { get; set; }
    public DateOnly ExpiryDate { get; set; }
    public WorkerLicenceTypeCode? WorkerLicenceTypeCode { get; set; }
    public LicenceTermCode? LicenceTermCode { get; set; }
    public string? LicenceHolderName { get; set; }
    public Guid? LicenceHolderId { get; set; }
    public string? NameOnCard { get; set; }
    public LicenceStatusCode LicenceStatusCode { get; set; }

    //issued categories
    public IEnumerable<WorkerCategoryTypeCode> CategoryCodes { get; set; } = Array.Empty<WorkerCategoryTypeCode>();
};

public record LicenceResponse : LicenceBasicResponse
{
    //permit info
    public string? PermitOtherRequiredReason { get; set; }
    public string? EmployerName { get; set; }
    public string? SupervisorName { get; set; }
    public string? SupervisorEmailAddress { get; set; }
    public string? SupervisorPhoneNumber { get; set; }
    public Address? EmployerPrimaryAddress { get; set; }
    public string? Rationale { get; set; }
    public IEnumerable<BodyArmourPermitReasonCode> BodyArmourPermitReasonCodes { get; set; } = []; //for body armour
    public IEnumerable<ArmouredVehiclePermitReasonCode> ArmouredVehiclePermitReasonCodes { get; set; } = []; // for armour vehicle
    public IEnumerable<Document> RationalDocumentInfos { get; set; } = [];

    //biz info
    public BizTypeCode BizTypeCode { get; set; } = BizTypeCode.None;

    //swl & biz info
    public bool UseDogs { get; set; }
    public bool IsDogsPurposeProtection { get; set; }
    public bool IsDogsPurposeDetectionDrugs { get; set; }
    public bool IsDogsPurposeDetectionExplosives { get; set; }
    public IEnumerable<Document> DogDocumentInfos { get; set; } = [];

    //swl
    public bool CarryAndUseRestraints { get; set; }
    public IEnumerable<Document> RestraintsDocumentInfos { get; set; } = [];
};

public record LicenceQuery(string? LicenceNumber, string? AccessCode) : IRequest<LicenceResponse>;
public record LicenceByIdQuery(Guid LicenceId) : IRequest<LicenceResponse>;
public record LicenceListQuery(Guid? ApplicantId, Guid? BizId) : IRequest<IEnumerable<LicenceBasicResponse>>;
public record LicencePhotoQuery(Guid LicenceId) : IRequest<FileResponse>;
