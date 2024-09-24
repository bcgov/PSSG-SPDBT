namespace Spd.Utilities.Dynamics
{
    public static class DynamicsConstants
    {
        public static readonly int StateCode_Active;
        public static readonly int StateCode_Inactive = 1;
        public static readonly int StatusCode_Active = 1;
        public static readonly int StatusCode_Inactive = 2;
        public static readonly string Client_Service_Team_Guid = "65e0b015-ee9d-ed11-b83d-00505683fbf4";
        public static readonly string Licensing_Client_Service_Team_Guid = "9872da9f-397f-ee11-b846-00505683fbf4";
        public static readonly string Licensing_Risk_Assessment_Coordinator_Team_Guid = "b322c8f6-a8eb-ed11-b843-00505683fbf4";
        public static readonly string Screening_Risk_Assessment_Coordinator_Team_Guid = "4c48c814-32c1-ed11-b840-00505683fbf4";
        public static readonly Guid AUTHORIZED_FOR_USE_OF_DOGS = Guid.Parse("f98cf56c-4983-ee11-b843-005056830319");
        public static readonly Guid AUTHORIZED_FOR_USE_OF_DOGS_PROTECTION = Guid.Parse("fb8cf56c-4983-ee11-b843-005056830319");
        public static readonly Guid AUTHORIZED_FOR_USE_OF_DOGS_DRUG_DETECTION = Guid.Parse("fd8cf56c-4983-ee11-b843-005056830319");
        public static readonly Guid AUTHORIZED_FOR_USE_OF_DOGS_EXPLOSIVE_DETECTION = Guid.Parse("ff8cf56c-4983-ee11-b843-005056830319");
        public static readonly Guid AUTHORIZED_FOR_USE_OF_RESTRAINTS = Guid.Parse("018df56c-4983-ee11-b843-005056830319");
    }
}
