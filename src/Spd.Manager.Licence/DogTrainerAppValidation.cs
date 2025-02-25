using FluentValidation;

namespace Spd.Manager.Licence;

public class DogTrainerAppNewRequestValidator<T> : AbstractValidator<T> where T : DogTrainerRequest
{
    public DogTrainerAppNewRequestValidator()
    {

    }
}