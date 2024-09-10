using Spd.Resource.Repository.Application;

namespace Spd.Resource.Repository.BizContact
{
    public interface IBizContactRepository
    {
        Task<BizContactResp?> GetBizContactAsync(Guid bizContactId, CancellationToken ct, bool includeInactive = false);
        Task<IEnumerable<BizContactResp>> QueryBizContactsAsync(BizContactQry qry, CancellationToken ct);
        Task<Guid?> ManageBizContactsAsync(BizContactCmd cmd, CancellationToken ct);
    }
    //command
    public interface BizContactCmd;
    public record BizContactUpsertCmd(Guid BizId, List<BizContactResp> Data) : BizContactCmd; //deprecated
    public record BizContactCreateCmd(BizContact BizContact) : BizContactCmd;
    public record BizContactUpdateCmd(Guid BizContactId, BizContact BizContact) : BizContactCmd;
    public record BizContactDeleteCmd(Guid BizContactId) : BizContactCmd;

    //query
    public record BizContactQry(Guid? BizId, Guid? AppId, BizContactRoleEnum? RoleCode = null, bool IncludeInactive = false);

    public record BizContactResp : BizContact
    {
        public Guid? BizContactId { get; set; }
        public Guid? LatestControllingMemberCrcAppId { get; set; }
        public ApplicationPortalStatusEnum? LatestControllingMemberCrcAppPortalStatusEnum { get; set; }
        public Guid? LatestControllingMemberInvitationId { get; set; }
        public ApplicationInviteStatusEnum? LatestControllingMemberInvitationStatusEnum { get; set; }
    }

    //shared content
    public record BizContact
    {
        public string? EmailAddress { get; set; }
        public string? GivenName { get; set; }
        public string? MiddleName1 { get; set; }
        public string? MiddleName2 { get; set; }
        public string? Surname { get; set; }
        public Guid? ContactId { get; set; }
        public Guid? LicenceId { get; set; }
        public BizContactRoleEnum BizContactRoleCode { get; set; } = BizContactRoleEnum.ControllingMember;
        public Guid BizId { get; set; }
    }

    public enum BizContactRoleEnum
    {
        ControllingMember,
        Employee
    }
}
