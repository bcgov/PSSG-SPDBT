namespace Spd.Utilities.Dynamics
{
    public class DynamicsContext : Microsoft.Dynamics.CRM.System
    {
        public DynamicsContext(Uri serviceRoot) : base(serviceRoot)
        {
        }
    }
}
