namespace Spd.Manager.Shared;
public static class SharedManagerFuncs
{
    public static void CheckMaxRoleNumberRuleAsync(
        int maxContacts, 
        int maxPrimaryContacts, 
        int primaryUserNo, 
        int userNo)
    {
        if (userNo > maxContacts)
        {
            throw new ArgumentException($"No more contacts can be created. The limit of {maxContacts} contacts has been reached.");
        }
        
        if (primaryUserNo > maxPrimaryContacts)
        {
            throw new ArgumentException($"No more primary contacts can be created. The limit of {maxPrimaryContacts} primary contacts has been reached.");
        }

        if (primaryUserNo < 1)
        {
            throw new ArgumentException("There must be at least one primary user");
        }
    }
}
