namespace Spd.Resource.Repository.OptionSet
{
    public interface IOptionSetRepository
    {
        public Task<string?> GetLabelAsync<T>(T query, CancellationToken ct)
            where T : struct, Enum;
    }
}