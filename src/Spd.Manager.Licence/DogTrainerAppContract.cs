using MediatR;

namespace Spd.Manager.Licence;
public interface IDogTrainerAppManager
{
    //anonymous
    public Task<DogTrainerAppCommandResponse> Handle(DogTrainerLicenceAppAnonymousSubmitCommand command, CancellationToken ct);
    public Task<DogTrainerAppCommandResponse> Handle(DogTrainerLicenceAppReplaceCommand command, CancellationToken ct);
    public Task<DogTrainerAppCommandResponse> Handle(DogTrainerLicenceAppRenewCommand command, CancellationToken ct);
}

#region anonymous
public record DogTrainerLicenceAppAnonymousSubmitCommand(DogTrainerRequest SubmitRequest, IEnumerable<LicAppFileInfo> LicAppFileInfos) : IRequest<DogTrainerAppCommandResponse>;
public record DogTrainerLicenceAppReplaceCommand(DogTrainerRequest SubmitRequest, IEnumerable<LicAppFileInfo> LicAppFileInfos) : IRequest<DogTrainerAppCommandResponse>;
public record DogTrainerLicenceAppRenewCommand(DogTrainerRequest SubmitRequest, IEnumerable<LicAppFileInfo> LicAppFileInfos) : IRequest<DogTrainerAppCommandResponse>;

#endregion

public abstract record DogTrainerRequest
{
    public string? AccreditSchoolName { get; set; }
    public MailingAddress? SchoolMailingAddress { get; set; }
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

public record DogTrainerAppCommandResponse
{
    public Guid? LicenceAppId { get; set; }
}

