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
        public string Name { get; set; } = null!;
        public PSSOUserRoleEnum PSSOUserRoleCode { get; set; }
    }

    public record DelegateQry 
    {
        public Guid? ApplicationId { get; set; }
        public Guid? PortalUserId { get; set; }
    };

    public abstract record DelegateCmd { };
    public record CreateDelegateCmd : DelegateCmd
    {
        public Guid ApplicationId { get; set; }
        public Guid PortalUserId { get; set; }
        public PSSOUserRoleEnum PSSOUserRoleCode { get; set; }
        public string Name { get; set; } = null!;
    }

    public enum PSSOUserRoleEnum
    {
        Delegate,
        HiringManager
    }
}
