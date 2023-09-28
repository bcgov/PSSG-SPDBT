using MediatR;
using Spd.Resource.Applicants.Delegates;
using Spd.Resource.Applicants.PortalUser;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.Exceptions;

namespace Spd.Manager.Cases.Application
{
    internal partial class ApplicationManager
    {
        internal readonly int MAX_DELEGATE_NUMBER = 4;
        internal readonly int MIN_DELEGATE_INITIATOR_NUMBER = 1;
        public async Task<DelegateListResponse> Handle(DelegateListQuery query, CancellationToken ct)
        {
            var delegates = await _delegateRepository.QueryAsync(new DelegateQry(query.ApplicationId), ct);
            var delegateResps = _mapper.Map<IEnumerable<DelegateResponse>>(delegates.Items);

            return new DelegateListResponse
            {
                Delegates = delegateResps.OrderBy(o => o.FirstName).ThenBy(o => o.LastName)

            };
        }

        public async Task<DelegateResponse> Handle(CreateDelegateCommand command, CancellationToken ct)
        {
            //if already has an user. use email to connect
            Guid? userId = null;
            PortalUserListResp userList = await _portalUserRepository.QueryAsync(
                new PortalUserQry() { ParentOrganizationId = SpdConstants.BC_GOV_ORG_ID, UserEmail = command.CreateRequest.EmailAddress },
                ct
                );
            if (userList.Items.Any())
            {
                userId = userList.Items.First().Id;
            }

            DelegateListResp? allDelegateList = await _delegateRepository.QueryAsync(
                 new DelegateQry(command.ApplicationId),
                 ct);

            //check if existing or over max
            bool delegateAlreadyExists = allDelegateList.Items.Any(o => o.EmailAddress == command.CreateRequest.EmailAddress);
            if (delegateAlreadyExists)
            {
                throw new ApiException(System.Net.HttpStatusCode.BadRequest, "The person is already added to the application as a delegate.");
            }

            if (allDelegateList.Items.Where(o => o.PSSOUserRoleCode == PSSOUserRoleEnum.Delegate).Count() >= MAX_DELEGATE_NUMBER)
            {
                throw new ApiException(System.Net.HttpStatusCode.BadRequest, $"The application can only have {MAX_DELEGATE_NUMBER} delegates plus the Initiator.");
            }

            //create delegate
            if (userId == null)
            {
                //create user shell
                var createPortalUserCmd = _mapper.Map<CreatePortalUserCmd>(command.CreateRequest);
                createPortalUserCmd.OrgId = SpdConstants.BC_GOV_ORG_ID; //we do not know the user's org id yet.
                var user = await _portalUserRepository.ManageAsync(createPortalUserCmd, ct);
                userId = user.Id;
            }
            CreateDelegateCmd cmd = _mapper.Map<CreateDelegateCmd>(command.CreateRequest);
            cmd.PortalUserId = userId;
            cmd.ApplicationId = command.ApplicationId;
            var resp = await _delegateRepository.ManageAsync(cmd, ct);
            return _mapper.Map<DelegateResponse>(resp);
        }

        public async Task<Unit> Handle(DeleteDelegateCommand command, CancellationToken ct)
        {
            //do biz checking if the login person can delete the delegate
            bool canDoDelete = false;
            var delegateList = await _delegateRepository.QueryAsync(
                new DelegateQry(command.ApplicationId), ct);
            if (delegateList.Items.Count() <= MIN_DELEGATE_INITIATOR_NUMBER)
            {
                throw new ApiException(System.Net.HttpStatusCode.BadRequest, $"Only {MIN_DELEGATE_INITIATOR_NUMBER} delegate left, cannot delete the delegate.");
            }

            if (command.CurrentUserIsPSA)
                canDoDelete = true;
            else
            {
                var d = delegateList.Items.FirstOrDefault(d => d.PortalUserId == command.CurrentUserId);
                if (d == null)
                    throw new ApiException(System.Net.HttpStatusCode.BadRequest, "None PSA and not connected to the application, cannot remove delegate.");
                if (d.Id == command.Id) //can delete his own 
                    canDoDelete = true;
                else if (d.PSSOUserRoleCode == PSSOUserRoleEnum.Initiator)
                    canDoDelete = true; //initiator can delete others.
                else
                    throw new ApiException(System.Net.HttpStatusCode.BadRequest, "Non initiator cannot delete other delegate.");
            }

            if (canDoDelete)
            {
                DeleteDelegateCmd cmd = new DeleteDelegateCmd(command.Id);
                await _delegateRepository.ManageAsync(cmd, ct);
            }
            return default;
        }
    }
}