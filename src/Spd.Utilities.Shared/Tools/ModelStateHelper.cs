using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Spd.Utilities.Shared.Tools;
public static class ModelStateHelp
{
    public static IEnumerable<ValidationError> AllErrors(this ModelStateDictionary modelState) =>
        modelState.Keys.SelectMany(key => modelState[key].Errors.Select(x => new ValidationError(key, x.ErrorMessage))).ToList();

    public static string AllErrorsStr(this ModelStateDictionary modelState)
    {
        List<ValidationError> list = modelState.Keys.SelectMany(key => modelState[key].Errors.Select(x => new ValidationError(key, x.ErrorMessage))).ToList();
        return string.Join(";", list.Select(l => $"{l.Name}-{l.Reason}").ToList());
    }
}
public class ValidationError
{
    public string Name { get; }

    public string Reason { get; }

    public ValidationError(string name, string reason)
    {
        Name = name;
        Reason = reason;
    }
}
