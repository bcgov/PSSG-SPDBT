using Microsoft.Extensions.DependencyInjection;
using Spd.Resource.Applicants.Application;
using Spd.Resource.Applicants.ApplicationInvite;
using Spd.Resource.Applicants.Delegates;
using Spd.Resource.Applicants.Document;
using Spd.Resource.Applicants.DocumentTemplate;
using Spd.Resource.Applicants.Incident;
using Spd.Resource.Applicants.Ministry;
using Spd.Resource.Applicants.Payment;
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
            configurationServices.Services.AddTransient<IMinistryRepository, MinistryRepository>();
            configurationServices.Services.AddTransient<IPaymentRepository, PaymentRepository>();
            configurationServices.Services.AddTransient<IDelegateRepository, DelegateRepository>();
            configurationServices.Services.AddTransient<IDocumentTemplateRepository, DocumentTemplateRepository>();
        }
    }
}
