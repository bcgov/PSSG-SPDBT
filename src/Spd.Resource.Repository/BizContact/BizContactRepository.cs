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

        public async Task<IEnumerable<BizContactResp>> GetBizAppContactsAsync(BizContactQry qry, CancellationToken ct)
        {
            IQueryable<spd_businesscontact> bizContacts = _context.spd_businesscontacts;
            if (!qry.IncludeInactive)
                bizContacts = bizContacts.Where(a => a.statecode != DynamicsConstants.StateCode_Inactive);
            if (qry.BizId != null)
                bizContacts = bizContacts.Where(a => a._spd_organizationid_value == qry.BizId);
            if (qry.AppId != null)
                bizContacts = bizContacts.Where(a => a._spd_application_value == qry.AppId);
            if (qry.RoleCode != null)
                bizContacts = bizContacts.Where(a => a.spd_role == (int?)SharedMappingFuncs.GetOptionset<BizContactRoleEnum, BizContactRoleOptionSet>(qry.RoleCode));

            return _mapper.Map<IEnumerable<BizContactResp>>(bizContacts.ToList());
        }

        public async Task<Unit> ManageBizContactsAsync(BizContactUpsertCmd cmd, CancellationToken ct)
        {
            IQueryable<spd_businesscontact> bizContacts = _context.spd_businesscontacts
                .Where(a => a._spd_organizationid_value == cmd.BizId)
                .Where(a => a._spd_application_value == cmd.AppId);
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

            //add all that in cmd.Data which does not have id
            var toAdd = cmd.Data.Where(d => d.BizContactId == null).ToList();
            if (toAdd.Count > 0)
            {
                account? biz = await _context.GetOrgById(cmd.BizId, ct);
                if (biz == null) throw new ApiException(HttpStatusCode.BadRequest, $"account {cmd.BizId} does not exist.");
                spd_application? app = await _context.GetApplicationById(cmd.AppId, ct);
                if (app == null) throw new ApiException(HttpStatusCode.BadRequest, $"Application {cmd.AppId} does not exist.");
                foreach (var item in toAdd)
                {
                    spd_businesscontact bizContact = _mapper.Map<spd_businesscontact>(item);
                    _context.AddTospd_businesscontacts(bizContact);
                    if (item.LicenceId != null)
                    {
                        spd_licence? swlLic = _context.spd_licences.Where(l => l.spd_licenceid == item.LicenceId && l.statecode == DynamicsConstants.StateCode_Active).FirstOrDefault();
                        Guid swlServiceTypeId = DynamicsContextLookupHelpers.ServiceTypeGuidDictionary[ServiceTypeEnum.SecurityWorkerLicence.ToString()];
                        //only swl can be linked to.
                        if (swlLic == null || swlLic._spd_licencetype_value != swlServiceTypeId)
                            throw new ApiException(System.Net.HttpStatusCode.BadRequest, $"invalid licence {item.LicenceId}");
                        _context.SetLink(bizContact, nameof(bizContact.spd_SWLNumber), swlLic);
                    }
                    if (item.ContactId != null)
                    {
                        contact? c = await _context.GetContactById((Guid)item.ContactId, ct);
                        if (c == null)
                            throw new ApiException(HttpStatusCode.BadRequest, $"invalid contact {item.ContactId}");
                        _context.SetLink(bizContact, nameof(bizContact.spd_ContactId), c);
                    }
                    _context.SetLink(bizContact, nameof(bizContact.spd_OrganizationId), biz);
                    _context.SetLink(bizContact, nameof(bizContact.spd_Application), app);
                }
            }
            await _context.SaveChangesAsync(ct);
            return default;
        }

    }
}
