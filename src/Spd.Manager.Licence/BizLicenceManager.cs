using AutoMapper;
using MediatR;
using Spd.Manager.Shared;
using Spd.Resource.Repository.Biz;
using Spd.Resource.Repository.BizLicApplication;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.LicApp;
using Spd.Resource.Repository.Licence;
using Spd.Resource.Repository.LicenceFee;
using Spd.Resource.Repository.Tasks;
using Spd.Utilities.Dynamics;
using Spd.Utilities.FileStorage;
using Spd.Utilities.Shared.Exceptions;
using System.Net;
using System.Text;

namespace Spd.Manager.Licence;
internal class BizLicenceManager : LicenceAppManagerBase,
        IRequestHandler<BizLicenceReplaceCommand, BizLicenceCommandResponse>,
        IRequestHandler<BizLicenceRenewCommand, BizLicenceCommandResponse>,
        IRequestHandler<BizLicenceUpdateCommand, BizLicenceCommandResponse>,
        IBizLicenceManager
{
    private readonly ITaskRepository _taskRepository;
    private readonly IBizRepository _bizRepository;
    private readonly IBizLicApplicationRepository _bizLicApplicationRepository;

    public BizLicenceManager(
        ILicenceRepository licenceRepository,
        IMapper mapper,
        IDocumentRepository documentUrlRepository,
        ILicenceFeeRepository feeRepository,
        IMainFileStorageService mainFileStorageService,
        IBizLicApplicationRepository bizApplicationRepository,
        ITaskRepository taskRepository,
        IBizRepository bizRepository,
        ILicAppRepository licAppRepository) :
        base(mapper, documentUrlRepository, feeRepository, licenceRepository, mainFileStorageService, null, licAppRepository)
    {
        this._bizLicApplicationRepository = bizApplicationRepository;
        this._taskRepository = taskRepository;
        this._bizRepository = bizRepository;
    }

    public async Task<BizLicenceCommandResponse> Handle(BizLicenceReplaceCommand cmd, CancellationToken cancellationToken)
    {
        return null;
    }

    public async Task<BizLicenceCommandResponse> Handle(BizLicenceRenewCommand cmd, CancellationToken cancellationToken)
    {

        return null;
    }

    public async Task<BizLicenceCommandResponse> Handle(BizLicenceUpdateCommand cmd, CancellationToken cancellationToken)
    {
        BizLicenceUpdateRequest request = cmd.BizLicenceUpdateRequest;
        // Validation: check if original licence meet update condition.
        LicenceListResp originalLicences = await _licenceRepository.QueryAsync(
            new LicenceQry() { LicenceId = request.OriginalLicenceId },
            cancellationToken);
        if (originalLicences == null || !originalLicences.Items.Any())
            throw new ArgumentException("cannot find the licence that needs to be updated.");
        LicenceResp originalLic = originalLicences.Items.First();

        await MakeChanges(request, originalLic, cancellationToken);
        decimal? cost = 0;
        BizLicApplicationCmdResp? response = null;
        CreateBizLicApplicationCmd createApp = _mapper.Map<CreateBizLicApplicationCmd>(request);
        response = await _bizLicApplicationRepository.CreateBizLicApplicationAsync(createApp, cancellationToken);
        if (response == null) throw new ApiException(HttpStatusCode.InternalServerError, "create biz application failed.");

        // Upload new files
        await UploadNewDocsAsync(null,
                cmd.LicAppFileInfos,
                response.LicenceAppId,
                null,
                null,
                null,
                null,
                null,
                response.AccountId,
                cancellationToken);

        // Copying all old files to new application in PreviousFileIds 
        if (request.ValidPreviousDocumentIds != null && request.ValidPreviousDocumentIds.Any())
        {
            foreach (var docUrlId in request.ValidPreviousDocumentIds)
            {
                await _documentRepository.ManageAsync(
                    new CopyDocumentCmd(docUrlId, response.LicenceAppId, response.AccountId),
                    cancellationToken);
            }
        }

        cost = await CommitApplicationAsync(
            new LicenceAppBase
            {
                ApplicationTypeCode = Shared.ApplicationTypeCode.Update,
                ApplicationOriginTypeCode = request.ApplicationOriginTypeCode,
                BizTypeCode = Enum.Parse<BizTypeCode>(originalLic.BizTypeCode.ToString()),
                LicenceTermCode = Enum.Parse<LicenceTermCode>(originalLic.LicenceTermCode.Value.ToString()),
                WorkerLicenceTypeCode = WorkerLicenceTypeCode.SecurityBusinessLicence
            }, response.LicenceAppId, cancellationToken);

        return new BizLicenceCommandResponse { BizId = request.BizId, Cost = cost };
    }

    private async Task<ChangeSpec> MakeChanges(BizLicenceUpdateRequest updateRequest, LicenceResp originalLic, CancellationToken ct)
    {
        ChangeSpec changes = new();

        // Categories changed
        if (updateRequest.CategoryCodes.Count() != originalLic.CategoryCodes.Count())
            changes.CategoriesChanged = true;
        else
        {
            List<WorkerCategoryTypeCode> newList = updateRequest.CategoryCodes.ToList();
            newList.Sort();
            List<WorkerCategoryTypeCode> originalList = originalLic.CategoryCodes.Select(c => Enum.Parse<WorkerCategoryTypeCode>(c.ToString())).ToList();
            originalList.Sort();
            if (!newList.SequenceEqual(originalList)) changes.CategoriesChanged = true;
        }

        //UseDogs changed
        if (updateRequest.UseDogs != originalLic.UseDogs)
            changes.UseDogsChanged = true;

        if (changes.CategoriesChanged)
        {
            StringBuilder previousCategories = new();
            StringBuilder updatedCategories = new();

            foreach (WorkerCategoryTypeCode category in originalLic.CategoryCodes)
                previousCategories.AppendLine(category.ToString());

            foreach (WorkerCategoryTypeCode category in updateRequest.CategoryCodes)
                updatedCategories.AppendLine(category.ToString());

            await _taskRepository.ManageAsync(new CreateTaskCmd()
            {
                Description = $"Request to update the licence category applicable on the {originalLic.LicenceNumber} \n " +
                    $"Previous Categories: {previousCategories} \n " +
                    $"Updated Categories: {updatedCategories}",
                DueDateTime = DateTimeOffset.Now.AddDays(1),
                Subject = $"Licence Category update {originalLic.LicenceNumber}",
                TaskPriorityEnum = TaskPriorityEnum.Normal,
                RegardingAccountId = originalLic.LicenceHolderId,
                AssignedTeamId = Guid.Parse(DynamicsConstants.Licensing_Client_Service_Team_Guid),
                LicenceId = originalLic.LicenceId
            }, ct);
        }

        if (changes.UseDogsChanged)
        {
            await _taskRepository.ManageAsync(new CreateTaskCmd()
            {
                Description = $"Below Dog's Handers information needs to be updated in the business licence {originalLic.LicenceNumber} \n " +
                    $"Use of dog : Explosives detection / Drug detection / Protection (As described in the DSV certificate) \n " +
                    $"DSV Certificate Number \n " +
                    $"Expiry Date \n" +
                    $"DSV certificate (Attachment)",
                DueDateTime = DateTimeOffset.Now.AddDays(1),
                Subject = $"Dog validation information to be updated for Business Licence {originalLic.LicenceNumber}",
                TaskPriorityEnum = TaskPriorityEnum.Normal,
                RegardingAccountId = originalLic.LicenceHolderId,
                AssignedTeamId = Guid.Parse(DynamicsConstants.Licensing_Client_Service_Team_Guid),
                LicenceId = originalLic.LicenceId,
            }, ct);
        }

        return changes;
    }

    private sealed record ChangeSpec
    {
        public bool CategoriesChanged { get; set; }
        public bool UseDogsChanged { get; set; }
    }
}

