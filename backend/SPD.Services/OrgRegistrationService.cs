using AutoMapper;
using Microsoft.Dynamics.CRM;
using SPD.Common.ViewModels.Organization;
using SPD.DynamicsProxy;

namespace SPD.Services
{
    public interface IOrgRegistrationService
    {
        Task<bool> CreateOrgRegistrationAsync(OrgRegistrationCreateRequest createRequest, CancellationToken cancellationToken);
        Task<List<OrgRegistrationResponse>> GetAllOrgRegistrations();
    }
    public class OrgRegistrationService : IOrgRegistrationService
    {
        public readonly DynamicsContext _dynaContext;
        private readonly IMapper _mapper;
        public OrgRegistrationService(IDynamicsContextFactory ctx, IMapper mapper)
        {
            _dynaContext = ctx.Create();
            _mapper = mapper;
        }

        public async Task<bool> CreateOrgRegistrationAsync(OrgRegistrationCreateRequest createRequest, CancellationToken cancellationToken)
        {
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

        //todo: change return type to list<orgRegistrationResponse>
        public async Task<List<OrgRegistrationResponse>> GetAllOrgRegistrations()
        {
            var orgs = await _dynaContext.Spd_orgregistrations.GetAllPagesAsync();
            //todo: add mapping here
            List<OrgRegistrationResponse> result = new List<OrgRegistrationResponse>();
            return result;
        }
    }
}
