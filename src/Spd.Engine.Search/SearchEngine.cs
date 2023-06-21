using AutoMapper;
using Spd.Utilities.Dynamics;

namespace Spd.Engine.Search
{
    internal class SearchEngine : ISearchEngine
    {
        private readonly DynamicsContext _context;
        private readonly IMapper _mapper;
        public SearchEngine(IDynamicsContextFactory context, IMapper mapper)
        {
            _context = context.Create();
            _mapper = mapper;
        }
        public async Task<SearchResponse> SearchAsync(SearchRequest request, CancellationToken ct)
        {
            return request switch
            {
                SharableClearanceSearchRequest q => await SearchSharableClearanceAsync(q, ct),
                _ => throw new NotSupportedException($"{request.GetType().Name} is not supported")
            };
        }

        private async Task<SharableClearanceSearchResponse> SearchSharableClearanceAsync(SharableClearanceSearchRequest request, CancellationToken ct)
        {
            return null;
        }
    }
}