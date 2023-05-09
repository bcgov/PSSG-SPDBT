using AutoMapper;
using Spd.Resource.Applicants;
using Spd.Resource.Applicants.Application;
using Spd.Resource.Applicants.ApplicationInvite;

namespace Spd.Manager.Cases
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<ApplicationInvitesCreateRequest, ApplicationInvitesCreateCmd>()
            .ForMember(d => d.ApplicationInvites, opt => opt.MapFrom(s => s.ApplicationInviteCreateRequests));

            CreateMap<ApplicationInviteCreateRequest, Spd.Resource.Applicants.ApplicationInvite.ApplicationInvite>();
            CreateMap<ApplicationInviteCreateRequest, SearchInvitationQry>();
            CreateMap<ApplicationInviteCreateRequest, ApplicationInviteDuplicateResponse>();
            CreateMap<ApplicationInviteListResp, ApplicationInviteListResponse>();
            CreateMap<ApplicationInviteListQuery, ApplicationInviteQuery>();
            CreateMap<AppInviteListFilterBy, AppInviteFilterBy>();
            CreateMap<AppInviteListSortBy, AppInviteSortBy>();
            CreateMap<ApplicationInviteResult, ApplicationInviteResponse>()
               .ForMember(d => d.Status, opt => opt.MapFrom(s => Enum.Parse<ApplicationInviteStatusCode>(s.Status)));
            CreateMap<ApplicationCreateRequest, SearchApplicationQry>();
            CreateMap<ApplicationCreateRequest, ApplicationCreateCmd>();
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

        }
    }
}
