using Microsoft.OData.Client;
using SPD.DynamicsProxy.Entities;

namespace SPD.DynamicsProxy
{
    public class DynamicsContext : DataServiceContext
    {
        public DataServiceQuery<OrgRegistration> OrgRegistrations { get; set; }
        public DataServiceQuery<Contact> Contacts { get; set; }
        public DynamicsContext(Uri serviceRoot) : base(serviceRoot)
        {
            OrgRegistrations = base.CreateQuery<OrgRegistration>("spd_orgregistrations");
            Contacts = base.CreateQuery<Contact>("contacts");
        }

        public async Task AddAsync<T> (T entity, CancellationToken cancellationToken) where T : DynamicsEntity
        {
            string entitySetName = "spd_orgregistrations";
            OriginalNameAttribute originalNameAttr =(OriginalNameAttribute)typeof(T)
                .GetCustomAttributes(typeof(OriginalNameAttribute), true)
                .FirstOrDefault();
            if (originalNameAttr != null) 
            {
                entitySetName = $"{originalNameAttr.OriginalName}s";
            }
            base.AddObject(entitySetName, entity);
            await base.SaveChangesAsync(cancellationToken);

        }        
    }   
}
