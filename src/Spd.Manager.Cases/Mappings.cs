using AutoMapper;
using Spd.Engine.Validation;
using Spd.Resource.Applicants;
using Spd.Resource.Applicants.Application;
using Spd.Resource.Applicants.ApplicationInvite;
using Spd.Utilities.Shared.ManagerContract;
using Spd.Utilities.Shared.ResourceContracts;

namespace Spd.Manager.Cases
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<ApplicationInvitesCreateRequest, ApplicationInvitesCreateCmd>()
            .ForMember(d => d.ApplicationInvites, opt => opt.MapFrom(s => s.ApplicationInviteCreateRequests));
            CreateMap<ApplicationInviteCreateRequest, Spd.Resource.Applicants.ApplicationInvite.ApplicationInvite>();
            CreateMap<ApplicationInviteCreateRequest, AppInviteDuplicateCheck>();
            CreateMap<AppInviteDuplicateCheckResult, ApplicationInviteDuplicateResponse>();
            CreateMap<ApplicationInviteCreateRequest, ApplicationInviteDuplicateResponse>();
            CreateMap<ApplicationInviteListResp, ApplicationInviteListResponse>();
            CreateMap<ApplicationInviteListQuery, ApplicationInviteQuery>();
            CreateMap<AppInviteListFilterBy, AppInviteFilterBy>();
            CreateMap<AppInviteListSortBy, AppInviteSortBy>();
            CreateMap<ApplicationInviteResult, ApplicationInviteResponse>()
               .ForMember(d => d.Status, opt => opt.MapFrom(s => Enum.Parse<ApplicationInviteStatusCode>(s.Status)));
            CreateMap<ApplicationCreateRequest, SearchApplicationQry>();
            CreateMap<ApplicationCreateRequest, ApplicationCreateCmd>();
            CreateMap<ApplicationCreateRequestFromBulk, ApplicationCreateCmd>()
                .IncludeBase<ApplicationCreateRequest, ApplicationCreateCmd>();
            CreateMap<AliasCreateRequest, AliasCreateCmd>();
            CreateMap<ApplicationResult, ApplicationResponse>()
                .ForMember(d => d.Status, opt => opt.MapFrom(s => s.ApplicationPortalStatus == null ? null : Enum.Parse<ApplicationPortalStatusCode>(s.ApplicationPortalStatus).ToString()));
            CreateMap<ApplicationListResp, ApplicationListResponse>();
            CreateMap<AppListFilterBy, AppFilterBy>();
            CreateMap<AppListSortBy, AppSortBy>();
            CreateMap<PaginationRequest, Paging>();
            CreateMap<PaginationResp, PaginationResponse>();
            CreateMap<ApplicationInviteDeleteCommand, ApplicationInviteDeleteCmd>();
            CreateMap<ApplicationStatisticsQuery, ApplicationStatisticsQry>();
            CreateMap<ApplicationStatisticsResp, ApplicationStatisticsResponse>();
            CreateMap<IdentityCommand, IdentityCmd>();
            CreateMap<BulkHistoryListResp, BulkHistoryListResponse>();
            CreateMap<BulkHistoryResp, BulkHistoryResponse>();
            CreateMap<BulkAppsCreateResp, BulkAppsCreateResponse>();
            CreateMap<ApplicationCreateRslt, ApplicationCreateResult>();
            CreateMap<ApplicationCreateRequest, AppDuplicateCheck>()
               .ForMember(d => d.LastName, opt => opt.MapFrom(s => s.Surname))
               .ForMember(d => d.FirstName, opt => opt.MapFrom(s => s.GivenName));
            CreateMap<AppBulkDuplicateCheckResult, DuplicateCheckResult>();
            CreateMap<ApplicationCreateRequestFromBulk, AppBulkDuplicateCheck>()
                .IncludeBase<ApplicationCreateRequest, AppDuplicateCheck>();
            CreateMap<ClearanceResp, ClearanceResponse>();
            CreateMap<ClearanceListResp, ClearanceListResponse>();
            CreateMap<ClearanceListFilterBy, ClearanceFilterBy>();
            CreateMap<ClearanceListSortBy, ClearanceSortBy>();
            CreateMap<ClearanceAccessDeleteCommand, ClearanceAccessDeleteCmd>();
            CreateMap<ClearanceLetterResp, ClearanceLetterResponse>();
            CreateMap<AppInviteVerifyResp, AppInviteVerifyResponse>();

        }
    }
}
