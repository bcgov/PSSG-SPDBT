using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Exceptions;

namespace Spd.Resource.Repository.Licence;
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

    public async Task<LicenceBasicResp?> GetBasicAsync(Guid licenceId, CancellationToken ct)
    {
        spd_licence? licence;
        try
        {
            licence = await _context.spd_licences
                .Where(l => l.spd_licenceid == licenceId)
                .FirstOrDefaultAsync(ct);
        }
        catch (DataServiceQueryException ex)
        {
            if (ex.Response.StatusCode == 404)
                return null;
            else
                throw;
        }

        return _mapper.Map<LicenceBasicResp>(licence);
    }

    public async Task<LicenceResp?> GetAsync(Guid licenceId, CancellationToken ct)
    {
        spd_licence? licence;
        try
        {
            licence = await _context.spd_licences
                .Expand(i => i.spd_LicenceHolder_contact)
                .Expand(i => i.spd_LicenceHolder_account)
                .Expand(i => i.spd_spd_licence_spd_licencecondition)
                .Expand(i => i.spd_CaseId)
                .Expand(i => i.spd_SoleProprietorId)
                .Expand(i => i.spd_spd_licence_spd_caselicencecategory_licenceid)
                .Expand(i => i.spd_licence_spd_dogteam_LicenceId)
                .Where(l => l.spd_licenceid == licenceId)
                .FirstOrDefaultAsync(ct);
        }
        catch (DataServiceQueryException ex)
        {
            if (ex.Response.StatusCode == 404)
                return null;
            else
                throw;
        }

        return _mapper.Map<LicenceResp>(licence);
    }

    public async Task<LicenceListResp> QueryAsync(LicenceQry qry, CancellationToken ct)
    {
        IQueryable<spd_licence> lics = _context.spd_licences
            .Expand(i => i.spd_spd_licence_spd_caselicencecategory_licenceid)
            .Expand(i => i.spd_spd_licence_spd_licencecondition)
            .Expand(i => i.spd_LicenceHolder_contact)
            .Expand(i => i.spd_LicenceHolder_account)
            .Expand(i => i.spd_licence_spd_dogteam_LicenceId)
            .Expand(i => i.spd_CaseId);

        if (!qry.IncludeInactive)
            lics = lics.Where(d => d.statecode != DynamicsConstants.StateCode_Inactive);

        if (qry.IncludeInactive)
            lics = lics.Where(d => d.statuscode != (int)LicenceStatusOptionSet.Inactive && d.statuscode != (int)LicenceStatusOptionSet.Suspended);

        if (qry.LicenceId != null)
        {
            lics = lics.Where(a => a.spd_licenceid == qry.LicenceId);
        }
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
            Guid? serviceTypeId = DynamicsContextLookupHelpers.GetServiceTypeGuid(qry.Type.ToString());
            lics = lics.Where(l => l._spd_licencetype_value == serviceTypeId);
        }
        if (qry.IsExpired != null)
        {
            lics = (bool)qry.IsExpired ? lics.Where(l => l.statuscode == (int)LicenceStatusOptionSet.Expired) :
                lics.Where(l => l.statuscode != (int)LicenceStatusOptionSet.Expired);
        }
        if (qry.LastName != null || qry.FirstName != null)
        {
            lics = lics.Where(a => a.spd_LicenceHolder_contact.firstname == qry.FirstName && a.spd_LicenceHolder_contact.lastname == qry.LastName);
        }
        if (qry.BizName != null)
        {
            lics = lics.Where(a => a.spd_LicenceHolder_account.name.StartsWith(qry.BizName) || a.spd_LicenceHolder_account.spd_organizationlegalname.StartsWith(qry.BizName));
        }
        var result = lics.ToList();
        if (qry.AccessCode != null)
        {
            Guid? mdraServiceTypeId = DynamicsContextLookupHelpers.GetServiceTypeGuid(ServiceTypeEnum.MDRA.ToString());
            Guid? bizServiceTypeId = DynamicsContextLookupHelpers.GetServiceTypeGuid(ServiceTypeEnum.SecurityBusinessLicence.ToString());
            result = result.Where(r =>
                (r._spd_licencetype_value == mdraServiceTypeId && r.spd_LicenceHolder_account?.spd_accesscode == qry.AccessCode)
                || (r._spd_licencetype_value == bizServiceTypeId && r.spd_LicenceHolder_account?.spd_accesscode == qry.AccessCode)
                || r.spd_LicenceHolder_contact?.spd_accesscode == qry.AccessCode).ToList();
        }
        return new LicenceListResp()
        {
            Items = _mapper.Map<IEnumerable<LicenceResp>>(result)
        };
    }

    public async Task<LicenceResp> ManageAsync(UpdateLicenceCmd cmd, CancellationToken ct)
    {
        IQueryable<spd_licence> lics = _context.spd_licences
            .Expand(i => i.spd_LicenceHolder_contact)
            .Where(i => i.spd_licenceid == cmd.LicenceID);
        spd_licence? lic = lics.FirstOrDefault();
        if (lic == null)
            throw new ApiException(System.Net.HttpStatusCode.BadRequest, "Invalid licenceId");
        _mapper.Map<PermitLicence, spd_licence>(cmd.PermitLicence, lic);
        _context.UpdateObject(lic);
        await _context.SaveChangesAsync(ct);
        return _mapper.Map<LicenceResp>(lic);
    }
}

