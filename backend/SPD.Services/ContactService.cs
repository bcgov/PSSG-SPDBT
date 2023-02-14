using SPD.Common.ViewModels.Contact;
using SPD.DynamicsProxy;

namespace SPD.Services
{
    public interface IContactService
    {
        Task<bool> CreateContactAsync(ContactCreateRequest createRequest, CancellationToken cancellationToken);
        Task<List<ContactResponse>> GetAllContacts();
    }
    public class ContactService : IContactService
    {
        public readonly DynamicsContext _dynaContext;
        public ContactService(IDynamicsContextFactory ctx)
        {
            _dynaContext = ctx.Create();
        }

        public async Task<bool> CreateContactAsync(ContactCreateRequest createRequest, CancellationToken cancellationToken)
        {
            //todo: add mapping to map createRequest to Contact
            _dynaContext.AddToContacts(
                new Microsoft.Dynamics.CRM.Contact() { Contactid = Guid.NewGuid(), Firstname = "test2", Lastname = "test2" });
            await _dynaContext.SaveChangesAsync(cancellationToken);
            return true;
        }

        //todo: change return type to List<ContactResponse>
        public async Task<List<ContactResponse>> GetAllContacts()
        {
            var data = await _dynaContext.Contacts.GetAllPagesAsync();
            //add mapping to map to contactResponse.
            List<ContactResponse> responses = new List<ContactResponse>();
            return responses;
        }
    }
}
