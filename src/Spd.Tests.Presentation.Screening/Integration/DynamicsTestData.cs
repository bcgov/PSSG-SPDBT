using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Tests.Presentation.Screening.Integration;

public class DynamicsTestData
{
    private readonly string testPrefix = "spd-auto-test";
    private readonly DynamicsContext _context;

    public DynamicsTestData(IDynamicsContextFactory factory)
    {
        _context = factory.Create();
    }

    public async Task<account> CreateOrg(string orgName)
    {
        var existing = _context.accounts
            .Where(a => a.spd_organizationlegalname == $"{testPrefix}{orgName}")
            .Where(a => a.statecode != DynamicsConstants.StateCode_Inactive)
            .FirstOrDefault();
        if (existing != null) return existing;
        else
        {
            Guid orgId = Guid.NewGuid();
            account newOne = new account
            {
                accountid = orgId,
                name = $"{testPrefix}{orgName}",
                spd_organizationlegalname = $"{testPrefix}{orgName}",
                address1_city = "victoria",
            };
            _context.AddToaccounts(newOne);
            await _context.SaveChangesAsync();
            return newOne;
        }
    }
}
