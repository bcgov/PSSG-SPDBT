namespace Spd.Infrastructure.Common
{
    public static class AppExecutionContextHelper
    {
        private static AsyncLocal<AppExecutionContext> current = new AsyncLocal<AppExecutionContext>();

        internal static AppExecutionContext Current => current.Value;

        public static void SetContext(string name, IServiceProvider services, CancellationToken ct) =>
            current.Value = new AppExecutionContext(name, services, ct);
    }
}
