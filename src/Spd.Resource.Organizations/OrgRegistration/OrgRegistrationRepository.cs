using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Manager.Membership.ViewModels;
using SPD.DynamicsProxy;

namespace Spd.Resource.Organizations.OrgRegistration
{
    public class OrgRegistrationRepository : IOrgRegistrationRepository
    {
        public readonly DynamicsContext _dynaContext;
        private readonly IMapper _mapper;
        public OrgRegistrationRepository(IDynamicsContextFactory ctx, IMapper mapper)
        {
            _dynaContext = ctx.Create();
            _mapper = mapper;
        }

        public async Task<bool> CreateOrgRegistrationAsync(OrgRegistrationCreateRequest createRequest, CancellationToken cancellationToken)
        {
            //need to investigate how to validate the request.
            var existed = _dynaContext.Spd_orgregistrations.Where(s => s.Spd_organizationname == createRequest.OrganizationName).ToList();
            if (existed.Count == 0)
            {
                Spd_orgregistration orgregistration = _mapper.Map<Spd_orgregistration>(createRequest);
                _dynaContext.AddToSpd_orgregistrations(orgregistration);
                await _dynaContext.SaveChangesAsync(cancellationToken);
            }
            else
            {
                throw new Exception("the organization has been registered.");
            }
            return true;
        }

        public async Task<List<OrgRegistrationResponse>> GetAllOrgRegistrations()
        {
            var orgs = await _dynaContext.Spd_orgregistrations.GetAllPagesAsync();
            //todo: add mapping here
            List<OrgRegistrationResponse> result = new List<OrgRegistrationResponse>();
            return result;
        }
    }
}
