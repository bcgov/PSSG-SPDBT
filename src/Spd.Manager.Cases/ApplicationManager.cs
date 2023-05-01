using AutoMapper;
using MediatR;
using Spd.Resource.Applicants;
using Spd.Resource.Applicants.Application;
using Spd.Resource.Applicants.ApplicationInvite;
using Spd.Utilities.Shared.Exceptions;

namespace Spd.Manager.Cases
{
    internal class ApplicationManager :
        IRequestHandler<ApplicationInviteCreateCommand, ApplicationInvitesCreateResponse>,
        IRequestHandler<ApplicationCreateCommand, ApplicationCreateResponse>,
        IRequestHandler<ApplicationListQuery, ApplicationListResponse>,
        IRequestHandler<ApplicationInviteListQuery, ApplicationInviteListResponse>,
        IApplicationManager
    {
        private readonly IApplicationRepository _applicationRepository;
        private readonly IApplicationInviteRepository _applicationInviteRepository;
        private readonly IMapper _mapper;

        public ApplicationManager(IApplicationRepository applicationRepository, IApplicationInviteRepository applicationInviteRepository, IMapper mapper)
        {
            _applicationRepository = applicationRepository;
            _applicationInviteRepository = applicationInviteRepository;
            _mapper = mapper;
        }

        //application-invites
        public async Task<ApplicationInvitesCreateResponse> Handle(ApplicationInviteCreateCommand createCmd, CancellationToken ct)
        {
            ApplicationInvitesCreateResponse resp = new(createCmd.OrgId);
            if (createCmd.ApplicationInvitesCreateRequest.RequireDuplicateCheck)
            {
                var duplicateResp = await CheckDuplicateAppInvite(createCmd.ApplicationInvitesCreateRequest, createCmd.OrgId, ct);
                resp.IsDuplicateCheckRequired = createCmd.ApplicationInvitesCreateRequest.RequireDuplicateCheck;
                resp.DuplicateResponses = duplicateResp;
                if (duplicateResp.Any())
                {
                    resp.CreateSuccess = false;
                    return resp;
                }
            }
            var cmd = _mapper.Map<ApplicationInvitesCreateCmd>(createCmd.ApplicationInvitesCreateRequest);
            cmd.OrgId = createCmd.OrgId;
            cmd.CreatedByUserId = createCmd.UserId;
            await _applicationInviteRepository.AddApplicationInvitesAsync(cmd, ct);
            resp.CreateSuccess = true;
            return resp;
        }
        public async Task<ApplicationInviteListResponse> Handle(ApplicationInviteListQuery request, CancellationToken ct)
        {
            string? filterValue = null;
            if (!string.IsNullOrWhiteSpace(request.Filters))
            {
                try
                {
                    var strs = request.Filters.Split("@=");
                    if (strs[0].Equals("searchText", StringComparison.InvariantCultureIgnoreCase))
                        filterValue = strs[1];
                }
                catch
                {
                    throw new ApiException(System.Net.HttpStatusCode.BadRequest, "invalid filtering string.");
                }
            }

            var response = await _applicationInviteRepository.QueryAsync(
                new ApplicationInviteQuery
                {
                    FilterBy = new AppInviteFilterBy(request.OrgId, EmailOrNameContains: filterValue),
                    SortBy = new AppInviteSortBy(SubmittedDateDesc: true),
                    Paging = new Paging(request.Page, request.PageSize)
                },
                ct);
            return _mapper.Map<ApplicationInviteListResponse>(response);
        }

        private async Task<IEnumerable<ApplicationInviteDuplicateResponse>> CheckDuplicateAppInvite(ApplicationInvitesCreateRequest request, Guid orgId, CancellationToken cancellationToken)
        {
            List<ApplicationInviteDuplicateResponse> resp = new List<ApplicationInviteDuplicateResponse>();
            foreach (var item in request.ApplicationInviteCreateRequests)
            {
                var searchInvitationQry = _mapper.Map<SearchInvitationQry>(item);
                searchInvitationQry.OrgId = orgId;

                //duplicated in portal invitation
                bool hasDuplicateInvitation = await _applicationInviteRepository.CheckInviteInvitationDuplicateAsync(searchInvitationQry, cancellationToken);
                if (hasDuplicateInvitation)
                {
                    ApplicationInviteDuplicateResponse dupResp = _mapper.Map<ApplicationInviteDuplicateResponse>(item);
                    dupResp.HasPotentialDuplicate = true;
                    resp.Add(dupResp);
                }

                if (!hasDuplicateInvitation)
                {
                    //duplicated in application
                    bool hasDuplicateApplication = await _applicationInviteRepository.CheckInviteApplicationDuplicateAsync(searchInvitationQry, cancellationToken);
                    if (hasDuplicateApplication)
                    {
                        ApplicationInviteDuplicateResponse dupResp = _mapper.Map<ApplicationInviteDuplicateResponse>(item);
                        dupResp.HasPotentialDuplicate = true;
                        resp.Add(dupResp);
                    }
                }
            }

            return resp;
        }

        //application
        public async Task<ApplicationCreateResponse> Handle(ApplicationCreateCommand request, CancellationToken ct)
        {
            ApplicationCreateResponse result = new();
            request.ApplicationCreateRequest.OrgId = request.OrgId;
            if (request.ApplicationCreateRequest.RequireDuplicateCheck)
            {
                result = await CheckDuplicateApp(request.ApplicationCreateRequest, ct);
                result.IsDuplicateCheckRequired = true;
                if (result.HasPotentialDuplicate)
                {
                    return result;
                }
            }

            var cmd = _mapper.Map<ApplicationCreateCmd>(request.ApplicationCreateRequest);
            cmd.OrgId = request.OrgId;
            cmd.CreatedByUserId = request.UserId;
            Guid? applicationId = await _applicationRepository.AddApplicationAsync(cmd, ct);
            if (applicationId.HasValue)
            {
                result.ApplicationId = applicationId.Value;
                result.CreateSuccess = true;
            }
            return result;
        }
        public async Task<ApplicationListResponse> Handle(ApplicationListQuery request, CancellationToken ct)
        {
            AppFilterBy filterBy = GetAppFilterBy(request.Filters, request.OrgId);
            AppSortBy sortBy = GetAppSortBy(request.Sorts);

            var response = await _applicationRepository.QueryAsync(
                new ApplicationListQry
                {
                    FilterBy = filterBy,
                    SortBy = sortBy,
                    Paging = new Paging(request.Page, request.PageSize)
                },
                ct);

            return _mapper.Map<ApplicationListResponse>(response);
        }
        private async Task<ApplicationCreateResponse> CheckDuplicateApp(ApplicationCreateRequest request, CancellationToken ct)
        {
            ApplicationCreateResponse resp = new ApplicationCreateResponse();

            var searchApplicationQry = _mapper.Map<SearchApplicationQry>(request);

            //check if duplicate in application
            bool hasDuplicateApplication = await _applicationRepository.CheckApplicationDuplicateAsync(searchApplicationQry, ct);
            if (hasDuplicateApplication)
            {
                resp.HasPotentialDuplicate = true;
                resp.CreateSuccess = false;
            }

            return resp;
        }

        private AppFilterBy GetAppFilterBy(string? filters, Guid orgId)
        {
            AppFilterBy appFilterBy = new AppFilterBy(orgId);
            if(string.IsNullOrWhiteSpace(filters)) return appFilterBy;

            //filters string should be like status==AwaitingPayment|AwaitingApplicant,searchText@=str
            string[] items = filters.Split(',');
            foreach (string item in items)
            {
                string[] strs= item.Split("==");
                if(strs.Length== 2)
                {
                    if (strs[0] == "status")
                    {
                        //todo:
                       // appFilterBy.ApplicationStatus = new List<ApplicationPortalStatusCode> { ApplicationPortalStatusCode.AwaitingApplicant, ApplicationPortalStatusCode.AwaitingPayment};
                    }
                }
                else
                {
                    if(strs.Length== 1)
                    {
                        string[] s = strs[0].Split("@=");
                        if(s.Length== 2 && s[0]=="searchText")
                        {
                            appFilterBy.NameOrEmailOrAppIdContains = s[1];
                        }
                    }
                }
            }
            return appFilterBy;
        }

        private AppSortBy GetAppSortBy(string? sortby)
        {
            AppSortBy appSortBy = new AppSortBy();
            if (string.IsNullOrWhiteSpace(sortby)) return appSortBy;

 
            return appSortBy;
        }
    }
}