using AutoMapper;
using MediatR;
using Spd.Resource.Repository.Contact;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.LicApp;
using Spd.Resource.Repository.Licence;
using Spd.Resource.Repository.LicenceFee;
using Spd.Resource.Repository.PersonLicApplication;
using Spd.Resource.Repository.Tasks;
using Spd.Utilities.FileStorage;

namespace Spd.Manager.Licence;
internal class SecurityWorkerLicenceManager :
        LicenceAppManagerBase,
        IRequestHandler<WorkerLicenceReplaceCommand, WorkerLicenceCommandResponse>,
        IRequestHandler<WorkerLicenceRenewCommand, WorkerLicenceCommandResponse>,
        IRequestHandler<WorkerLicenceUpdateCommand, WorkerLicenceCommandResponse>,
        ISecurityWorkerLicenceManager
{
    private readonly IPersonLicApplicationRepository _personLicAppRepository;
    private readonly ITaskRepository _taskRepository;
    private readonly IContactRepository _contactRepository;

    public SecurityWorkerLicenceManager(
        ILicenceRepository licenceRepository,
        IPersonLicApplicationRepository personLicAppRepository,
        ILicAppRepository licAppRepository,
        IMapper mapper,
        IDocumentRepository documentUrlRepository,
        ITaskRepository taskRepository,
        ILicenceFeeRepository feeRepository,
        IContactRepository contactRepository,
        IMainFileStorageService mainFileStorageService,
        ITransientFileStorageService transientFileStorageService) : base(
            mapper,
            documentUrlRepository,
            feeRepository,
            licenceRepository,
            mainFileStorageService,
            transientFileStorageService,
            licAppRepository)
    {
        _personLicAppRepository = personLicAppRepository;
        _taskRepository = taskRepository;
        _contactRepository = contactRepository;
    }

    public async Task<WorkerLicenceCommandResponse> Handle(WorkerLicenceReplaceCommand cmd, CancellationToken cancellationToken)
    {
        return null;
    }

    /// <summary>
    /// create spd_application with the same content as renewed app with type=renew, 
    ///  put original licence id to spd_currentexpiredlicenseid.
    ///  if mailing address changed, set the new mailing address to the new created application address1, 
    ///  update the contact mailing address, put old mailing address to spd_address.
    /// copy all the old files(except the file types of new uploaded files) to the new application.
    /// </summary>
    /// <param name="cmd"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    /// <exception cref="ArgumentException"></exception>
    public async Task<WorkerLicenceCommandResponse> Handle(WorkerLicenceRenewCommand cmd, CancellationToken cancellationToken)
    {
        return null;

    }

    /// <summary>
    /// Only Name Changed, reprint = yes, => openshift create a new application with Update type, the application spd_currentexpiredlicenseid with be the selected old licenced. Do not need to copy old files to the new application.
    /// Only Name Changed, reprint = No => openshift update the contact directly, no need to create application or task.
    /// Only Photo Changed, reprint = yes, => openshift create a new application with Update type, the application spd_currentexpiredlicenseid with be the selected old licenced.Do not need to copy old files to the new application.
    /// Only Name Changed, reprint = No => openshift update the contact directly, no need to create application or task.
    /// If license categories or Dog constraints changed, (no matter if reprint is true or false), openshift needs to create a new application with Update type, the application spd_currentexpiredlicenseid with be the selected old licenced.Do not need to copy old files to the new application.
    /// If only contact info, address changed, openshift directly update contact.
    /// If Criminal Charges, or New Offence Conviction, or treated for mental Health changed, created task, assign to Licesing RA team
    /// If only hold a position with peace officer changed, create a task for license cs team., link peace officer document to this task and contact.
    /// If mental health changed, create a task for license to licensing team, link mental document to this task and contact
    /// If any changes that needs creating tasks and also need creating application, then do both.
    /// </summary>
    /// <param name="cmd"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    /// <exception cref="ArgumentException"></exception>
    public async Task<WorkerLicenceCommandResponse> Handle(WorkerLicenceUpdateCommand cmd, CancellationToken cancellationToken)
    {
        return null;

    }

}
