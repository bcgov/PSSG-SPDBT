using Microsoft.OData.Client;

namespace SPD.DynamicsProxy.Entities
{
    [Key("Id")]
    [OriginalName("contact")]
    public class Contact : DynamicsEntity
    {
        [System.ComponentModel.DataAnnotations.Key]
        [OriginalName("contactid")]
        public Guid Id { get; set; }

        [OriginalName("firstname")]
        public string FirstName { get; set; }

        [OriginalName("lastname")]
        public string LastName { get; set; }
    }
}
