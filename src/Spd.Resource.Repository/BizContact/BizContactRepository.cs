using AutoMapper;
using MediatR;
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

        public async Task<BizContactResp> GetBizContactAsync(Guid bizContactId, CancellationToken ct)
        {
            spd_businesscontact? bizContact = await _context.spd_businesscontacts
                .Expand(c => c.spd_businesscontact_spd_application)
                .Where(c => c.spd_businesscontactid == bizContactId)
                .FirstOrDefaultAsync(ct);

            if (bizContact == null)
                throw new ApiException(HttpStatusCode.BadRequest, "Cannot find the business contact");

            return _mapper.Map<BizContactResp>(bizContact);


        }

        public async Task<IEnumerable<BizContactResp>> QueryBizAppContactsAsync(BizContactQry qry, CancellationToken ct)
        {
            IQueryable<spd_businesscontact> bizContacts = _context.spd_businesscontacts
                .Expand(c => c.spd_businesscontact_spd_application);
            if (qry.AppId != null) //change to n:n relationship, so have to do the separate way.
            {
                spd_application? app = _context.spd_applications.Expand(a => a.spd_businesscontact_spd_application)
                    .Where(a => a.spd_applicationid == qry.AppId)
                    .FirstOrDefault();
                if (app != null)
                {
                    IList<spd_businesscontact> bizContactList = app.spd_businesscontact_spd_application.ToList();
                    if (!qry.IncludeInactive)
                    {
                        bizContactList = bizContactList.Where(a => a.statecode != DynamicsConstants.StateCode_Inactive).ToList();
                    }
                    if (qry.RoleCode != null)
                        bizContactList = bizContactList.Where(a => a.spd_role == (int?)SharedMappingFuncs.GetOptionset<BizContactRoleEnum, BizContactRoleOptionSet>(qry.RoleCode)).ToList();
                    return _mapper.Map<IEnumerable<BizContactResp>>(bizContactList);
                }
            }

            if (!qry.IncludeInactive)
                bizContacts = bizContacts.Where(a => a.statecode != DynamicsConstants.StateCode_Inactive);
            if (qry.BizId != null)
                bizContacts = bizContacts.Where(a => a._spd_organizationid_value == qry.BizId);
            if (qry.RoleCode != null)
                bizContacts = bizContacts.Where(a => a.spd_role == (int?)SharedMappingFuncs.GetOptionset<BizContactRoleEnum, BizContactRoleOptionSet>(qry.RoleCode));

            return _mapper.Map<IEnumerable<BizContactResp>>(bizContacts.ToList());
        }

        public async Task<Unit> ManageBizContactsAsync(BizContactUpsertCmd cmd, CancellationToken ct)
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

            spd_application? app = null;
            if (cmd.AppId != null)
            {
                app = await _context.GetApplicationById((Guid)cmd.AppId, ct);
                if (app == null) throw new ApiException(HttpStatusCode.BadRequest, $"Application {cmd.AppId} does not exist.");
            }

            //update all that in cmd.Data
            var toModify = list.Where(c => cmd.Data.Any(d => d.BizContactId == c.spd_businesscontactid));
            foreach (var item in toModify)
            {
                _mapper.Map(cmd.Data.FirstOrDefault(d => d.BizContactId == item.spd_businesscontactid), item);
                _context.UpdateObject(item);
                if (app != null && !item.spd_businesscontact_spd_application.Any(a => a.spd_applicationid == cmd.AppId))
                    _context.AddLink(item, nameof(item.spd_businesscontact_spd_application), app);
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
                        bizContact.spd_fullname = $"{c.lastname},{c.firstname}";
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
                    if (app != null)
                        _context.AddLink(bizContact, nameof(bizContact.spd_businesscontact_spd_application), app);
                }
            }
            await _context.SaveChangesAsync(ct);
            return default;
        }

    }
}
