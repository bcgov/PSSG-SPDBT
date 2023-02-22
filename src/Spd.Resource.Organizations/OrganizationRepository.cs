using AutoMapper;
using Microsoft.Dynamics.CRM;
using SPD.DynamicsProxy;

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
            //need to investigate how to validate the request.
            //need to move validate to manager.
            var existed = _dynaContext.Spd_orgregistrations.Where(s => s.Spd_organizationname == createRegistrationCmd.OrganizationName).ToList();
            if (existed.Count == 0)
            {
                Spd_orgregistration orgregistration = _mapper.Map<Spd_orgregistration>(createRegistrationCmd);
                _dynaContext.AddToSpd_orgregistrations(orgregistration);
                await _dynaContext.SaveChangesAsync(cancellationToken);
            }
            else
            {
                throw new Exception("the organization has already been registered.");
            }
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
