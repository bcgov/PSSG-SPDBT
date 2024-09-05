using System.Collections.Immutable;
using System.Net;
using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OData.Client;
using Spd.Resource.Repository.Registration;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Exceptions;

namespace Spd.Resource.Repository.Org
{
    internal class OrgRepository : IOrgRepository
    {
        private readonly DynamicsContext _dynaContext;
        private readonly IMapper _mapper;

        public OrgRepository(IDynamicsContextFactory ctx, IMapper mapper, ILogger<OrgRepository> logger)
        {
            _dynaContext = ctx.CreateChangeOverwrite();
            _mapper = mapper;
        }

        public async Task<OrgQryData?> QueryOrgAsync(OrgQry query, CancellationToken ct)
        {
            return query switch
            {
                OrgsQry q => await GetOrgsAsync(q, ct),
                OrgByIdentifierQry q => await GetOrgByIdentifierAsync(q, ct),
                _ => throw new NotSupportedException($"{query.GetType().Name} is not supported")
            };
        }

        public async Task<OrgManageResult?> ManageOrgAsync(OrgCmd cmd, CancellationToken ct)
        {
            return cmd switch
            {
                OrgUpdateCmd c => await OrgUpdateAsync(c, ct),
                OrgGuidUpdateCmd c => await OrgGuidUpdateAsync(c, ct),
                _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
            };
        }

        private async Task<OrgManageResult?> OrgUpdateAsync(OrgUpdateCmd updateOrgCmd, CancellationToken ct)
        {
            DataServiceCollection<account> orgs = new(_dynaContext.accounts.Where(p => p.accountid == updateOrgCmd.Org.Id));
            account? org = orgs.Any() ? orgs[0] : null;
            if (org == null)
            {
                throw new ApiException(HttpStatusCode.BadRequest, $"Cannot find the updating org with orgId = {updateOrgCmd.Org.Id}");
            }
            var response = _mapper.Map<OrgResult>(org);

            if (updateOrgCmd.Org.LicenseesNeedVulnerableSectorScreening == null)
            {
                var licenseeIsRequired = false;
                if (response.EmployeeOrganizationTypeCode != null)
                {
                    String[] employeeTypes = new string[] { EmployeeOrganizationTypeCode.Childcare.ToString(), EmployeeOrganizationTypeCode.Healthcare.ToString(), EmployeeOrganizationTypeCode.GovnBody.ToString(), EmployeeOrganizationTypeCode.ProvGovt.ToString() };
                    licenseeIsRequired = employeeTypes.Contains(response.EmployeeOrganizationTypeCode);
                }
                else if (response.VolunteerOrganizationTypeCode != null)
                {
                    String[] volunteerTypes = new string[] { VolunteerOrganizationTypeCode.Childcare.ToString(), VolunteerOrganizationTypeCode.Healthcare.ToString(), VolunteerOrganizationTypeCode.ProvGovt.ToString() };
                    licenseeIsRequired = volunteerTypes.Contains(response.VolunteerOrganizationTypeCode);
                }

                if (licenseeIsRequired == true)
                {
                    throw new ApiException(HttpStatusCode.BadRequest, "'Licensees Need Vulnerable Sector Screening' is required.");
                }
            }

            _mapper.Map(updateOrgCmd.Org, org);
            await _dynaContext.SaveChangesAsync(ct);

            return new OrgManageResult(_mapper.Map<OrgResult>(org));
        }

        private async Task<OrgManageResult?> OrgGuidUpdateAsync(OrgGuidUpdateCmd updateOrgGuidCmd, CancellationToken ct)
        {
            var org = await _dynaContext.GetOrgById(updateOrgGuidCmd.OrgId, ct);
            if (org == null)
                throw new ApiException(HttpStatusCode.BadRequest, "Cannot find the organization.");

            if (updateOrgGuidCmd.OrgGuid != null)
            {
                if (org.spd_orgguid == null)
                {
                    org.spd_orgguid = updateOrgGuidCmd.OrgGuid;
                    _dynaContext.UpdateObject(org);
                    await _dynaContext.SaveChangesAsync(ct);
                }
            }
            return new OrgManageResult(_mapper.Map<OrgResult>(org));
        }

        public async Task<bool> CheckDuplicateAsync(SearchOrgQry searchQry, CancellationToken cancellationToken)
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

            if (searchQry.GenericEmail.IsNullOrEmpty())
            {
                var org = _dynaContext.accounts.Expand(o => o.spd_OrganizationTypeId).Where(a =>
                    a.name == searchQry.OrganizationName &&
                    a.address1_postalcode == searchQry.MailingPostalCode &&
                    a.spd_OrganizationTypeId.spd_organizationtypeid == typeGuid &&
                    a.statecode != DynamicsConstants.StateCode_Inactive
                ).FirstOrDefault();
                return org != null;
            }
            else
            {
                // use email in the check
                var org = _dynaContext.accounts.Expand(o => o.spd_OrganizationTypeId).Where(a =>
                    a.name == searchQry.OrganizationName &&
                    a.address1_postalcode == searchQry.MailingPostalCode &&
                    a.emailaddress1 == searchQry.GenericEmail &&
                    a.spd_OrganizationTypeId.spd_organizationtypeid == typeGuid &&
                    a.statecode != DynamicsConstants.StateCode_Inactive
                ).FirstOrDefault();
                return org != null;
            }
        }

        private async Task<OrgsQryResult> GetOrgsAsync(OrgsQry query, CancellationToken ct)
        {
            IQueryable<account> accounts = _dynaContext.accounts.Expand(a => a.spd_account_spd_servicetype);
            if (!query.IncludeInactive)
                accounts = accounts.Where(a => a.statecode != DynamicsConstants.StateCode_Inactive);
            if (query.OrgGuid != null)
                accounts = accounts.Where(a => a.spd_orgguid == query.OrgGuid.ToString());
            if (query.ParentOrgId != null)
                accounts = accounts.Where(a => a._parentaccountid_value == query.ParentOrgId);
            if (query.OrgCode != null)
                accounts = accounts.Where(a => a.spd_orgcode == query.OrgCode);
            if (query.ServiceTypes != null && query.ServiceTypes.Any())
            {
                IEnumerable<Guid> stIds = query.ServiceTypes.Select(t => DynamicsContextLookupHelpers.ServiceTypeGuidDictionary.GetValueOrDefault(t.ToString()));
                var accountsList = (await accounts
                    .GetAllPagesAsync(ct))
                    .Where(a => stIds.Any(t => a.spd_account_spd_servicetype.Any(st => st.spd_servicetypeid == t)))
                    .ToList();
                return new OrgsQryResult(_mapper.Map<IEnumerable<OrgResult>>(accountsList));
            }

            return new OrgsQryResult(_mapper.Map<IEnumerable<OrgResult>>(accounts.ToList()));
        }

        private async Task<OrgQryData?> GetOrgByIdentifierAsync(OrgByIdentifierQry query, CancellationToken ct)
        {
            IQueryable<account> accounts = _dynaContext.accounts.Where(a => a.statecode != DynamicsConstants.StateCode_Inactive);

            if (query.OrgId != null)
                accounts = accounts.Where(a => a.accountid == query.OrgId);
            if (query.AccessCode != null)
                accounts = accounts.Where(a => a.spd_accesscode == query.AccessCode);

            account? org = await accounts.FirstOrDefaultAsync(ct);

            if (org == null) throw new ApiException(HttpStatusCode.BadRequest, $"Cannot find org for {query.OrgId.ToString() ?? query.AccessCode}");

            //tried with org expand, does not work. so have to make another call.
            List<spd_account_spd_servicetype> serviceTypes = _dynaContext.spd_account_spd_servicetypeset
                .Where(so => so.accountid == org.accountid)
                .ToList();

            if (!serviceTypes.Any())
                throw new ApiException(HttpStatusCode.InternalServerError, $"organization {org.name} does not have service type.");

            var response = _mapper.Map<OrgResult>(org);
            response.ServiceTypes = serviceTypes.Select(s => Enum.Parse<ServiceTypeCode>(DynamicsContextLookupHelpers.GetServiceTypeName(s.spd_servicetypeid)));
            return new OrgQryResult(response);
        }
    }
}