using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Logging;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

namespace Spd.Resource.Repository.BizContact
{
    internal class BizContactRepository : IBizContactRepository
    {
        private readonly DynamicsContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<BizContactRepository> _logger;

        public BizContactRepository(IDynamicsContextFactory ctx,
            IMapper mapper,
            ILogger<BizContactRepository> logger)
        {
            _context = ctx.CreateChangeOverwrite();
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<BizContactResp?> GetBizContactAsync(Guid bizContactId, CancellationToken ct, bool includeInactive = false)
        {
            spd_businesscontact? bizContact = await _context.spd_businesscontacts
                .Expand(c => c.spd_businesscontact_spd_application)
                .Where(c => c.spd_businesscontactid == bizContactId)
                .FirstOrDefaultAsync(ct);

            if (bizContact == null)
                throw new ApiException(HttpStatusCode.BadRequest, "Cannot find the business contact");
            if (!includeInactive && bizContact.statecode == DynamicsConstants.StateCode_Inactive)
                return null;

            return _mapper.Map<BizContactResp>(bizContact);
        }

        public async Task<IEnumerable<BizContactResp>> QueryBizContactsAsync(BizContactQry qry, CancellationToken ct)
        {
            IQueryable<spd_businesscontact> bizContacts = _context.spd_businesscontacts
                .Expand(c => c.spd_position_spd_businesscontact)
                .Expand(c => c.spd_businesscontact_spd_application)
                .Expand(c => c.spd_businesscontact_spd_portalinvitation);

            if (!qry.IncludeInactive)
                bizContacts = bizContacts.Where(a => a.statecode != DynamicsConstants.StateCode_Inactive);
            if (qry.BizId != null)
                bizContacts = bizContacts.Where(a => a._spd_organizationid_value == qry.BizId);
            if (qry.RoleCode != null)
                bizContacts = bizContacts.Where(a => a.spd_role == (int?)SharedMappingFuncs.GetOptionset<BizContactRoleEnum, BizContactRoleOptionSet>(qry.RoleCode));

            return _mapper.Map<IEnumerable<BizContactResp>>(bizContacts.ToList());
        }

        public async Task<Guid?> ManageBizContactsAsync(BizContactCmd cmd, CancellationToken ct)
        {
            return cmd switch
            {
                BizContactCreateCmd c => await CreateBizContactAsync(c, ct),
                BizContactUpdateCmd c => await UpdateBizContactAsync(c, ct),
                BizContactDeleteCmd c => await DeleteBizContactAsync(c, ct),
                BizContactsLinkBizAppCmd c => await LinkBizContactsToBizApp(c.BizId, c.BizAppId, ct),
                _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
            };
        }

        private async Task<Guid?> LinkBizContactsToBizApp(Guid bizId, Guid bizAppId, CancellationToken ct)
        {
            IQueryable<spd_businesscontact> bizContacts = _context.spd_businesscontacts
                .Expand(c => c.spd_businesscontact_spd_application)
                .Where(c => c._spd_organizationid_value == bizId);
            spd_application? bizApp = _context.spd_applications.Where(a => a.spd_applicationid == bizAppId).FirstOrDefault();
            foreach (spd_businesscontact bc in bizContacts.Where(c => c.statecode == DynamicsConstants.StateCode_Active))
            {
                if (!bc.spd_businesscontact_spd_application.Any(a => a.spd_applicationid == bizAppId))
                {
                    _context.AddLink(bc, nameof(bc.spd_businesscontact_spd_application), bizApp);
                }
            }
            foreach (spd_businesscontact bc in bizContacts.Where(c => c.statecode == DynamicsConstants.StateCode_Inactive))
            {
                if (!bc.spd_businesscontact_spd_application.Any(a => a.spd_applicationid == bizAppId))
                {
                    _context.DeleteLink(bc, nameof(bc.spd_businesscontact_spd_application), bizApp);
                }
            }
            await _context.SaveChangesAsync(ct);
            return null;
        }

        private async Task<Guid?> CreateBizContactAsync(BizContactCreateCmd cmd, CancellationToken ct)
        {
            account? biz = await _context.GetOrgById(cmd.BizContact.BizId, ct);
            spd_businesscontact bizContact = _mapper.Map<spd_businesscontact>(cmd.BizContact);
            bizContact.spd_businesscontactid = Guid.NewGuid();
            contact? c = null;
            if (cmd.BizContact.ContactId != null)
            {
                c = await _context.GetContactById((Guid)cmd.BizContact.ContactId, ct);
                if (c == null)
                    throw new ApiException(HttpStatusCode.BadRequest, $"invalid contact {cmd.BizContact.ContactId.Value}");
            }
            _context.AddTospd_businesscontacts(bizContact);
            if (c != null)
                _context.SetLink(bizContact, nameof(bizContact.spd_ContactId), c);
            if (cmd.BizContact.LicenceId != null)
            {
                spd_licence? swlLic = _context.spd_licences.Where(l => l.spd_licenceid == cmd.BizContact.LicenceId && l.statecode == DynamicsConstants.StateCode_Active).FirstOrDefault();
                Guid swlServiceTypeId = DynamicsContextLookupHelpers.ServiceTypeGuidDictionary[ServiceTypeEnum.SecurityWorkerLicence.ToString()];
                //only swl can be linked to.
                if (swlLic == null || swlLic._spd_licencetype_value != swlServiceTypeId)
                    throw new ApiException(System.Net.HttpStatusCode.BadRequest, $"invalid licence {cmd.BizContact.LicenceId}");
                _context.SetLink(bizContact, nameof(bizContact.spd_SWLNumber), swlLic);
            }
            _context.SetLink(bizContact, nameof(bizContact.spd_OrganizationId), biz);
            await _context.SaveChangesAsync(ct);
            return bizContact.spd_businesscontactid;
        }

        private async Task<Guid?> DeleteBizContactAsync(BizContactDeleteCmd cmd, CancellationToken ct)
        {
            spd_businesscontact? bizContact = await _context.GetBizContactById(cmd.BizContactId, ct);

            if (bizContact == null)
                throw new ApiException(HttpStatusCode.BadRequest, $"business contact with id {cmd.BizContactId} not found.");

            Guid? cmServiceType = DynamicsContextLookupHelpers.GetServiceTypeGuid(ServiceTypeEnum.SECURITY_BUSINESS_LICENCE_CONTROLLING_MEMBER_CRC.ToString());
            spd_application? app = _context.spd_applications
                .Expand(a => a.spd_businesscontact_spd_application)
                .Where(x => x.spd_businesscontact_spd_application.Any(y => y.spd_businesscontactid == cmd.BizContactId))
                .Where(x => x._spd_servicetypeid_value == cmServiceType)
                .FirstOrDefault();

            if (app != null &&
                (app.statuscode == (int)ApplicationStatusOptionSet.Incomplete ||
                app.statuscode == (int)ApplicationStatusOptionSet.Draft ||
                app.statuscode == (int)ApplicationStatusOptionSet.PaymentPending ||
                app.statuscode == (int)ApplicationStatusOptionSet.ApplicantVerification))
            {
                app.statecode = DynamicsConstants.StateCode_Inactive;
                app.statuscode = (int)ApplicationStatusOptionSet.Cancelled;
                _context.UpdateObject(app);
            }
            bizContact.statecode = DynamicsConstants.StateCode_Inactive;
            bizContact.statuscode = DynamicsConstants.StatusCode_Inactive;
            _context.UpdateObject(bizContact);

            await _context.SaveChangesAsync(ct);
            return null;
        }

        private async Task<Guid?> UpdateBizContactAsync(BizContactUpdateCmd cmd, CancellationToken ct)
        {
            spd_businesscontact? bizContact = await _context.GetBizContactById(cmd.BizContactId, ct);
            if (bizContact == null) throw new ApiException(HttpStatusCode.BadRequest, "Cannot find the member.");
            if (bizContact.spd_role != (int)BizContactRoleOptionSet.ControllingMember && bizContact.spd_role != (int)BizContactRoleOptionSet.BusinessManager)
                throw new ApiException(HttpStatusCode.BadRequest, "Cannot update non-stakeholder.");
            if (bizContact._spd_swlnumber_value != null)
                throw new ApiException(HttpStatusCode.BadRequest, "Cannot update stakeholder with secure worker licence.");
            _mapper.Map<BizContact, spd_businesscontact>(cmd.BizContact, bizContact);
            _context.UpdateObject(bizContact);
            await _context.SaveChangesAsync(ct);
            return cmd.BizContactId;
        }

        private async Task<Guid?> UpsertBizContacts(BizContactUpsertCmd cmd, CancellationToken ct)
        {
            IQueryable<spd_businesscontact> bizContacts = _context.spd_businesscontacts
                .Expand(b => b.spd_businesscontact_spd_application)
                .Where(a => a.statecode == DynamicsConstants.StateCode_Active)
                .Where(a => a._spd_organizationid_value == cmd.BizId);
            var list = bizContacts.ToList();

            //remove all not in cmd.Data
            var toRemove = list.Where(c => !cmd.Data.Any(d => d.BizContactId == c.spd_businesscontactid));
            foreach (var item in toRemove)
            {
                item.statecode = DynamicsConstants.StateCode_Inactive;
                item.statuscode = DynamicsConstants.StatusCode_Inactive;
                _context.UpdateObject(item);
            }

            //update all that in cmd.Data
            var toModify = list.Where(c => cmd.Data.Any(d => d.BizContactId == c.spd_businesscontactid));
            foreach (var item in toModify)
            {
                _mapper.Map(cmd.Data.FirstOrDefault(d => d.BizContactId == item.spd_businesscontactid), item);
                _context.UpdateObject(item);
            }
            await _context.SaveChangesAsync(ct);

            //add all that in cmd.Data which does not have id
            var toAdd = cmd.Data.Where(d => d.BizContactId == null).ToList();
            if (toAdd.Count > 0)
            {
                account? biz = await _context.GetOrgById(cmd.BizId, ct);
                if (biz == null) throw new ApiException(HttpStatusCode.BadRequest, $"account {cmd.BizId} does not exist.");

                foreach (var item in toAdd)
                {
                    spd_businesscontact bizContact = _mapper.Map<spd_businesscontact>(item);

                    if (item.ContactId != null)
                    {
                        contact? c = await _context.GetContactById((Guid)item.ContactId, ct);
                        if (c == null)
                            throw new ApiException(HttpStatusCode.BadRequest, $"invalid contact {item.ContactId}");
                        _context.AddTospd_businesscontacts(bizContact);
                        _context.SetLink(bizContact, nameof(bizContact.spd_ContactId), c);
                    }
                    else
                    {
                        _context.AddTospd_businesscontacts(bizContact);
                    }
                    if (item.LicenceId != null)
                    {
                        spd_licence? swlLic = _context.spd_licences.Where(l => l.spd_licenceid == item.LicenceId && l.statecode == DynamicsConstants.StateCode_Active).FirstOrDefault();
                        Guid swlServiceTypeId = DynamicsContextLookupHelpers.ServiceTypeGuidDictionary[ServiceTypeEnum.SecurityWorkerLicence.ToString()];
                        //only swl can be linked to.
                        if (swlLic == null || swlLic._spd_licencetype_value != swlServiceTypeId)
                            throw new ApiException(System.Net.HttpStatusCode.BadRequest, $"invalid licence {item.LicenceId}");
                        _context.SetLink(bizContact, nameof(bizContact.spd_SWLNumber), swlLic);
                    }

                    _context.SetLink(bizContact, nameof(bizContact.spd_OrganizationId), biz);
                }
            }
            await _context.SaveChangesAsync(ct);
            return null;
        }

    }
}
