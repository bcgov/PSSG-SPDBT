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
            CreateMap<ApplicationInviteResult, ApplicationInviteResponse>();
            CreateMap<ApplicationCreateRequest, SearchApplicationQry>();
            CreateMap<ApplicationCreateRequest, ApplicationCreateCmd>();
            CreateMap<AliasCreateRequest, AliasCreateCmd>();
            CreateMap<ApplicationResp, ApplicationResponse>();
            CreateMap<ApplicationListResp, ApplicationListResponse>();
            CreateMap<PaginationResp, PaginationResponse>();
            
        }
    }
}
