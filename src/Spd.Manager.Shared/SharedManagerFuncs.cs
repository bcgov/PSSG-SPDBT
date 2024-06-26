using Spd.Resource.Repository;
using Spd.Resource.Repository.Org;
using Spd.Resource.Repository.User;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

namespace Spd.Manager.Shared;
public static class SharedManagerFuncs
{
    public static void CheckMaxRoleNumberRuleAsync(OrgQryResult org, List<UserResult> userList)
    {
        int maxContacts = org != null ? org.OrgResult.MaxContacts : 0;
        int maxPrimaryContacts = org != null ? org.OrgResult.MaxPrimaryContacts : 0;
        int userNo = userList.Count;
        if (userNo > maxContacts)
        {
            throw new OutOfRangeException(HttpStatusCode.BadRequest, $"No more contacts can be created. The limit of {maxContacts} contacts has been reached.");
        }
        int primaryUserNo = userList.Count(u => u.ContactAuthorizationTypeCode == ContactRoleCode.Primary);
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
