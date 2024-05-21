using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Logging;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.BizContact
{
    internal class BizContactRepository : IBizContactRepository
    {
        private readonly DynamicsContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<BizContactRepository> _logger;

        public BizContactRepository(IDynamicsContextFactory ctx,
            IMapper mapper,
            ILogger<BizContactRepository> logger)
        {
            _context = ctx.CreateChangeOverwrite();
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<IEnumerable<BizContactResp>> GetBizAppContactsAsync(BizContactQry qry, CancellationToken ct)
        {
            IQueryable<spd_businesscontact> bizContacts = _context.spd_businesscontacts;
            if (!qry.IncludeInactive)
                bizContacts = bizContacts.Where(a => a.statecode != DynamicsConstants.StateCode_Inactive);
            if (qry.BizId != null)
                bizContacts = bizContacts.Where(a => a._spd_organizationid_value == qry.BizId);
            if (qry.AppId != null)
                bizContacts = bizContacts.Where(a => a._spd_application_value == qry.AppId);

            return _mapper.Map<IEnumerable<BizContactResp>>(bizContacts.ToList());
        }


    }
}
