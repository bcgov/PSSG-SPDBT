using Spd.Manager.Membership.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Spd.Resource.Organizations.OrgRegistration
{
    public interface IOrgRegistrationRepository
    {
        Task<bool> CreateOrgRegistrationAsync(OrgRegistrationCreateRequest createRequest, CancellationToken cancellationToken);
        Task<List<OrgRegistrationResponse>> GetAllOrgRegistrations();
    }

}
