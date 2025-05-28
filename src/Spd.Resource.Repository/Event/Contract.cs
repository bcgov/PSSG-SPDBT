using MediatR;

namespace Spd.Resource.Repository.Event
{
    public interface IEventRepository
    {
        public Task<EventResp> GetAsync(Guid eventId, CancellationToken cancellationToken);
        public Task<Unit> ManageAsync(EventUpdateCmd cmd, CancellationToken ct);
        public Task<Unit> ManageInBatchAsync(List<EventUpdateCmd> cmd, CancellationToken ct);
        public Task<IEnumerable<EventResp>> QueryAsync(EventQuery qry, CancellationToken cancellationToken);
    }

    public record EventResp()
    {
        public Guid Id { get; set; }
        public EventTypeEnum EventTypeEnum { get; set; }
        public Guid? RegardingObjectId { get; set; }
        public string? RegardingObjectName { get; set; }
        public string? JobId { get; set; }
        public DateTimeOffset? LastExeTime { get; set; }
    }

    public record EventUpdateCmd()
    {
        public Guid Id { get; set; }
        public string? JobId { get; set; }
        public DateTimeOffset? LastExeTime { get; set; }
        public string? ErrorDescription { get; set; }
        public int StateCode { get; set; }
        public EventStatusReasonEnum EventStatusReasonEnum { get; set; }
    }

    public record EventQuery()
    {
        public IEnumerable<EventTypeEnum> EventTypeEnums { get; set; }
        public EventStatusReasonEnum EventStatusReasonEnum { get; set; }
        public DateTimeOffset? CutOffDateTime { get; set; }
    }

    public enum EventTypeEnum
    {
        BCMPScreeningFingerprintPrinting,
        BCMPSecurityWorkerLicencePrinting,
        BCMPArmouredVehiclePermitPrinting,
        BCMPBodyArmourPermitPrinting,
        BCMPBusinessLicencePrinting,
        BCMPMetalDealersPermitPrinting,
        BCMPGuideDogServiceDogTeamPrinting,
        BCMPDogTrainerPrinting,
        BCMPRetiredServiceDogPrinting
    }

    public enum EventStatusReasonEnum
    {
        Ready, //Active state status reason
        Error, //Active state status reason
        Processed, //Inactive State status reason
        Cancelled, //Inactive State status reason
        Success, //Inactive State status reason
        Fail //Inactive State status reason
    }
}