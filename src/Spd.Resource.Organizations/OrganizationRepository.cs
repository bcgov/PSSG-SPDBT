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
            int spdOrgCategory = createRegistrationCmd.RegistrationTypeCode == RegistrationTypeCode.Employee ?
                (int)RegistrationTypeOptionSet.Employee :
                (int)RegistrationTypeOptionSet.Volunteer;

            //refactor: if dynamics team decide to change the schema
            //if not, need to map the code to name (some name has spaces).
            string spdOrgName = createRegistrationCmd.RegistrationTypeCode == RegistrationTypeCode.Employee ?
                createRegistrationCmd.EmployerOrganizationTypeCode?.ToString() :
                createRegistrationCmd.VolunteerOrganizationTypeCode.ToString();

            spd_orgregistration orgregistration = _mapper.Map<spd_orgregistration>(createRegistrationCmd);
            _dynaContext.AddTospd_orgregistrations(orgregistration);
            _dynaContext.SetLink(orgregistration, nameof(spd_orgregistration.spd_OrganizationTypeId), _dynaContext.LookupOrganizationType(spdOrgCategory, spdOrgName));
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
