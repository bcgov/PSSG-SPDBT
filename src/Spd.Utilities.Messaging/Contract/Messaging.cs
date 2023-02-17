namespace Spd.Utilities.Messaging.Contract
{
#pragma warning disable S101 // Types should be named in PascalCase
#pragma warning disable S2326 // Unused type parameters should be removed

    public interface Command
    { }

    public interface Query<out T> where T : notnull
    {
    }

    public interface Event
    { }

#pragma warning restore S101 // Types should be named in PascalCase
#pragma warning restore S2326 // Unused type parameters should be removed
}
