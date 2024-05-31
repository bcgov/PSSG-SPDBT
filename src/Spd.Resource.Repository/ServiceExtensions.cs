using Microsoft.Extensions.DependencyInjection;
using Spd.Resource.Repository.Address;
using Spd.Resource.Repository.Alias;
using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.ApplicationInvite;
using Spd.Resource.Repository.Biz;
using Spd.Resource.Repository.BizLicApplication;
using Spd.Resource.Repository.BizContact;
using Spd.Resource.Repository.Config;
using Spd.Resource.Repository.Contact;
using Spd.Resource.Repository.Delegates;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.DocumentTemplate;
using Spd.Resource.Repository.Identity;
using Spd.Resource.Repository.Incident;
using Spd.Resource.Repository.Invoice;
using Spd.Resource.Repository.Licence;
using Spd.Resource.Repository.LicenceApplication;
using Spd.Resource.Repository.LicenceFee;
using Spd.Resource.Repository.OptionSet;
using Spd.Resource.Repository.Org;
using Spd.Resource.Repository.Payment;
using Spd.Resource.Repository.PortalUser;
using Spd.Resource.Repository.Registration;
using Spd.Resource.Repository.Report;
using Spd.Resource.Repository.ServiceTypes;
using Spd.Resource.Repository.Tasks;
using Spd.Resource.Repository.User;
using Spd.Resource.Repository.WorkerLicenceCategory;
using Spd.Utilities.Hosting;

namespace Spd.Resource.Repository
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
            configurationServices.Services.AddTransient<IPortalUserRepository, PortalUserRepository>();
            configurationServices.Services.AddTransient<ILicenceRepository, LicenceRepository>();
            configurationServices.Services.AddTransient<IPersonLicApplicationRepository, PersonLicApplicationRepository>();
            configurationServices.Services.AddTransient<ILicenceFeeRepository, LicenceFeeRepository>();
            configurationServices.Services.AddTransient<IContactRepository, ContactRepository>();
            configurationServices.Services.AddTransient<ITaskRepository, TaskRepository>();
            configurationServices.Services.AddTransient<IOrgUserRepository, OrgUserRepository>();
            configurationServices.Services.AddTransient<IOrgReportRepository, ReportRepository>();
            configurationServices.Services.AddTransient<IOrgRegistrationRepository, OrgRegistrationRepository>();
            configurationServices.Services.AddTransient<IOrgRepository, OrgRepository>();
            configurationServices.Services.AddTransient<IIdentityRepository, IdentityRepository>();
            configurationServices.Services.AddTransient<IIdentityRepository, IdentityRepository>();
            configurationServices.Services.AddTransient<IConfigRepository, ConfigRepository>();
            configurationServices.Services.AddTransient<IServiceTypeRepository, ServiceTypeRepository>();
            configurationServices.Services.AddTransient<IAliasRepository, AliasRepository>();
            configurationServices.Services.AddTransient<IBizRepository, BizRepository>();
            configurationServices.Services.AddTransient<IOptionSetRepository, OptionSetRepository>();
            configurationServices.Services.AddTransient<IAddressRepository, AddressRepository>();
            configurationServices.Services.AddTransient<IWorkerLicenceCategoryRepository, WorkerLicenceCategoryRepository>();
            configurationServices.Services.AddTransient<IBizLicApplicationRepository, BizLicApplicationRepository>();
            configurationServices.Services.AddTransient<IBizContactRepository, BizContactRepository>();
        }
    }
}
