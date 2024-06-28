using Spd.Resource.Repository;
using Spd.Resource.Repository.User;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

namespace Spd.Manager.Shared;
public static class SharedManagerFuncs
{
    public static void CheckMaxRoleNumberRuleAsync(
        int maxContacts, 
        int maxPrimaryContacts, 
        List<UserResult> userList, 
        PortalUserServiceCategoryEnum serviceCategoryEnum = PortalUserServiceCategoryEnum.Screening)
    {
        int primaryUserNo = 0;
        int userNo = userList.Count;
        if (userNo > maxContacts)
        {
            throw new OutOfRangeException(HttpStatusCode.BadRequest, $"No more contacts can be created. The limit of {maxContacts} contacts has been reached.");
        }

        if (serviceCategoryEnum == PortalUserServiceCategoryEnum.Screening)
            primaryUserNo = userList.Count(u => u.ContactAuthorizationTypeCode == ContactRoleCode.Primary);
        else
            primaryUserNo = userList.Count(u => u.ContactAuthorizationTypeCode == ContactRoleCode.PrimaryBusinessManager);

        if (primaryUserNo > maxPrimaryContacts)
        {
            throw new OutOfRangeException(HttpStatusCode.BadRequest, $"No more primary contacts can be created. The limit of {maxPrimaryContacts} primary contacts has been reached.");
        }
        if (primaryUserNo < 1)
        {
            throw new OutOfRangeException(HttpStatusCode.BadRequest, "There must be at least one primary user");
        }
    }
}
