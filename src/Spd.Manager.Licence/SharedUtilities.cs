using Spd.Resource.Repository.LicenceApplication;

namespace Spd.Manager.Licence;
public static class SharedUtilities
{
    public static List<BodyArmourPermitReasonCode> GetBodyArmourPermitReasonCodes(WorkerLicenceTypeEnum workerLicenceType, List<PermitPurposeEnum>? permitPurposes)
    {
        List<BodyArmourPermitReasonCode> bodyArmourPermitReasonCodes = [];

        if (workerLicenceType != WorkerLicenceTypeEnum.BodyArmourPermit || permitPurposes == null) return bodyArmourPermitReasonCodes;

        foreach (PermitPurposeEnum permitPurpose in permitPurposes)
        {
            BodyArmourPermitReasonCode bodyArmourPermitReasonCode;

            if (Enum.TryParse(permitPurpose.ToString(), out bodyArmourPermitReasonCode))
                bodyArmourPermitReasonCodes.Add(bodyArmourPermitReasonCode);
        }

        return bodyArmourPermitReasonCodes;
    }

    public static List<ArmouredVehiclePermitReasonCode> GetArmouredVehiclePermitReasonCodes(WorkerLicenceTypeEnum workerLicenceType, List<PermitPurposeEnum>? permitPurposes)
    {
        List<ArmouredVehiclePermitReasonCode> armouredVehiclePermitReasonCodes = [];

        if (workerLicenceType != WorkerLicenceTypeEnum.ArmouredVehiclePermit || permitPurposes == null) return armouredVehiclePermitReasonCodes;

        foreach (PermitPurposeEnum permitPurpose in permitPurposes)
        {
            ArmouredVehiclePermitReasonCode armouredVehiclePermitReasonCode;

            if (Enum.TryParse(permitPurpose.ToString(), out armouredVehiclePermitReasonCode))
                armouredVehiclePermitReasonCodes.Add(armouredVehiclePermitReasonCode);
        }

        return armouredVehiclePermitReasonCodes;
    }

}
