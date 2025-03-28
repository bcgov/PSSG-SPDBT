namespace Spd.Resource.Repository.DogTeam
{
    public interface IDogTeamRepository
    {
        public Task<DogTeamResp> GetAsync(Guid dogTeamId, CancellationToken cancellationToken);
    }

    public record DogTeamResp
    {
        public Guid Id { get; set; }
        public Guid? DogId { get; set; }
        public Guid? HandlerId { get; set; }
        public string? DogName { get; set; }
        public DateOnly? DogDateOfBirth { get; set; }
        public string? DogBreed { get; set; }
        public string? DogColorAndMarkings { get; set; }
        public GenderEnum? DogGender { get; set; }
        public string? MicrochipNumber { get; set; }
    }
}
