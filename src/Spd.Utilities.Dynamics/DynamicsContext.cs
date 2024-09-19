using Microsoft.OData.Client;
using System.Diagnostics;
using System.Net;

namespace Spd.Utilities.Dynamics;

public class DynamicsContext : Microsoft.Dynamics.CRM.System, IDisposable
{
    public static readonly string ActivitySourceName = typeof(DynamicsContext).FullName!;
    private static ActivitySource source = new(ActivitySourceName);
    private Activity? executionActivity;

    private bool disposedValue;

    public DynamicsContext(Uri serviceRoot) : base(serviceRoot)
    {
        this.SendingRequest2 += Instrument;
        this.BuildingRequest += Instrument;
        this.ReceivingResponse += Instrument;
    }

    private void Instrument(object? sender, ReceivingResponseEventArgs e)
    {
        if (executionActivity != null)
        {
            var tags = new ActivityTagsCollection
            {
                { nameof(e.ResponseMessage.StatusCode), e.ResponseMessage.StatusCode }
            };
            if (e.Descriptor is EntityDescriptor ed)
            {
                tags.Add(nameof(EntityDescriptor.State), ed.State);
                tags.Add(nameof(EntityDescriptor.Entity), ed.Entity?.GetType().Name);
            }

            executionActivity.AddEvent(new ActivityEvent(nameof(ReceivingResponse), tags: tags));
            executionActivity.SetStatus(e.ResponseMessage.StatusCode != (int)HttpStatusCode.OK ? ActivityStatusCode.Error : ActivityStatusCode.Ok);
            executionActivity.Stop();
        }
    }

    private void Instrument(object? sender, BuildingRequestEventArgs e)
    {
        executionActivity = source.StartActivity(e.Method);
        executionActivity?.SetTag(nameof(e.Method), e.Method);
    }

    private void Instrument(object? sender, SendingRequest2EventArgs e)
    {
        if (executionActivity != null)
        {
            var tags = new ActivityTagsCollection
            {
                { nameof(e.IsBatchPart), e.IsBatchPart },
                { nameof(e.IsBulkUpdate), e.IsBulkUpdate },
                { nameof(e.RequestMessage.Url), e.RequestMessage.Url.ToString() }
            };
            if (e.Descriptor is EntityDescriptor ed)
            {
                tags.Add(nameof(EntityDescriptor.State), ed.State);
                tags.Add(nameof(EntityDescriptor.Entity), ed.Entity?.GetType().Name);
            }
            executionActivity.AddEvent(new ActivityEvent(nameof(SendingRequest2), tags: tags));
        }
    }

    protected virtual void Dispose(bool disposing)
    {
        if (!disposedValue)
        {
            if (disposing)
            {
                executionActivity?.Dispose();
            }

            disposedValue = true;
        }
    }

    public void Dispose()
    {
        Dispose(disposing: true);
        GC.SuppressFinalize(this);
    }
}