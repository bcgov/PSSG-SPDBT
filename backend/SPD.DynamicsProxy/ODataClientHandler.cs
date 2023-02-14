﻿using Microsoft.Extensions.Options;
using Microsoft.OData.Client;
using Microsoft.OData.Extensions.Client;

namespace SPD.DynamicsProxy
{
    internal class ODataClientHandler : IODataClientHandler
    {
        private readonly DynamicsSettings options;
        private readonly ISecurityTokenProvider tokenProvider;
        private string? authToken;

        public ODataClientHandler(IOptions<DynamicsSettings> options, ISecurityTokenProvider tokenProvider)
        {
            this.options = options.Value;
            this.tokenProvider = tokenProvider;
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
            // client.BuildingRequest += Client_BuildingRequest;
            client.SendingRequest2 += Client_SendingRequest2;
        }

        private void Client_SendingRequest2(object sender, SendingRequest2EventArgs e)
        {
            e.RequestMessage.SetHeader("Authorization", $"Bearer {authToken}");
        }

        //private void Client_BuildingRequest(object sender, BuildingRequestEventArgs e)
        //{
        //    if (e.RequestUri != null)
        //        e.RequestUri = RewriteRequestUri((DataServiceContext)sender, options.EndpointUrl ?? null!, e.RequestUri);
        //}

#pragma warning disable S3358 // Ternary operators should not be nested

        //private static Uri RewriteRequestUri(DataServiceContext ctx, Uri endpointUri, Uri requestUri) =>
        //   requestUri.IsAbsoluteUri
        //         ? new Uri(endpointUri, $"{(endpointUri.AbsolutePath == "/" ? string.Empty : endpointUri.AbsolutePath)}{requestUri.AbsolutePath}{requestUri.Query}")
        //         : new Uri(endpointUri, $"{(endpointUri.AbsolutePath == "/" ? string.Empty : endpointUri.AbsolutePath)}{ctx.BaseUri.AbsolutePath}{requestUri.ToString()}");

#pragma warning restore S3358 // Ternary operators should not be nested
    }
}
