using AutoMapper;
using Spd.Resource.Applicants;

namespace Spd.Manager.Cases
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            //CreateMap<ApplicationInviteCreateCommand, ApplicationInviteCreateCmd>();


            _ = CreateMap<ApplicationInviteCreateCommand, ApplicationInviteCreateCmd>()
            .ForMember(d => d.OrgSpdId, opt => opt.MapFrom(s => s.OrgSpdId))
            .ForMember(d => d.ApplicationInviteCreateReqs, opt => opt.MapFrom(s => s.ApplicationInviteCreateRequests));


            CreateMap<ApplicationInviteCreateRequest, ApplicationInviteCreateReq>();
            CreateMap<ApplicationInviteCreateResp, ApplicationInviteCreateResponse>();
            CreateMap<ApplicationInviteCreateRequest, SearchInvitationQry>();
        }
    }
}
