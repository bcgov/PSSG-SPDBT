using Spd.Resource.Applicants.Delegates;

namespace Spd.Manager.Cases.Application
{
    internal partial class ApplicationManager
    {
        public async Task<DelegateListResponse> Handle(DelegateListQuery query, CancellationToken ct)
        {
            var delegates = await _delegateRepository.QueryAsync(new DelegateQry(query.ApplicationId), ct);
            var delegateResps = _mapper.Map<IEnumerable<DelegateResponse>>(delegates.Delegates);

            return new DelegateListResponse
            {
                Delegates = delegateResps
            };
        }

        public async Task<DelegateResponse> Handle(CreateDelegateCommand command, CancellationToken ct)
        {
            _portalUserRepository.QueryAsync()
            //var delegates = await _delegateRepository.QueryAsync(new DelegateQry(query.ApplicationId), ct);
            //var delegateResps = _mapper.Map<IEnumerable<DelegateResponse>>(delegates.Delegates);

            //return new DelegateListResponse
            //{
            //    Delegates = delegateResps
            //};
            return null;
        }
    }
}