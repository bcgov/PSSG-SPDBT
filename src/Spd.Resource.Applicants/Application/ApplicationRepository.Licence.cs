using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Applicants.Application;
internal partial class ApplicationRepository : IApplicationRepository
{
    public async Task<LicenceApplicationResp> SaveLicenceApplicationAsync(SaveLicenceApplicationCmd cmd, CancellationToken ct)
    {
        spd_application? app;
        if (cmd.LicenceId != null)
        {
            app = await _context.GetApplicationById((Guid)cmd.LicenceId, ct);
            if (app == null)
                throw new ArgumentException("invalid app id");
            _mapper.Map<SaveLicenceApplicationCmd, spd_application>(cmd, app);
            _context.UpdateObject(app);
        }
        else
        {
            app = _mapper.Map<spd_application>(cmd);
            _context.AddTospd_applications(app);
        }
        LinkServiceType(cmd.LicenceTypeData.WorkerLicenceTypeCode, app);
        LinkExpiredLicence(cmd.ExpiredLicenceData, app);
        await _context.SaveChangesAsync();
        return new LicenceApplicationResp(app.spd_applicationid);
    }

    private void LinkServiceType(WorkerLicenceTypeEnum? licenceType, spd_application app)
    {
        if (licenceType == null) throw new ArgumentException("invalid LicenceApplication type");
        string serviceTypeStr = licenceType switch
        {
            WorkerLicenceTypeEnum.SecurityWorkerLicence => "SECURITY_WORKER_LICENCE",
            WorkerLicenceTypeEnum.ArmouredVehiclePermit => "AVAMCCA",
            WorkerLicenceTypeEnum.BodyArmourPermit => "BACA",
        };
        spd_servicetype? servicetype = _context.LookupServiceType(serviceTypeStr);
        if (servicetype != null)
        {
            _context.SetLink(app, nameof(spd_application.spd_ServiceTypeId), servicetype);
        }
    }

    private void LinkExpiredLicence(ExpiredLicenceData? expiredLicence, spd_application app)
    {
        if (expiredLicence?.HasExpiredLicence == null || !(bool)expiredLicence.HasExpiredLicence) return;
        var licence = _context.spd_licenses.Where(l => l.spd_licensenumber == expiredLicence.ExpiredLicenceNumber 
            && l.spd_licenceexpirydate == expiredLicence.ExpiryDate.Value.Date)
            .FirstOrDefault();
        if (licence != null)
        {
            _context.SetLink(app, nameof(spd_application.spd_CurrentExpiredLicense), licence);
        }
    }
}


