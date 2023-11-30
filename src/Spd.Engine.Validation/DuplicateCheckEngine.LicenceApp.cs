namespace Spd.Engine.Validation
{
    internal partial class DuplicateCheckEngine : IDuplicateCheckEngine
    {
        public async Task<LicenceAppDuplicateCheckResponse> LicenceAppDuplicateCheckAsync(LicenceAppDuplicateCheckRequest licAppRequest, CancellationToken ct)
        {
            //check if for current contact, there is already the same type app in draft or in progress
            //if yes, return found

            //check if there is already issued licence for the same type
            return null;
        }
    }
}