﻿using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Resource.Repository.LicenceApplication;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

namespace Spd.Resource.Repository.BizLicApplication;
internal class BizLicApplicationRepository : IBizLicApplicationRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;

    public BizLicApplicationRepository(IDynamicsContextFactory ctx, IMapper mapper)
    {
        _context = ctx.CreateChangeOverwrite();
        _mapper = mapper;
    }

    public async Task<BizLicApplicationResp> GetBizLicApplicationAsync(Guid licenceApplicationId, CancellationToken ct)
    {
        spd_application? app = await _context.spd_applications
            .Expand(a => a.spd_ApplicantId_account)
            .Where(c => c.statecode != DynamicsConstants.StateCode_Inactive)
            .Where(a => a.spd_applicationid == licenceApplicationId)
            .FirstOrDefaultAsync(ct);

        if (app == null) 
            throw new ApiException(HttpStatusCode.NotFound);

        return _mapper.Map<BizLicApplicationResp>(app);
    }

    public async Task<BizLicApplicationCmdResp> SaveBizLicApplicationAsync(SaveBizLicApplicationCmd cmd, CancellationToken ct)
    {
        spd_application? app;
        if (cmd.LicenceAppId != null)
        {
            app = _context.spd_applications
                .Expand(a => a.spd_application_spd_licencecategory)
                .Where(c => c.statecode != DynamicsConstants.StateCode_Inactive)
                .Where(a => a.spd_applicationid == cmd.LicenceAppId)
                .FirstOrDefault();
            if (app == null)
                throw new ArgumentException("invalid app id");
            _mapper.Map<SaveBizLicApplicationCmd, spd_application>(cmd, app);
            app.spd_applicationid = (Guid)(cmd.LicenceAppId);
            _context.UpdateObject(app);
        }
        else
        {
            app = _mapper.Map<spd_application>(cmd);
            _context.AddTospd_applications(app);
        }
        _context.LinkServiceType(cmd.WorkerLicenceTypeCode, app);
        if (cmd.HasExpiredLicence == true && cmd.ExpiredLicenceId != null) 
            _context.LinkExpiredLicence(cmd.ExpiredLicenceId, app);
        LinkOrganization(cmd.ApplicantId, app);
        LinkPrivateInvestigator(cmd.PrivateInvestigatorSwlInfo, app);
        await _context.SaveChangesAsync();

        //Associate of 1:N navigation property with Create of Update is not supported in CRM, so have to save first.
        //then update category.
        _context.ProcessCategories(cmd.CategoryCodes, app);
        await _context.SaveChangesAsync();
        return new BizLicApplicationCmdResp((Guid)app.spd_applicationid, cmd.ApplicantId);
    }

    private void LinkOrganization(Guid? accountId, spd_application app)
    {
        if (accountId == null) return;
        var account = _context.accounts
            .Where(a => a.accountid == accountId)
            .Where(a => a.statecode == DynamicsConstants.StateCode_Active)
            .FirstOrDefault();
        if (account != null)
        {
            _context.SetLink(app, nameof(spd_application.spd_OrganizationId), account);
        }
    }

    private void LinkPrivateInvestigator(SwlContactInfo privateInvestigatorInfo, spd_application app)
    {
        if (privateInvestigatorInfo.ContactId == null || privateInvestigatorInfo.LicenceId == null)
            return;

        contact? contact = _context.contacts
            .Where(c => c.contactid == privateInvestigatorInfo.ContactId)
            .Where(a => a.statecode == DynamicsConstants.StateCode_Active)
            .FirstOrDefault();

        if (contact == null)
            throw new ArgumentException("investigator contact info not found");

        spd_licence? licence = _context.spd_licences
            .Where(l => l.spd_licenceid == privateInvestigatorInfo.LicenceId)
            .Where(a => a.statecode == DynamicsConstants.StateCode_Active)
            .FirstOrDefault();

        if (licence == null)
            throw new ArgumentException("investigator licence info not found");

        _context.AddLink(app, nameof(spd_application.spd_application_spd_licence_manager), licence);
    }
}