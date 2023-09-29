namespace Spd.Resource.Applicants.Delegates
{
    public interface IDelegateRepository
    {
        public Task<DelegateListResp> QueryAsync(DelegateQry cmd, CancellationToken cancellationToken);
        public Task<DelegateResp> ManageAsync(DelegateCmd cmd, CancellationToken cancellationToken);
    }

    public record DelegateListResp
    {
        public IEnumerable<DelegateResp> Items { get; set; } = Array.Empty<DelegateResp>();
    }

    public record DelegateResp
    {
        public Guid Id { get; set; }
        public Guid ApplicationId { get; set; }
        public Guid PortalUserId { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string EmailAddress { get; set; } = null!;
        public PSSOUserRoleEnum PSSOUserRoleCode { get; set; }
    }

    public record DelegateQry
    {
        public DelegateQry(Guid applicationId)
        {
            ApplicationId = applicationId;
        }
        public Guid? ApplicationId { get; set; }
        public Guid? PortalUserId { get; set; }
        public string? EmailAddress { get; set; }
    };

    public abstract record DelegateCmd { };
    public record CreateDelegateCmd : DelegateCmd
    {
        public Guid ApplicationId { get; set; }
        public Guid? PortalUserId { get; set; }
        public PSSOUserRoleEnum PSSOUserRoleCode { get; set; } = PSSOUserRoleEnum.Delegate;
    }

    public record DeleteDelegateCmd(Guid Id) : DelegateCmd;

    public enum PSSOUserRoleEnum
    {
        Delegate,
        Initiator
    }
}
