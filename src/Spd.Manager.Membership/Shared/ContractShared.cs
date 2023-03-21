using System.ComponentModel;


namespace Spd.Manager.Membership.Shared
{

    public enum PayerPreferenceTypeCode
    {
        [Description("Organization")]
        Organization,

        [Description("Applicant")]
        Applicant
    }

    public enum BooleanTypeCode
    {
        [Description("Yes")]
        Yes,

        [Description("No")]
        No
    }
}
