using Spd.Resource.Repository.PersonLicApplication;

namespace Spd.Resource.Repository.Licence
{
    public interface ILicenceRepository
    {
        public Task<LicenceListResp> QueryAsync(LicenceQry query, CancellationToken cancellationToken);
        public Task<LicenceResp> ManageAsync(UpdateLicenceCmd cmd, CancellationToken cancellationToken);
        public Task<LicenceResp?> GetAsync(Guid licenceId, CancellationToken cancellationToken);
    }

    public record LicenceQry
    {
        public Guid? LicenceId { get; set; }
        public string? LicenceNumber { get; set; }
        public string? AccessCode { get; set; }
        public Guid? ContactId { get; set; }
        public Guid? AccountId { get; set; }
        public ServiceTypeEnum? Type { get; set; }
        public bool IncludeInactive { get; set; }
        public bool? IsExpired { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? BizName { get; set; }
    };
    public record LicenceListResp
    {
        public IEnumerable<LicenceResp> Items { get; set; } = Array.Empty<LicenceResp>();
    }

    //we should only update fields for permit when there is update
    public record UpdateLicenceCmd(PermitLicence PermitLicence, Guid LicenceID);

    public record LicenceResp() : PermitLicence
    {
        public Guid? LicenceId { get; set; }
        public Guid? LicenceAppId { get; set; }
        public bool? IsTemporary { get; set; }
        public Guid? PhotoDocumentUrlId { get; set; }
        public string? PrintingPreviewJobId { get; set; }
        public DateTimeOffset CreatedOn { get; set; }

        //biz info
        public BizTypeEnum BizTypeCode { get; set; } = BizTypeEnum.None;
        public string? BizLegalName { get; set; }

        //swl & biz info
        public bool UseDogs { get; set; }
        public bool IsDogsPurposeProtection { get; set; }
        public bool IsDogsPurposeDetectionDrugs { get; set; }
        public bool IsDogsPurposeDetectionExplosives { get; set; }

        //swl
        public bool CarryAndUseRestraints { get; set; }

        //sole proprietor
        public Guid? SoleProprietorOrgId { get; set; }

        public IEnumerable<Condition> Conditions { get; set; } = Enumerable.Empty<Condition>();

        //gdsd
        public Guid? GDSDTeamId { get; set; }
        public Guid? DogId { get; set; }
        public string? DogName { get; set; }
        public DateOnly? DogDateOfBirth { get; set; }
        public string? DogBreed { get; set; }
        public string? DogColorAndMarkings { get; set; }
        public GenderEnum? DogGender { get; set; }
        public string? MicrochipNumber { get; set; }
    }

    public record Licence
    {
        public string? LicenceNumber { get; set; }
        public DateOnly ExpiryDate { get; set; }
        public ServiceTypeEnum? ServiceTypeCode { get; set; }
        public LicenceTermEnum? LicenceTermCode { get; set; }
        public Guid? LicenceHolderId { get; set; }
        public string? LicenceHolderFirstName { get; set; }
        public string? LicenceHolderLastName { get; set; }
        public string? LicenceHolderMiddleName1 { get; set; }
        public LicenceStatusEnum LicenceStatusCode { get; set; }
        public DateOnly? LicenceHolderDateOfBirth { get; set; }
        public string? NameOnCard { get; set; }

        //issued categories 
        public IEnumerable<WorkerCategoryTypeEnum> CategoryCodes { get; set; } = Array.Empty<WorkerCategoryTypeEnum>();
    }

    public record PermitLicence : Licence
    {
        //for permit 
        public string? PermitOtherRequiredReason { get; set; }
        public string? EmployerName { get; set; }
        public string? SupervisorName { get; set; }
        public string? SupervisorEmailAddress { get; set; }
        public string? SupervisorPhoneNumber { get; set; }
        public Addr? EmployerPrimaryAddress { get; set; }
        public string? Rationale { get; set; }
        public IEnumerable<PermitPurposeEnum>? PermitPurposeEnums { get; set; }
    }

    public record GDSDLicence : Licence
    {
    }

    public record Condition
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }

    public enum LicenceStatusEnum
    {
        Active,
        Inactive,
        Expired,
        Suspended,
        Preview
    }
}