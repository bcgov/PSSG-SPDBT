using Microsoft.Extensions.DependencyInjection;
using Spd.Resource.Applicants.Application;
using Spd.Resource.Applicants.ApplicationInvite;
using Spd.Resource.Applicants.Delegates;
using Spd.Resource.Applicants.Document;
using Spd.Resource.Applicants.DocumentTemplate;
using Spd.Resource.Applicants.Incident;
using Spd.Resource.Applicants.Invoice;
using Spd.Resource.Applicants.Licence;
using Spd.Resource.Applicants.LicenceApplication;
using Spd.Resource.Applicants.Payment;
using Spd.Resource.Applicants.PortalUser;
using Spd.Utilities.Hosting;

namespace Spd.Resource.Applicants
{
    public class ServiceExtension : IConfigureComponentServices
    {
        public void ConfigureServices(ConfigurationServices configurationServices)
        {
            configurationServices.Services.AddTransient<IApplicationRepository, ApplicationRepository>();
            configurationServices.Services.AddTransient<IApplicationInviteRepository, ApplicationInviteRepository>();
            configurationServices.Services.AddTransient<IDocumentRepository, DocumentRepository>();
            configurationServices.Services.AddTransient<IIncidentRepository, IncidentRepository>();
            configurationServices.Services.AddTransient<IPaymentRepository, PaymentRepository>();
            configurationServices.Services.AddTransient<IDelegateRepository, DelegateRepository>();
            configurationServices.Services.AddTransient<IInvoiceRepository, InvoiceRepository>();
            configurationServices.Services.AddTransient<IDocumentTemplateRepository, DocumentTemplateRepository>();
            configurationServices.Services.AddTransient<IPortalUserRepository, ContactRepository>();
            configurationServices.Services.AddTransient<ILicenceRepository, LicenceRepository>();
            configurationServices.Services.AddTransient<ILicenceApplicationRepository, LicenceApplicationRepository>();
        }
    }
}
