using System;

public abstract class NotFoundException : Exception
{
}

public class UserNotFoundException : NotFoundException
{
    public UserNotFoundException()
    {
    }

    public UserNotFoundException(string message)
        : base(message)
    {
    }

    public UserNotFoundException(string message, Exception inner)
        : base(message, inner)
    {
    }
}
