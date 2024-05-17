namespace Spd.Resource.Repository.BizContact
{
    public interface IBizContactRepository
    {
        Task<BizResult?> GetBizAppContactsAsync(Guid bizId, Guid appId, CancellationToken ct);
        Task<BizResult> ManageBizAsync(BizContactCmd cmd, CancellationToken ct);
    }
    //command

    //query

    //shared content

}
