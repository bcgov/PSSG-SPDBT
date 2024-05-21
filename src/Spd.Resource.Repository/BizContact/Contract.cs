namespace Spd.Resource.Repository.BizContact
{
    public interface IBizContactRepository
    {
        Task<IEnumerable<BizContactResp>> GetBizAppContactsAsync(BizContactQry qry, CancellationToken ct);
        //Task<Unit> ManageBizAsync(BizContactCmd cmd, CancellationToken ct);
    }
    //command

    //query
    public record BizContactQry(Guid? BizId, Guid? AppId, bool IncludeInactive = false);

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
        public BizContactRoleEnum BizContactRoleCode { get; set; }
    }

    public enum BizContactRoleEnum
    {
        ControllingMember,
        Employee
    }
}
