using MediatR;
using Spd.Resource.Repository.Application;

namespace Spd.Resource.Repository.BizContact
{
    public interface IBizContactRepository
    {
        Task<BizContactResp> GetBizContactAsync(Guid bizContactId, CancellationToken ct);
        Task<IEnumerable<BizContactResp>> QueryBizContactsAsync(BizContactQry qry, CancellationToken ct);
        Task<Unit> ManageBizContactsAsync(BizContactUpsertCmd cmd, CancellationToken ct);
    }
    //command
    public record BizContactUpsertCmd(Guid BizId, List<BizContactResp> Data);

    //query
    public record BizContactQry(Guid? BizId, Guid? AppId, BizContactRoleEnum? RoleCode = null, bool IncludeInactive = false);

    //shared content
    public record BizContactResp
    {
        public Guid? BizContactId { get; set; }
        public string? EmailAddress { get; set; }
        public string? GivenName { get; set; }
        public string? MiddleName1 { get; set; }
        public string? MiddleName2 { get; set; }
        public string? Surname { get; set; }
        public Guid? ContactId { get; set; }
        public Guid? LicenceId { get; set; }
        public BizContactRoleEnum BizContactRoleCode { get; set; } = BizContactRoleEnum.ControllingMember;
        public Guid BizId { get; set; }
        public Guid? LatestControllingMemberCrcAppId { get; set; }
        public ApplicationPortalStatusEnum? LatestControllingMemberCrcAppPortalStatusEnum { get; set; }
        public Guid? LatestControllingMemberInvitationId { get; set; }
        public ApplicationInviteStatusEnum? LatestControllingMemberInvitationStatusEnum { get; set; }
    }

    public enum BizContactRoleEnum
    {
        ControllingMember,
        Employee
    }
}
