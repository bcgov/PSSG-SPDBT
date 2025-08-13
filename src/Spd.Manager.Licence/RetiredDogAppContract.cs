using MediatR;

namespace Spd.Manager.Licence;
public interface IRetiredDogAppManager
{
    //anonymous
    public Task<RetiredDogAppCommandResponse> Handle(RetiredDogLicenceAppAnonymousSubmitCommand command, CancellationToken ct);

    //auth
    public Task<RetiredDogLicenceAppResponse> Handle(RetiredDogLicenceApplicationQuery query, CancellationToken ct);
    public Task<RetiredDogAppCommandResponse> Handle(RetiredDogLicenceAppUpsertCommand command, CancellationToken ct);
    public Task<RetiredDogAppCommandResponse> Handle(RetiredDogLicenceAppSubmitCommand command, CancellationToken ct);
    public Task<RetiredDogAppCommandResponse> Handle(RetiredDogLicenceAppReplaceCommand command, CancellationToken ct);
    public Task<RetiredDogAppCommandResponse> Handle(RetiredDogLicenceAppRenewCommand command, CancellationToken ct);
}

#region authenticated
public record RetiredDogLicenceAppUpsertCommand(RetiredDogLicenceAppUpsertRequest UpsertRequest) : IRequest<RetiredDogAppCommandResponse>;
public record RetiredDogLicenceAppSubmitCommand(RetiredDogLicenceAppUpsertRequest UpsertRequest) : RetiredDogLicenceAppUpsertCommand(UpsertRequest), IRequest<RetiredDogAppCommandResponse>;
public record RetiredDogLicenceAppReplaceCommand(RetiredDogLicenceAppChangeRequest ChangeRequest, IEnumerable<LicAppFileInfo> LicAppFileInfos) : IRequest<RetiredDogAppCommandResponse>;
public record RetiredDogLicenceAppRenewCommand(RetiredDogLicenceAppChangeRequest ChangeRequest, IEnumerable<LicAppFileInfo> LicAppFileInfos) : IRequest<RetiredDogAppCommandResponse>;
public record RetiredDogLicenceApplicationQuery(Guid LicenceApplicationId) : IRequest<RetiredDogLicenceAppResponse>;
#endregion

#region anonymous
public record RetiredDogLicenceAppAnonymousSubmitCommand(RetiredDogLicenceAppAnonymousSubmitRequest SubmitRequest, IEnumerable<LicAppFileInfo> LicAppFileInfos) : IRequest<RetiredDogAppCommandResponse>;
#endregion

public abstract record RetiredDogLicenceAppBase : LicenceAppBase
{
    //personal info
    public string? Surname { get; set; }
    public string? GivenName { get; set; }
    public string? MiddleName { get; set; }
    public MailingAddress? MailingAddress { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public string? PhoneNumber { get; set; }
    public string? EmailAddress { get; set; }
    public string? ApplicantOrLegalGuardianName { get; set; }
    public IEnumerable<DocumentRelatedInfo> DocumentRelatedInfos { get; set; } = Enumerable.Empty<DocumentRelatedInfo>();
    public DogInfo? DogInfo { get; set; }
    public bool? ConfirmDogLiveWithYouAfterRetire { get; set; }
}

public abstract record RetiredDogLicenceAppNew : RetiredDogLicenceAppBase
{
    public string? CurrentGDSDCertificateNumber { get; set; }
    public DateOnly? DogRetiredDate { get; set; }
}

public record RetiredDogLicenceAppUpsertRequest : RetiredDogLicenceAppNew
{
    public IEnumerable<Document>? DocumentInfos { get; set; }
    public Guid? LicenceAppId { get; set; }
    public Guid ApplicantId { get; set; }
}

public record RetiredDogLicenceAppAnonymousSubmitRequest : RetiredDogLicenceAppNew
{
    public IEnumerable<Guid>? DocumentKeyCodes { get; set; }
}

public record RetiredDogLicenceAppChangeRequest : RetiredDogLicenceAppBase
{
    public IEnumerable<Guid>? DocumentKeyCodes { get; set; }
    public IEnumerable<Guid>? PreviousDocumentIds { get; set; } //documentUrlId, used for renew
    public Guid OriginalLicenceId { get; set; } //for renew, replace, it should be original licence id.
    public Guid ApplicantId { get; set; }
    public Guid? DogId { get; set; }
}

public record RetiredDogLicenceAppResponse : RetiredDogLicenceAppNew
{
    public IEnumerable<Document> DocumentInfos { get; set; } = Enumerable.Empty<Document>();
    public Guid? LicenceAppId { get; set; }
    public string? CaseNumber { get; set; }
    public ApplicationPortalStatusCode? ApplicationPortalStatus { get; set; }
    public Guid ApplicantId { get; set; }
}

public record RetiredDogAppCommandResponse
{
    public Guid? LicenceAppId { get; set; }
}




