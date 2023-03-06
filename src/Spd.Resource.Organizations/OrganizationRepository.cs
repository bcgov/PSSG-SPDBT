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

            string spdOrgName = createRegistrationCmd.RegistrationTypeCode == RegistrationTypeCode.Employee ?
                createRegistrationCmd.EmployerOrganizationTypeCode?.ToString() :
                createRegistrationCmd.VolunteerOrganizationTypeCode.ToString();

            Spd_orgregistration orgregistration = _mapper.Map<Spd_orgregistration>(createRegistrationCmd);
           //orgregistration._spd_organizationtypeid_value = _dynaContext.LookupOrganizationType(spdOrgCategory, spdOrgName).Spd_organizationtypeid;
            _dynaContext.AddToSpd_orgregistrations(orgregistration);
            //_dynaContext.SetLink(orgregistration, nameof(Spd_orgregistration.Spd_OrganizationTypeId), _dynaContext.LookupOrganizationType(spdOrgCategory, spdOrgName));
            _dynaContext.AddLink(orgregistration, nameof(Spd_orgregistration.Spd_OrganizationTypeId), _dynaContext.LookupOrganizationType(spdOrgCategory, spdOrgName));
            await _dynaContext.SaveChangesAsync(cancellationToken);
            return true;
        }


        public async Task<List<RegistrationResponse>> GetAllOrgRegistrations()
        {
            var orgs = await _dynaContext.Spd_orgregistrations.GetAllPagesAsync();
            //todo: add mapping here
            List<RegistrationResponse> result = new List<RegistrationResponse>();
            return result;
        }


    }
}
