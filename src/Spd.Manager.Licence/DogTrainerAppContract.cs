using MediatR;

namespace Spd.Manager.Licence;
public interface IDogTrainerAppManager
{
    //anonymous
    public Task<GDSDAppCommandResponse> Handle(DogTrainerLicenceAppAnonymousSubmitCommand command, CancellationToken ct);
    public Task<GDSDAppCommandResponse> Handle(DogTrainerLicenceAppReplaceCommand command, CancellationToken ct);
    public Task<GDSDAppCommandResponse> Handle(DogTrainerLicenceAppRenewCommand command, CancellationToken ct);
}

#region anonymous
public record DogTrainerLicenceAppAnonymousSubmitCommand(DogTrainerAppNewRequest SubmitRequest, IEnumerable<LicAppFileInfo> LicAppFileInfos) : IRequest<GDSDAppCommandResponse>;
public record DogTrainerLicenceAppReplaceCommand(GDSDTeamLicenceAppAnonymousSubmitRequest SubmitRequest, IEnumerable<LicAppFileInfo> LicAppFileInfos) : IRequest<GDSDAppCommandResponse>;
public record DogTrainerLicenceAppRenewCommand(GDSDTeamLicenceAppAnonymousSubmitRequest SubmitRequest, IEnumerable<LicAppFileInfo> LicAppFileInfos) : IRequest<GDSDAppCommandResponse>;

#endregion

public abstract record DogTrainerAppNewRequest
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
}

public record DogTrainerLicenceAppAnonymousSubmitRequest : GDSDTeamLicenceAppNew
{
    public IEnumerable<Guid>? DocumentKeyCodes { get; set; }
}

public record DogTrainerAppCommandResponse
{
    public Guid? LicenceAppId { get; set; }
}

