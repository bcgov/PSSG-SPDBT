using System;

public abstract class InactiveException : Exception
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

public class UserInactiveException : InactiveException
{
    public UserInactiveException()
    {
    }

    public UserInactiveException(string message)
        : base(message)
    {
    }

    public UserInactiveException(string message, Exception inner)
        : base(message, inner)
    {
    }
}