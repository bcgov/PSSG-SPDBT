using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Resource.Repository.PersonLicApplication;
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
            .Expand(a => a.spd_ServiceTypeId)
            .Expand(a => a.spd_ApplicantId_account)
            .Expand(a => a.spd_ApplicantId_contact)
            .Expand(a => a.spd_application_spd_licencecategory)
            .Expand(a => a.spd_application_spd_licence_manager)
            .Expand(a => a.spd_CurrentExpiredLicenceId)
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
                .Expand(a => a.spd_application_spd_licence_manager)
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
        SharedRepositoryFuncs.LinkServiceType(_context, cmd.WorkerLicenceTypeCode, app);
        if (cmd.HasExpiredLicence == true && cmd.ExpiredLicenceId != null)
            SharedRepositoryFuncs.LinkExpiredLicence(_context, cmd.ExpiredLicenceId, app);
        else
            _context.SetLink(app, nameof(app.spd_CurrentExpiredLicenceId), null);

        LinkOrganization(cmd.ApplicantId, app);

        if (cmd.CategoryCodes.Any(c => c == WorkerCategoryTypeEnum.PrivateInvestigator))
            LinkPrivateInvestigator(cmd.PrivateInvestigatorSwlInfo, app);
        else
            DeletePrivateInvestigatorLink(app.spd_application_spd_licence_manager?.FirstOrDefault(), app);

        await _context.SaveChangesAsync(ct);

        //Associate of 1:N navigation property with Create of Update is not supported in CRM, so have to save first.
        //then update category.
        SharedRepositoryFuncs.ProcessCategories(_context, cmd.CategoryCodes, app);
        await _context.SaveChangesAsync(ct);
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
            _context.SetLink(app, nameof(spd_application.spd_ApplicantId_account), account);
        }
    }

    private void LinkPrivateInvestigator(SwlContactInfo privateInvestigatorInfo, spd_application app)
    {
        if (privateInvestigatorInfo.LicenceId == null)
            return;

        spd_licence? licence = _context.spd_licences
            .Where(l => l.spd_licenceid == privateInvestigatorInfo.LicenceId)
            .Where(a => a.statecode == DynamicsConstants.StateCode_Active)
            .FirstOrDefault();

        if (licence == null)
            throw new ArgumentException("investigator licence info not found");

        _context.AddLink(app, nameof(spd_application.spd_application_spd_licence_manager), licence);
    }

    private void DeletePrivateInvestigatorLink(spd_licence? licence, spd_application app)
    {
        if (licence == null) return;
        _context.DeleteLink(app, nameof(spd_application.spd_application_spd_licence_manager), licence);
    }
}
