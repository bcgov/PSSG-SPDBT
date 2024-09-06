using AutoMapper;
using Spd.Engine.Search;
using Spd.Engine.Validation;
using Spd.Manager.Shared;
using Spd.Resource.Repository;
using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.ApplicationInvite;
using Spd.Resource.Repository.Delegates;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.Incident;
using Spd.Resource.Repository.PortalUser;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

namespace Spd.Manager.Screening
{
    internal class ApplicationMappings : Profile
    {
        public ApplicationMappings()
        {
            _ = CreateMap<ApplicationInvitesCreateRequest, ApplicationInvitesCreateCmd>()
            .ForMember(d => d.ApplicationInvites, opt => opt.MapFrom(s => s.ApplicationInviteCreateRequests));
            CreateMap<ApplicationInviteCreateRequest, Resource.Repository.ApplicationInvite.ApplicationInvite>()
            .ForMember(d => d.PayeeType, opt => opt.MapFrom(s => GetPayerPreferenceTypeCode(s)));
            CreateMap<ApplicationInviteCreateRequest, AppInviteDuplicateCheck>();
            CreateMap<AppInviteDuplicateCheckResult, ApplicationInviteDuplicateResponse>();
            CreateMap<ApplicationInviteCreateRequest, ApplicationInviteDuplicateResponse>();
            CreateMap<ApplicationInviteListResp, ApplicationInviteListResponse>();
            CreateMap<ApplicationInviteListQuery, ApplicationInviteQuery>();
            CreateMap<AppInviteListFilterBy, AppInviteFilterBy>();
            CreateMap<AppInviteListSortBy, AppInviteSortBy>();
            CreateMap<ApplicationInviteResult, ApplicationInviteResponse>()
               .ForMember(d => d.Status, opt => opt.MapFrom(s => Enum.Parse<ApplicationInviteStatusCode>(s.Status.ToString())));
            CreateMap<ApplicationCreateRequest, SearchApplicationQry>();
            CreateMap<ApplicationCreateRequest, ApplicationCreateCmd>()
               .ForMember(d => d.ParentOrgId, opt => opt.MapFrom(s => GetParentOrgId(s.ServiceType)));
            CreateMap<ApplicantAppCreateRequest, ApplicationCreateCmd>()
                 .IncludeBase<ApplicationCreateRequest, ApplicationCreateCmd>()
                 .ForMember(d => d.AgreeToConsent, opt => opt.MapFrom(s => true));
            CreateMap<ApplicationCreateRequestFromBulk, ApplicationCreateCmd>()
                .ForMember(d => d.UploadId, opt => opt.MapFrom(s => s.LicenceNo))
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
            CreateMap<ApplicationInviteDeleteCommand, ApplicationInviteUpdateCmd>();
            CreateMap<ApplicationStatisticsQuery, ApplicationStatisticsQry>();
            CreateMap<ApplicationStatisticsResp, ApplicationStatisticsResponse>();
            CreateMap<VerifyIdentityCommand, UpdateCmd>();
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
            CreateMap<DelegateResp, DelegateResponse>();
            CreateMap<DelegateCreateRequest, CreateDelegateCmd>();
            CreateMap<DelegateCreateRequest, CreatePortalUserCmd>();
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

        private static Guid? GetParentOrgId(ServiceTypeCode serviceType)
        {
            if (serviceType == ServiceTypeCode.PSSO ||
                serviceType == ServiceTypeCode.PSSO_VS ||
                serviceType == ServiceTypeCode.PE_CRC_VS ||
                serviceType == ServiceTypeCode.PE_CRC ||
                serviceType == ServiceTypeCode.MCFD)
                return SpdConstants.BcGovOrgId;
            return null;
        }

        private Resource.Repository.PayerPreferenceTypeCode? GetPayerPreferenceTypeCode(ApplicationInviteCreateRequest inviteRequest)
        {
            if (inviteRequest.ServiceType == ServiceTypeCode.CRRP_EMPLOYEE)
            {
                if (inviteRequest.PayeeType == null) throw new ApiException(HttpStatusCode.BadRequest, "Payee type is required.");
                return Enum.Parse<Resource.Repository.PayerPreferenceTypeCode>(inviteRequest.PayeeType.Value.ToString());
            }

            if (inviteRequest.ServiceType == ServiceTypeCode.CRRP_VOLUNTEER) return null;
            if (inviteRequest.ServiceType == ServiceTypeCode.PSSO || inviteRequest.ServiceType == ServiceTypeCode.PSSO_VS || inviteRequest.ServiceType == ServiceTypeCode.MCFD)
                return null;
            if (inviteRequest.ServiceType == ServiceTypeCode.PE_CRC || inviteRequest.ServiceType == ServiceTypeCode.PE_CRC_VS)
            {
                if (inviteRequest.PayeeType == Shared.PayerPreferenceTypeCode.Applicant) return Resource.Repository.PayerPreferenceTypeCode.Applicant;
                if (inviteRequest.PayeeType == Shared.PayerPreferenceTypeCode.Organization) return null;
                if (inviteRequest.PayeeType == null) throw new ApiException(HttpStatusCode.BadRequest, "Payee type is required.");
            }
            return null;
        }
    }
}
