using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Applicants.Application;
internal partial class ApplicationRepository : IApplicationRepository
{
    public async Task<LicenceApplicationCmdResp> SaveLicenceApplicationAsync(SaveLicenceApplicationCmd cmd, CancellationToken ct)
    {
        spd_application? app;
        if (cmd.LicenceApplicationId != null)
        {
            app = await _context.GetApplicationById((Guid)cmd.LicenceApplicationId, ct);
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
        //create contact

        //create alias
        if (cmd.HasPreviousName.Value)
        {
            //
        }
        LinkServiceType(cmd.WorkerLicenceTypeCode, app);
        if (cmd.HasExpiredLicence == true) LinkExpiredLicence(cmd.ExpiredLicenceNumber, cmd.ExpiryDate, app);
        await _context.SaveChangesAsync();
        return new LicenceApplicationCmdResp(app.spd_applicationid);
    }

    public async Task<LicenceApplicationResp> GetLicenceApplicationAsync(Guid licenceApplicationId, CancellationToken ct)
    {
        var app = await _context.GetApplicationById(licenceApplicationId, ct);
        if (app == null)
            throw new ArgumentException("invalid app id");
        return _mapper.Map<LicenceApplicationResp>(app);
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

    private void LinkExpiredLicence(string? expiredLicenceNumber, DateTimeOffset? expiryDate, spd_application app)
    {
        if (expiredLicenceNumber == null || expiryDate == null) return;
        var licence = _context.spd_licenses.Where(l => l.spd_licensenumber == expiredLicenceNumber
            && l.spd_licenceexpirydate == expiryDate.Value.Date)
            .FirstOrDefault();
        if (licence != null)
        {
            _context.SetLink(app, nameof(spd_application.spd_CurrentExpiredLicense), licence);
        }
    }
}


