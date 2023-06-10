using AutoMapper;
using Spd.Manager.Membership.UserProfile;
using Spd.Utilities.LogonUser;

namespace Spd.Presentation.Screening.Controllers;

internal class Mappings : Profile
{
    public Mappings()
    {
        CreateMap<PortalUserIdentityInfo, PortalUserIdentity>();

    }
}

