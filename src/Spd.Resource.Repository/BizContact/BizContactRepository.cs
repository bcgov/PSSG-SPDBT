using AutoMapper;
using MediatR;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Logging;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Exceptions;

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

            return _mapper.Map<IEnumerable<BizContactResp>>(bizContacts.ToList());
        }

        public async Task<Unit> ManageBizContactsAsync(BizContactUpsertCmd cmd, CancellationToken ct)
        {
            IQueryable<spd_businesscontact> bizContacts = _context.spd_businesscontacts;
            if (cmd.BizId != null)
                bizContacts = bizContacts.Where(a => a._spd_organizationid_value == cmd.BizId);
            if (cmd.AppId != null)
                bizContacts = bizContacts.Where(a => a._spd_application_value == cmd.AppId);
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
                account? biz = _context.accounts.Where(a => a.accountid == cmd.BizId).FirstOrDefault();
                spd_application? app = _context.spd_applications.Where(a => a.spd_applicationid == cmd.AppId).FirstOrDefault();
                foreach (var item in toAdd)
                {
                    spd_businesscontact bizContact = _mapper.Map<spd_businesscontact>(item);
                    _context.AddTospd_businesscontacts(bizContact);
                    if (item.LicenceId != null)
                    {
                        spd_licence swlLic = _context.spd_licences.Where(l => l.spd_licenceid == item.LicenceId).FirstOrDefault();
                        if (swlLic == null
                            || swlLic.statecode == DynamicsConstants.StateCode_Inactive
                            || swlLic._spd_licencetype_value != DynamicsContextLookupHelpers.ServiceTypeGuidDictionary[ServiceTypeEnum.SecurityWorkerLicence.ToString()])
                        {
                            throw new ApiException(System.Net.HttpStatusCode.BadRequest, "invalid licence");
                        }
                        _context.SetLink(bizContact, nameof(bizContact.spd_SWLNumber), swlLic);
                    }
                    if (item.ContactId != null)
                    {
                        contact c = _context.contacts.Where(l => l.contactid == item.ContactId).FirstOrDefault();
                        if (c == null)
                            throw new ApiException(System.Net.HttpStatusCode.BadRequest, "invalid contact");
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
