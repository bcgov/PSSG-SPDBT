namespace Spd.Resource.Repository.GDSDApp;
public interface IGDSDAppRepository
{
    public Task<GDSDAppCmdResp> CreateGDSDAppAsync(CreateGDSDAppCmd cmd, CancellationToken ct);
    public Task<GDSDAppCmdResp> SaveGDSDAppAsync(SaveGDSDAppCmd cmd, CancellationToken ct);
    public Task<GDSDAppResp> GetGDSDAppAsync(Guid licenceAppId, CancellationToken ct);
}

public record GDSDAppCmdResp(Guid LicenceAppId, Guid AccountId);

public record GDSDApp
{

}

public record SaveGDSDAppCmd() : GDSDApp
{
    public Guid? LicenceAppId { get; set; }
    public Guid ApplicantId { get; set; }
    public ApplicationStatusEnum ApplicationStatusEnum { get; set; } = ApplicationStatusEnum.Incomplete;
    public Guid? ExpiredLicenceId { get; set; }
    public bool? HasExpiredLicence { get; set; }
}

public record CreateGDSDAppCmd() : GDSDApp
{
    public ApplicationStatusEnum ApplicationStatusEnum { get; set; } = ApplicationStatusEnum.Incomplete;
    public Guid? OriginalApplicationId { get; set; }
    public Guid? OriginalLicenceId { get; set; }
};

public record GDSDAppResp() : GDSDApp
{

}

