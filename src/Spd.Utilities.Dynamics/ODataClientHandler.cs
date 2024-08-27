using Microsoft.OData;
using Microsoft.OData.Client;
using Microsoft.OData.Extensions.Client;

namespace Spd.Utilities.Dynamics
{
    internal class ODataClientHandler(ISecurityTokenProvider tokenProvider) : IODataClientHandler
    {
        private string? authToken;

        public void OnClientCreated(ClientCreatedArgs args)
        {
            authToken = tokenProvider.AcquireToken().ConfigureAwait(false).GetAwaiter().GetResult();
            var client = args.ODataClient;
            client.SaveChangesDefaultOptions = SaveChangesOptions.BatchWithSingleChangeset;
            client.EntityParameterSendOption = EntityParameterSendOption.SendOnlySetProperties;
            client.Configurations.RequestPipeline.OnEntryStarting((arg) =>
            {
                // do not send reference properties and null values to Dynamics
                arg.Entry.Properties = arg.Entry.Properties.Cast<ODataProperty>().Where((prop) => !prop.Name.StartsWith('_') && prop.Value != null);
            });
            client.BuildingRequest += Client_BuildingRequest;
            client.SendingRequest2 += Client_SendingRequest2;
        }

        private void Client_SendingRequest2(object? sender, SendingRequest2EventArgs e)
        {
            e.RequestMessage.SetHeader("Authorization", $"Bearer {authToken}");
        }

        private void Client_BuildingRequest(object? sender, BuildingRequestEventArgs e)
        {
            if (e.RequestUri.IsAbsoluteUri)
            {
                string query = e.RequestUri.Query;
                if (!string.IsNullOrWhiteSpace(query))
                {
                    int page = 1;
                    List<string> queries = query.Split('&').ToList();
                    string? top = queries.Find(q => q.StartsWith("$top="));
                    if (!string.IsNullOrWhiteSpace(top))
                    {
                        var strs = top.Split("=");
                        var pageSize = Int32.Parse(strs[1]);
                        string? skip = queries.Find(q => q.StartsWith("$skip="));
                        if (!string.IsNullOrWhiteSpace(skip))
                        {
                            var skipValue = skip.Split("=");
                            var skipRecordsNumber = Int32.Parse(skipValue[1]);
                            page = skipRecordsNumber / pageSize + 1;
                            //when api use skip, it needs rewrite the http request as following.
                            queries.Remove(skip);
                            queries.Add($"$skiptoken=<cookie pagenumber='{page}'/>");
                            string str = $"{e.RequestUri.Scheme}://{e.RequestUri.Host}{e.RequestUri.AbsolutePath}{string.Join("&", queries)}";
                            e.RequestUri = new Uri(str);
                        }
                    }
                }
            }
        }
    }
}