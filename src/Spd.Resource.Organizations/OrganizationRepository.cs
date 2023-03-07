using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Organizations
{
    public class OrganizationRepository : IOrganizationRepository
    {
        public readonly DynamicsContext _dynaContext;
        private readonly IMapper _mapper;
        public OrganizationRepository(IDynamicsContextFactory ctx, IMapper mapper)
        {
            _dynaContext = ctx.Create();
            _mapper = mapper;
        }

        public async Task<bool> RegisterAsync(CreateRegistrationCmd createRegistrationCmd, CancellationToken cancellationToken)
        {
            string key;
            if (createRegistrationCmd.RegistrationTypeCode == RegistrationTypeCode.Employee)
            {
                key = $"{createRegistrationCmd.RegistrationTypeCode}-{createRegistrationCmd.EmployerOrganizationTypeCode}";
            }
            else
            {
                key = $"{createRegistrationCmd.RegistrationTypeCode}-{createRegistrationCmd.VolunteerOrganizationTypeCode}";
            }

            spd_orgregistration orgregistration = _mapper.Map<spd_orgregistration>(createRegistrationCmd);
            _dynaContext.AddTospd_orgregistrations(orgregistration);
            _dynaContext.SetLink(orgregistration, nameof(spd_orgregistration.spd_OrganizationTypeId), _dynaContext.LookupOrganizationType(key));
            await _dynaContext.SaveChangesAsync(cancellationToken);
            return true;
        }


        public async Task<List<RegistrationResponse>> GetAllOrgRegistrations()
        {
            var orgs = await _dynaContext.spd_orgregistrations.GetAllPagesAsync();
            //todo: add mapping here
            List<RegistrationResponse> result = new List<RegistrationResponse>();
            return result;
        }


    }
}
