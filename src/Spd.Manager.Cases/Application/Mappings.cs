using AutoMapper;
using Spd.Engine.Search;
using Spd.Engine.Validation;
using Spd.Resource.Applicants.Application;
using Spd.Resource.Applicants.ApplicationInvite;
using Spd.Resource.Applicants.Document;
using Spd.Resource.Applicants.Incident;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.ManagerContract;
using Spd.Utilities.Shared.ResourceContracts;

namespace Spd.Manager.Cases.Application
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<ApplicationInvitesCreateRequest, ApplicationInvitesCreateCmd>()
            .ForMember(d => d.ApplicationInvites, opt => opt.MapFrom(s => s.ApplicationInviteCreateRequests));
            CreateMap<ApplicationInviteCreateRequest, Resource.Applicants.ApplicationInvite.ApplicationInvite>();
            CreateMap<ApplicationInviteCreateRequest, AppInviteDuplicateCheck>();
            CreateMap<AppInviteDuplicateCheckResult, ApplicationInviteDuplicateResponse>();
            CreateMap<ApplicationInviteCreateRequest, ApplicationInviteDuplicateResponse>();
            CreateMap<ApplicationInviteListResp, ApplicationInviteListResponse>();
            CreateMap<ApplicationInviteListQuery, ApplicationInviteQuery>();
            CreateMap<AppInviteListFilterBy, AppInviteFilterBy>();
            CreateMap<AppInviteListSortBy, AppInviteSortBy>();
            CreateMap<ApplicationInviteResult, ApplicationInviteResponse>()
               .ForMember(d => d.Status, opt => opt.MapFrom(s => Enum.Parse<ApplicationInviteStatusCode>(s.Status)));
            CreateMap<ApplicationCreateRequest, SearchApplicationQry>()
               .ForMember(d => d.OrgId, opt => opt.MapFrom(s => GetOrgId(s)));
            CreateMap<ApplicationCreateRequest, ApplicationCreateCmd>()
                .ForMember(d => d.ParentOrgId, opt => opt.MapFrom(s => GetParentOrgId(s)))
                .ForMember(d => d.OrgId, opt => opt.MapFrom(s => GetOrgId(s)));
            CreateMap<ApplicantAppCreateRequest, ApplicationCreateCmd>()
                 .IncludeBase<ApplicationCreateRequest, ApplicationCreateCmd>()
                 .ForMember(d => d.AgreeToConsent, opt => opt.MapFrom(s => true));
            CreateMap<ApplicationCreateRequestFromBulk, ApplicationCreateCmd>()
                .IncludeBase<ApplicationCreateRequest, ApplicationCreateCmd>();
            CreateMap<AliasCreateRequest, AliasCreateCmd>();
            CreateMap<ApplicationResult, ApplicationResponse>()
                .ForMember(d => d.Status, opt => opt.MapFrom(s => GetApplicationPortalStatusCode(s.ApplicationPortalStatus)));
            CreateMap<ApplicationResult, ApplicationPaymentResponse>()
                .IncludeBase<ApplicationResult, ApplicationResponse>();
            CreateMap<ApplicationListResp, ApplicationListResponse>();
            CreateMap<AppListFilterBy, AppFilterBy>();
            CreateMap<AppListSortBy, AppSortBy>();
            CreateMap<AppPaymentListFilterBy, AppFilterBy>();
            CreateMap<AppPaymentListSortBy, AppSortBy>();
            CreateMap<ApplicationListResp, ApplicationPaymentListResponse>();
            CreateMap<PaginationRequest, Paging>();
            CreateMap<PaginationResp, PaginationResponse>();
            CreateMap<ApplicationInviteDeleteCommand, ApplicationInviteDeleteCmd>();
            CreateMap<ApplicationStatisticsQuery, ApplicationStatisticsQry>();
            CreateMap<ApplicationStatisticsResp, ApplicationStatisticsResponse>();
            CreateMap<VerifyIdentityCommand, VerifyIdentityCmd>();
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
            CreateMap<ClearanceAccessResp, ClearanceAccessResponse>();
            CreateMap<ClearanceAccessListResp, ClearanceAccessListResponse>();
            CreateMap<ClearanceAccessListFilterBy, ClearanceAccessFilterBy>();
            CreateMap<ClearanceAccessListSortBy, ClearanceAccessSortBy>();
            CreateMap<ClearanceAccessDeleteCommand, ClearanceAccessDeleteCmd>();
            CreateMap<ShareableClearance, ShareableClearanceItem>();
            CreateMap<AppInviteVerifyResp, AppOrgResponse>();
            CreateMap<ApplicantApplicationListQuery, ApplicantApplicationListQry>();
            CreateMap<ApplicantApplicationListResp, ApplicantApplicationListResponse>();
            CreateMap<DocumentResp, ApplicantApplicationFileResponse>()
                .ForMember(d => d.FileTypeCode, opt => opt.MapFrom(s => s.DocumentType));
            CreateMap<DocumentResp, ApplicantAppFileCreateResponse>();
            CreateMap<ApplicationResult, ApplicantApplicationResponse>()
                .ForMember(d => d.Status, opt => opt.MapFrom(s => GetApplicationPortalStatusCode(s.ApplicationPortalStatus)))
                .ForMember(d => d.CaseSubStatus, opt => opt.MapFrom(s => GetCaseSubStatusCode(s.CaseSubStatus)))
                .ForMember(d => d.FailedPaymentAttempts, opt => opt.MapFrom(s => s.NumberOfAttempts ?? 0));
            CreateMap<ApplicationResult, ApplicationInvitePrepopulateDataResponse>()
                .ForMember(d => d.FirstName, opt => opt.MapFrom(s => s.GivenName))
                .ForMember(d => d.LastName, opt => opt.MapFrom(s => s.Surname))
                .ForMember(d => d.Email, opt => opt.MapFrom(s => s.EmailAddress));
            //.ForMember(d => d.ScreeningType, opt => opt.MapFrom(s => s.ScreeningType));
        }

        private static CaseSubStatusCode? GetCaseSubStatusCode(CaseSubStatusEnum? subStatusEnum)
        {
            if (subStatusEnum == null) return null;
            try
            {
                return Enum.Parse<CaseSubStatusCode>(subStatusEnum.ToString());
            }
            catch
            {
                return null;
            }
        }

        private static ApplicationPortalStatusCode? GetApplicationPortalStatusCode(ApplicationPortalStatusEnum? portalStatusEnum)
        {
            if (portalStatusEnum == null) return null;
            try
            {
                return Enum.Parse<ApplicationPortalStatusCode>(portalStatusEnum.ToString());
            }
            catch
            {
                return null;
            }
        }

        private static Guid GetOrgId(ApplicationCreateRequest appCreateRequest)
        {
            //if (appCreateRequest.OrgId == SpdConstants.BC_GOV_ORG_ID)
            //{
            //    //get orgId from appCreateRequest.MinistryId
            //    //todo: when we know how to connect spd_ministry with idir logon user ministry
            //    return Guid.Parse("4765533b-e33a-ee11-b845-00505683fbf4"); //temp
            //}
            return appCreateRequest.OrgId;
        }

        private static Guid? GetParentOrgId(ApplicationCreateRequest appCreateRequest)
        {
            if (appCreateRequest.OrgId == SpdConstants.BC_GOV_ORG_ID)
            {
                return SpdConstants.BC_GOV_ORG_ID;
            }
            return null;
        }
    }
}
