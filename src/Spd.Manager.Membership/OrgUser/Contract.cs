using MediatR;

namespace Spd.Manager.Membership.OrgUser
{
    public interface IOrgUserManager
    {
        public Task<Unit> Handle(CreateOrgUserCommand request, CancellationToken cancellationToken);
    }
    public record CreateOrgUserCommand(OrgUserCreateRequest CreateOrgUserRequest) : IRequest<Unit>;
    public record OrgUserCreateRequest
    {
        public Guid OrganizationId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        //add role and other info here.
    }
}
