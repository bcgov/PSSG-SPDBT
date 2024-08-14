using Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;

namespace Spd.Utilities.Dynamics;

public enum EntityState
{
    Active = 0,
    Inactive = 1
}

public static class DataServiceContextExtensions
{
    public static void DetachAll(this DataServiceContext context)
    {
        foreach (var descriptor in context.EntityTracker.Entities)
        {
            context.Detach(descriptor.Entity);
        }
        foreach (var link in context.EntityTracker.Links)
        {
            context.DetachLink(link.Source, link.SourceProperty, link.Target);
        }
    }

    public static void ActivateObject<TEntity>(this DataServiceContext context, TEntity entity, int activeStatusValue = -1)
         where TEntity : crmbaseentity => ModifyEntityStatus(context, entity, (int)EntityState.Active, activeStatusValue);

    public static void DeactivateObject<TEntity>(this DataServiceContext context, TEntity entity, int inactiveStatusValue = -1)
         where TEntity : crmbaseentity => ModifyEntityStatus(context, entity, (int)EntityState.Inactive, inactiveStatusValue);

    private static void ModifyEntityStatus<TEntity>(this DataServiceContext context, TEntity entity, int state, int status)
         where TEntity : crmbaseentity
    {
        var entityType = entity.GetType();
        var statusProp = entityType.GetProperty("statuscode");
        var stateProp = entityType.GetProperty("statecode");

        if (statusProp == null) throw new InvalidOperationException($"statuscode property not found in type {entityType.FullName}");
        if (stateProp == null) throw new InvalidOperationException($"statecode property not found in type {entityType.FullName}");

        statusProp.SetValue(entity, status);
        if (state >= 0) stateProp.SetValue(entity, state);

        context.UpdateObject(entity);
    }

    public static async Task<T?> SingleOrDefaultAsync<T>(this IQueryable<T> query, CancellationToken ct = default)
        where T : crmbaseentity => (await ((DataServiceQuery<T>)query).Take(2).ExecuteForEditAsync(ct)).SingleOrDefault();

    public static async Task<T?> FirstOrDefaultAsync<T>(this IQueryable<T> query, CancellationToken ct = default)
        where T : crmbaseentity => (await ((DataServiceQuery<T>)query).Take(1).ExecuteForEditAsync(ct)).FirstOrDefault();

    public static async Task<IEnumerable<T>> GetAllPagesAsync<T>(this IQueryable<T> query, CancellationToken ct = default)
        where T : crmbaseentity => await ((DataServiceQuery<T>)query).GetAllPagesAsync(ct);

    public static async Task<DataServiceCollection<T>> ExecuteForEditAsync<T>(this IQueryable<T> query, CancellationToken ct = default)
        where T : crmbaseentity => new DataServiceCollection<T>(await ((DataServiceQuery<T>)query).ExecuteAsync(ct));
}