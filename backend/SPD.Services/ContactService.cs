using SPD.Common.ViewModels.Contact;
using SPD.DynamicsProxy;
using SPD.DynamicsProxy.Entities;

namespace SPD.Services
{
    public interface IContactService
    {
        Task<bool> CreateContactAsync(ContactCreateRequest createRequest, CancellationToken cancellationToken);
        Task<List<Contact>> GetAllContacts();
    }
    public class ContactService : IContactService
    {
        public readonly DynamicsContext _dynaContext;
        public ContactService(IDynamicsContextFactory ctx)
        {
            _dynaContext = ctx.CreateReadOnly();
        }

        public async Task<bool> CreateContactAsync(ContactCreateRequest createRequest, CancellationToken cancellationToken)
        {
            //todo: add mapping to map createRequest to Contact
            await _dynaContext.AddAsync(
                new Contact() { Id = Guid.NewGuid(), FirstName = "test2", LastName = "test2" },
                cancellationToken);
            return true;
        }

        //todo: change return type to List<ContactResponse>
        public async Task<List<Contact>> GetAllContacts()
        {
            var data = await _dynaContext.Contacts.GetAllPagesAsync();
            //add mapping to map to contactResponse.
            return data.ToList();
        }
    }
}
