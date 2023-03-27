using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Logging;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Organizations.Registration
{
    internal class OrgRegistrationRepository : IOrgRegistrationRepository
    {
        private readonly DynamicsContext _dynaContext;
        private readonly IMapper _mapper;
        private readonly ILogger<OrgRegistrationRepository> _logger;
        public OrgRegistrationRepository(IDynamicsContextFactory ctx, IMapper mapper, ILogger<OrgRegistrationRepository> logger)
        {
            _dynaContext = ctx.Create();
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<bool> AddRegistrationAsync(OrgRegistrationCreateCmd createRegistrationCmd, CancellationToken cancellationToken)
        {
            string key;
            if (createRegistrationCmd.RegistrationTypeCode == RegistrationTypeCode.Employee)
            {
                key = $"{createRegistrationCmd.RegistrationTypeCode}-{createRegistrationCmd.EmployeeOrganizationTypeCode}";
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

        public async Task<bool> CheckDuplicateAsync(SearchRegistrationQry searchQry, CancellationToken cancellationToken)
        {
            string key;
            if (searchQry.RegistrationTypeCode == RegistrationTypeCode.Employee)
            {
                key = $"{searchQry.RegistrationTypeCode}-{searchQry.EmployeeOrganizationTypeCode}";
            }
            else
            {
                key = $"{searchQry.RegistrationTypeCode}-{searchQry.VolunteerOrganizationTypeCode}";
            }
            DynamicsContextLookupHelpers.OrganizationTypeGuidDictionary.TryGetValue(key, out Guid typeGuid);

            var orgReg = _dynaContext.spd_orgregistrations.Expand(o => o.spd_OrganizationTypeId).Where(o =>
                o.spd_organizationname.Equals(searchQry.OrganizationName, StringComparison.InvariantCultureIgnoreCase) &&
                o.spd_postalcode == searchQry.MailingPostalCode &&
                (searchQry.GenericEmail != null && o.spd_email == searchQry.GenericEmail) && // only check when front end has a value
                o.spd_OrganizationTypeId.spd_organizationtypeid == typeGuid &&
                o.statecode != DynamicsConstants.StateCode_Inactive
            ).FirstOrDefault();
            return orgReg != null;
        }

    }
}
