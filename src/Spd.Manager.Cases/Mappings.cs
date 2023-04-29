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
            CreateMap<ApplicationInviteResult, ApplicationInviteResponse>()
               .ForMember(d => d.Status, opt => opt.MapFrom(s => Enum.Parse<ApplicationInviteStatusCode>(s.Status)));
            CreateMap<ApplicationCreateRequest, SearchApplicationQry>();
            CreateMap<ApplicationCreateRequest, ApplicationCreateCmd>();
            CreateMap<AliasCreateRequest, AliasCreateCmd>();
            CreateMap<ApplicationResult, ApplicationResponse>()
                .ForMember(d => d.Status, opt => opt.MapFrom(s => GetApplicationPortalStatus(s.ApplicationStatus, s.CaseStatus, s.CaseSubStatus)));
            CreateMap<ApplicationListResp, ApplicationListResponse>();
            CreateMap<PaginationResp, PaginationResponse>();
        } 
        

        private ApplicationPortalStatusCode GetApplicationPortalStatus(string appStatus, string? caseStatus, string? caseSubStatus)
        {
            //todo: add mapping to portal status according to 3 input status.
            return ApplicationPortalStatusCode.AwaitingPayment;
        }
    }
}
