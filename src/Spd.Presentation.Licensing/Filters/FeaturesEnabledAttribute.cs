using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Spd.Presentation.Licensing.Filters;

public class FeaturesEnabledAttribute : ActionFilterAttribute
{
    private readonly string _configVariable;
    private readonly bool? _expectedValue;

    public FeaturesEnabledAttribute(string configVariable, bool expectedValue)
    {
        _configVariable = configVariable;
        _expectedValue = expectedValue;
    }

    public override void OnActionExecuting(ActionExecutingContext context)
    {
        var config = context.HttpContext.RequestServices.GetService<IConfiguration>();
        var actualValue = config?.GetValue<bool?>(_configVariable);
        if (actualValue != _expectedValue)
        {
            context.Result = new NotFoundResult();
        }
    }
}


