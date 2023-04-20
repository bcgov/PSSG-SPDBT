using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Tests.Presentation.Screening
{
    public class DynamicsTestData
    {
        private readonly string testPrefix="spd-auto-test";
        private readonly DynamicsContext _context;

        public DynamicsTestData(IDynamicsContextFactory factory)
        {
            _context = factory.Create();
        }

        public async Task CreateOrg(Guid orgId, string orgName)
        {
            _context.AddToaccounts(new account
            {
                accountid = orgId,
                name = $"{testPrefix}{orgName}",
                spd_organizationlegalname = $"{testPrefix}{orgName}",
                address1_city = "victoria",
            });
            await _context.SaveChangesAsync();
        }


    }
}
