namespace Spd.Manager.Licence;
internal partial class SecurityWorkerAppManager
{
    private record ChangeSpec
    {
        public bool CategoriesChanged { get; set; } //full update
        public bool DogRestraintsChanged { get; set; } //full update
        public bool PeaceOfficerStatusChanged { get; set; } //task
        public Guid? PeaceOfficerStatusChangeTaskId { get; set; }
        public bool MentalHealthStatusChanged { get; set; } //task
        public Guid? MentalHealthStatusChangeTaskId { get; set; }
        public bool CriminalHistoryChanged { get; set; } //task
        public Guid? CriminalHistoryStatusChangeTaskId { get; set; }
    }
}
