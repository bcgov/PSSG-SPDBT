public class InactiveException : Exception
{
    public InactiveException()
    {
    }

    public InactiveException(string message)
    : base(message)
    {
    }

    public InactiveException(string message, Exception inner)
        : base(message, inner)
    {
    }
}

