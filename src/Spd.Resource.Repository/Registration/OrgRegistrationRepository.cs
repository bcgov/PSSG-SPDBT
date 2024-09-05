using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Logging;
using Microsoft.OData.Client;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.Registration
{
    internal class OrgRegistrationRepository : IOrgRegistrationRepository
    {
        private readonly DynamicsContext _dynaContext;
        private readonly IMapper _mapper;

        public OrgRegistrationRepository(IDynamicsContextFactory ctx, IMapper mapper, ILogger<OrgRegistrationRepository> logger)
        {
            _dynaContext = ctx.CreateChangeOverwrite();
            _mapper = mapper;
        }

        public async Task<OrgRegistrationQueryResult> Query(OrgRegistrationQuery query, CancellationToken ct)
        {
            var orgRegs = _dynaContext.spd_orgregistrations;

            if (!query.IncludeInactive)
                orgRegs = (DataServiceQuery<spd_orgregistration>)orgRegs.Where(o => o.statecode != DynamicsConstants.StateCode_Inactive);
            if (query.UserGuid != null)
                orgRegs = (DataServiceQuery<spd_orgregistration>)orgRegs.Where(o => o.spd_portaluseridentityguid == query.UserGuid.ToString());
            if (query.OrgGuid != null)
                orgRegs = (DataServiceQuery<spd_orgregistration>)orgRegs.Where(o => o.spd_identityguid == query.OrgGuid.ToString());
            if (query.RegistrationNumber != null)
                orgRegs = (DataServiceQuery<spd_orgregistration>)orgRegs.Where(o => o.spd_registrationnumber == query.RegistrationNumber);

            IEnumerable<spd_orgregistration> results = await orgRegs.GetAllPagesAsync(ct);
            return new OrgRegistrationQueryResult(_mapper.Map<IEnumerable<OrgRegistrationResult>>(results));
        }

        public async Task<bool> AddRegistrationAsync(CreateOrganizationRegistrationCommand createRegistrationCmd, CancellationToken ct)
        {
            string key;
            if (createRegistrationCmd.OrgRegistration.RegistrationTypeCode == RegistrationTypeCode.Employee)
            {
                key = $"{createRegistrationCmd.OrgRegistration.RegistrationTypeCode}-{createRegistrationCmd.OrgRegistration.EmployeeOrganizationTypeCode}";
            }
            else
            {
                key = $"{createRegistrationCmd.OrgRegistration.RegistrationTypeCode}-{createRegistrationCmd.OrgRegistration.VolunteerOrganizationTypeCode}";
            }

            spd_orgregistration orgregistration = _mapper.Map<spd_orgregistration>(createRegistrationCmd.OrgRegistration);
            _dynaContext.AddTospd_orgregistrations(orgregistration);

            Guid teamGuid = Guid.Parse(DynamicsConstants.Client_Service_Team_Guid);
            var serviceTeam = _dynaContext.teams.Where(t => t.teamid == teamGuid).FirstOrDefault();
            _dynaContext.SetLink(orgregistration, nameof(spd_orgregistration.ownerid), serviceTeam);
            _dynaContext.SetLink(orgregistration, nameof(spd_orgregistration.spd_OrganizationTypeId), _dynaContext.LookupOrganizationType(key));
            await _dynaContext.SaveChangesAsync(ct);

            spd_orgregistration? orgReg = await _dynaContext.spd_orgregistrations.Where(o => o.spd_orgregistrationid == orgregistration.spd_orgregistrationid).FirstOrDefaultAsync(ct);
            if (orgReg != null)
                orgReg.spd_preregistrationlink = $"{createRegistrationCmd.HostUrl}org-registration/registration/{orgReg.spd_registrationnumber}";
            _dynaContext.UpdateObject(orgReg);
            await _dynaContext.SaveChangesAsync(ct);
            return true;
        }

        public async Task<bool> CheckDuplicateAsync(SearchRegistrationQry searchQry, CancellationToken ct)
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

            if (string.IsNullOrEmpty(searchQry.GenericEmail))
            {
                // Do not check using email if there is no value
                var orgReg = _dynaContext.spd_orgregistrations.Expand(o => o.spd_OrganizationTypeId).Where(o =>
                    o.spd_organizationname == searchQry.OrganizationName &&
                    o.spd_postalcode == searchQry.MailingPostalCode &&
                    o.spd_OrganizationTypeId.spd_organizationtypeid == typeGuid &&
                    o.statecode != DynamicsConstants.StateCode_Inactive
                ).FirstOrDefaultAsync(ct);
                return orgReg != null;
            }
            else
            {
                var orgReg = _dynaContext.spd_orgregistrations.Expand(o => o.spd_OrganizationTypeId).Where(o =>
                    o.spd_organizationname == searchQry.OrganizationName &&
                    o.spd_postalcode == searchQry.MailingPostalCode &&
                    o.spd_email == searchQry.GenericEmail &&
                    o.spd_OrganizationTypeId.spd_organizationtypeid == typeGuid &&
                    o.statecode != DynamicsConstants.StateCode_Inactive
                ).FirstOrDefaultAsync(ct);
                return orgReg != null;
            }
        }
    }
}