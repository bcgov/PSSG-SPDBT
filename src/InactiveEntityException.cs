using System;

public abstract class InactiveException : Exception
{
}

public UserInactiveException : InactiveException
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