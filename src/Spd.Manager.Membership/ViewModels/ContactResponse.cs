namespace Spd.Manager.Membership.ViewModels
{
    public class ContactResponse
    {
        public Guid Id { get; set; }
        public string MobilePhoneNumer { get; set; }
        public DateTime BirthDate { get; set; }
        public string Sex { get; set; }
        public string EmailAddr { get; set; }
        public bool HasChildren { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
    }
}
