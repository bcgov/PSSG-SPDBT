using AutoMapper;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Spd.Resource.Organizations.Registration;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

namespace Spd.Resource.Organizations.Org
{
    internal class OrgRepository : IOrgRepository
    {
        private readonly DynamicsContext _dynaContext;
        private readonly IMapper _mapper;
        public OrgRepository(IDynamicsContextFactory ctx, IMapper mapper, ILogger<OrgRepository> logger)
        {
            _dynaContext = ctx.Create();
            _mapper = mapper;
        }
        public async Task<OrgQryResult?> QueryOrgAsync(OrgQry query, CancellationToken ct)
        {
            return query switch
            {
                OrgByOrgGuidQry q => await GetOrgByOrgGuidAsync(q, ct),
                OrgByIdQry q => await GetOrgByOrgIdAsync(q, ct),
                _ => throw new NotSupportedException($"{query.GetType().Name} is not supported")
            };
        }

        public async Task<OrgManageResult?> ManageOrgAsync(OrgCmd cmd, CancellationToken ct)
        {
            return cmd switch
            {
                OrgUpdateCmd c => await OrgUpdateAsync(c, ct),
                _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
            };
        }

        private async Task<OrgManageResult?> OrgUpdateAsync(OrgUpdateCmd updateOrgCmd, CancellationToken ct)
        {
            var org = await _dynaContext.GetOrgById(updateOrgCmd.Org.Id, ct);
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

            _dynaContext.UpdateObject(org);
            await _dynaContext.SaveChangesAsync(ct);

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

        private async Task<OrgQryResult?> GetOrgByOrgGuidAsync(OrgByOrgGuidQry query, CancellationToken ct)
        {
            var account = await _dynaContext.accounts
                .Where(a => a.spd_orgguid == query.OrgGuid.ToString())
                .Where(a => a.statecode != DynamicsConstants.StateCode_Inactive)
                .FirstOrDefaultAsync(ct);
            if (account == null) return null;
            return new OrgQryResult(_mapper.Map<OrgResult>(account));
        }

        private async Task<OrgQryResult?> GetOrgByOrgIdAsync(OrgByIdQry query, CancellationToken ct)
        {
            var org = await _dynaContext.GetOrgById(query.OrgId, ct);
            if (org?.statecode == DynamicsConstants.StateCode_Inactive) return null;

            var response = _mapper.Map<OrgResult>(org);
            return new OrgQryResult(response);
        }
    }
}
