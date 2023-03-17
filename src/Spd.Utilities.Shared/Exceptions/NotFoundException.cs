using System;

public abstract class NotFoundException : Exception
{
    public NotFoundException()
    {
    }

    public NotFoundException(string message)
        : base(message)
    {
    }

    public NotFoundException(string message, Exception inner)
        : base(message, inner)
    {
    }
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
