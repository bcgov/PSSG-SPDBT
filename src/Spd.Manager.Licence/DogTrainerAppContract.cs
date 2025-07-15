using MediatR;

namespace Spd.Manager.Licence;
public interface IDogTrainerAppManager
{
    //anonymous
    public Task<DogTrainerAppResponse> Handle(GetDogTrainerAppQuery query, CancellationToken ct);
    public Task<DogTrainerAppCommandResponse> Handle(DogTrainerLicenceAppAnonymousSubmitCommand command, CancellationToken ct);
    public Task<DogTrainerAppCommandResponse> Handle(DogTrainerLicenceAppReplaceCommand command, CancellationToken ct);
    public Task<DogTrainerAppCommandResponse> Handle(DogTrainerLicenceAppRenewCommand command, CancellationToken ct);
}

#region anonymous
public record GetDogTrainerAppQuery(Guid LicenceApplicationId) : IRequest<DogTrainerAppResponse>;
public record DogTrainerLicenceAppAnonymousSubmitCommand(DogTrainerRequest SubmitRequest, IEnumerable<LicAppFileInfo> LicAppFileInfos) : IRequest<DogTrainerAppCommandResponse>;
public record DogTrainerLicenceAppReplaceCommand(DogTrainerChangeRequest ChangeRequest, IEnumerable<LicAppFileInfo> LicAppFileInfos) : IRequest<DogTrainerAppCommandResponse>;
public record DogTrainerLicenceAppRenewCommand(DogTrainerChangeRequest ChangeRequest, IEnumerable<LicAppFileInfo> LicAppFileInfos) : IRequest<DogTrainerAppCommandResponse>;

#endregion

public record DogTrainerRequest : LicenceAppBase
{
    public Guid AccreditedSchoolId { get; set; }
    public string? AccreditedSchoolName { get; set; }
    public string? SchoolDirectorSurname { get; set; }
    public string? SchoolDirectorGivenName { get; set; }
    public string? SchoolDirectorMiddleName { get; set; }
    public string? SchoolContactPhoneNumber { get; set; }
    public string? SchoolContactEmailAddress { get; set; }

    //trainer info
    public string? TrainerSurname { get; set; }
    public string? TrainerGivenName { get; set; }
    public string? TrainerMiddleName { get; set; }
    public MailingAddress? TrainerMailingAddress { get; set; }
    public DateOnly? TrainerDateOfBirth { get; set; }
    public string? TrainerPhoneNumber { get; set; }
    public string? TrainerEmailAddress { get; set; }

    public IEnumerable<DocumentRelatedInfo> DocumentRelatedInfos { get; set; } = Enumerable.Empty<DocumentRelatedInfo>();
    public IEnumerable<Guid>? DocumentKeyCodes { get; set; }
}

public record DogTrainerChangeRequest : DogTrainerRequest
{
    public IEnumerable<Guid>? PreviousDocumentIds { get; set; } //documentUrlId, used for renew
    public Guid OriginalLicenceId { get; set; }
    public Guid ApplicantId { get; set; }
}

public record DogTrainerAppCommandResponse
{
    public Guid? LicenceAppId { get; set; }
}

public record DogTrainerAppResponse : DogTrainerRequest
{
    public Guid? LicenceAppId { get; set; }
    public string? CaseNumber { get; set; }
    public Guid? ApplicantId { get; set; }
    public ApplicationPortalStatusCode? ApplicationPortalStatus { get; set; }
    public IEnumerable<Document> DocumentInfos { get; set; } = Enumerable.Empty<Document>();
}

