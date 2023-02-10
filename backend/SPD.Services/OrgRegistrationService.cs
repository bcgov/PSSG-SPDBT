using SPD.Common.ViewModels.Organization;
using SPD.DynamicsProxy;
using SPD.DynamicsProxy.Entities;

namespace SPD.Services
{
    public interface IOrgRegistrationService
    {
        Task<bool> CreateOrgRegistrationAsync(OrgRegistrationCreateRequest createRequest, CancellationToken cancellationToken);
        Task<List<OrgRegistration>> GetAllOrgRegistrations();
    }
    public class OrgRegistrationService : IOrgRegistrationService
    {
        public readonly DynamicsContext _dynaContext;
        public OrgRegistrationService(IDynamicsContextFactory ctx)
        {
            _dynaContext = ctx.CreateReadOnly();
        }

        public async Task<bool> CreateOrgRegistrationAsync(OrgRegistrationCreateRequest createRequest, CancellationToken cancellationToken)
        {
            //add mapping to map createRequest to OrgRegistration
            await _dynaContext.AddAsync(new OrgRegistration()
            {
                Id = Guid.NewGuid(),
                IdentityNumber = "12345678",
                RegistrationNumber = "987654321",
                City = "Victoria",
                Province = "BC",
                AuthorizedContactPhoneNumber = "230-555-5555",
                AuthorizedContactBirthDate = new DateTime(1997, 3, 2),
                OrganizationLegalName = "Peggy Test"
            }, cancellationToken);
            return true;

        }

        //todo: change return type to list<orgRegistrationResponse>
        public async Task<List<OrgRegistration>> GetAllOrgRegistrations()
        {
            var orgs = await _dynaContext.OrgRegistrations.GetAllPagesAsync();
            //todo: add mapping here
            return orgs.ToList();
        }
    }
}
