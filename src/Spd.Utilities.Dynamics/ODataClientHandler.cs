using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.OData.Client;
using Microsoft.OData.Extensions.Client;

namespace Spd.Utilities.Dynamics
{
    internal class ODataClientHandler : IODataClientHandler
    {
        private readonly DynamicsSettings options;
        private readonly ISecurityTokenProvider tokenProvider;
        private readonly ILogger<IODataClientHandler> logger;
        private string? authToken;

        public ODataClientHandler(IOptions<DynamicsSettings> options, ISecurityTokenProvider tokenProvider, ILogger<IODataClientHandler> logger)
        {
            this.options = options.Value;
            this.tokenProvider = tokenProvider;
            this.logger = logger;
        }

        public void OnClientCreated(ClientCreatedArgs args)
        {
            authToken = tokenProvider.AcquireToken().ConfigureAwait(false).GetAwaiter().GetResult();
            var client = args.ODataClient;
            client.SaveChangesDefaultOptions = SaveChangesOptions.BatchWithSingleChangeset;
            client.EntityParameterSendOption = EntityParameterSendOption.SendOnlySetProperties;
            client.Configurations.RequestPipeline.OnEntryStarting((arg) =>
            {
                // do not send reference properties and null values to Dynamics
                arg.Entry.Properties = arg.Entry.Properties.Where((prop) => !prop.Name.StartsWith('_') && prop.Value != null);
            });
            client.BuildingRequest += Client_BuildingRequest;
            client.SendingRequest2 += Client_SendingRequest2;
        }

        private void Client_SendingRequest2(object sender, SendingRequest2EventArgs e)
        {
            e.RequestMessage.SetHeader("Authorization", $"Bearer {authToken}");
        }

        private void Client_BuildingRequest(object sender, BuildingRequestEventArgs e)
        {
            if (e.RequestUri.IsAbsoluteUri)
            {
                string query = e.RequestUri.Query;
                if (!string.IsNullOrWhiteSpace(query))
                {
                    int page = 1;
                    List<string> queries = query.Split('&').ToList();
                    string? top = queries.FirstOrDefault(q => q.StartsWith("$top="));
                    if (!string.IsNullOrWhiteSpace(top))
                    {
                        var strs = top.Split("=");
                        var pageSize = Int32.Parse(strs[1]);
                        string? skip = queries.FirstOrDefault(q => q.StartsWith("$skip="));
                        if (!string.IsNullOrWhiteSpace(skip))
                        {
                            var skipValue = skip.Split("=");
                            var skipRecordsNumber = Int32.Parse(skipValue[1]);
                            page = skipRecordsNumber / pageSize + 1;
                            //when api use skip, it needs rewrite the http request as following.
                            queries.Remove(skip);
                            queries.Add($"$skiptoken=<cookie pagenumber='{page}'/>");
                            string str = $"{e.RequestUri.Scheme}://{e.RequestUri.Host}{e.RequestUri.AbsolutePath}{string.Join("&", queries)}";
                            //logger.LogCritical($"send {str} to dynamics");
                            e.RequestUri = new Uri(str);
                        }
                    }
                }
            }
            logger.LogCritical($"send {e.RequestUri.ToString()} to dynamics");
        }

#pragma warning disable S3358 // Ternary operators should not be nested

        //private static Uri RewriteRequestUri(DataServiceContext ctx, Uri endpointUri, Uri requestUri) =>
        //   requestUri.IsAbsoluteUri
        //         ? new Uri(endpointUri, $"{(endpointUri.AbsolutePath == "/" ? string.Empty : endpointUri.AbsolutePath)}{requestUri.AbsolutePath}{requestUri.Query}")
        //         : new Uri(endpointUri, $"{(endpointUri.AbsolutePath == "/" ? string.Empty : endpointUri.AbsolutePath)}{ctx.BaseUri.AbsolutePath}{requestUri.ToString()}");

#pragma warning restore S3358 // Ternary operators should not be nested
    }
}
