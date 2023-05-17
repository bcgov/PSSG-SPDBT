using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Spd.Utilities.Shared.Exceptions
{
    public class ApiError
    {
        public string message { get; set; }
        public bool isError { get; set; }
        public object? detail { get; set; } = null;
        //public object? errorDetails { get; set; } = null;

        public ApiError(string message, object? errorDetails = null)
        {
            isError = true;
            this.message = message;
            this.detail = errorDetails;
        }

        public ApiError(ModelStateDictionary modelState)
        {
            this.isError = true;
            if (modelState != null && modelState.Any(m => m.Value.Errors.Count > 0))
            {
                message = "Please correct the specified errors and try again.";
                //errors = modelState.SelectMany(m => m.Value.Errors).ToDictionary(m => m.Key, m=> m.ErrorMessage);
                //errors = modelState.SelectMany(m => m.Value.Errors.Select( me => new KeyValuePair<string,string>( m.Key,me.ErrorMessage) ));
                //errors = modelState.SelectMany(m => m.Value.Errors.Select(me => new ModelError { FieldName = m.Key, ErrorMessage = me.ErrorMessage }));
            }
        }
    }
}
