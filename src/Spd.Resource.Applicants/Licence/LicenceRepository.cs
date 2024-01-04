using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Applicants.Licence;
internal class LicenceRepository : ILicenceRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;

    public LicenceRepository(IDynamicsContextFactory ctx,
        IMapper mapper)
    {
        _context = ctx.Create();
        _mapper = mapper;
    }
    public async Task<LicenceListResp> QueryAsync(LicenceQry qry, CancellationToken ct)
    {
        if (qry.LicenceNumber == null && qry.AccountId == null && qry.ContactId == null)
        {
            throw new ArgumentException("at least need 1 parameter to do licence query.");
        }

        IQueryable<spd_licence> lics = _context.spd_licences
            .Expand(i => i.spd_LicenceHolder_contact)
            .Expand(i => i.spd_CaseId);
        if (!qry.IncludeInactive)
            lics = lics.Where(d => d.statecode != DynamicsConstants.StateCode_Inactive);

        if (qry.ContactId != null)
        {
            lics = lics.Where(a => a._spd_licenceholder_value == qry.ContactId);
        }
        if (qry.AccountId != null)
        {
            lics = lics.Where(a => a._spd_licenceholder_value == qry.AccountId);
        }
        if (qry.LicenceNumber != null)
        {
            lics = lics.Where(a => a.spd_licencenumber == qry.LicenceNumber);
        }
        if (qry.Type != null)
        {
            Guid? serviceTypeId = _context.LookupServiceType(qry.Type.ToString()).spd_servicetypeid;
            lics = lics.Where(l => l._spd_licencetype_value == serviceTypeId);
        }
        if (qry.IsExpired != null)
        {
            lics = (bool)qry.IsExpired ? lics.Where(l => l.spd_expirydate <= DateTimeOffset.UtcNow) :
                lics.Where(l => l.spd_expirydate > DateTimeOffset.UtcNow);
        }
        if (qry.AccessCode != null)
        {
            lics = lics.Where(a => a.spd_LicenceHolder_contact.spd_accesscode == qry.AccessCode);
        }

        return new LicenceListResp()
        {
            Items = _mapper.Map<IEnumerable<LicenceResp>>(lics)
        };
    }

    public async Task<LicenceResp> ManageAsync(LicenceCmd cmd, CancellationToken ct)
    {
        return null;
    }
}


