using Microsoft.Extensions.Options;
using Microsoft.OData.Client;
using Microsoft.OData.Extensions.Client;

namespace Spd.Utilities.Dynamics
{
    public interface IDynamicsContextFactory
    {
        DynamicsContext Create();

        DynamicsContext CreateReadOnly();

        DynamicsContext CreateChangeOverwrite();
    }

    internal class DynamicsContextFactory : IDynamicsContextFactory
    {
        private readonly IODataClientFactory odataClientFactory;
        private readonly DynamicsSettings settings;

        public DynamicsContextFactory(IODataClientFactory odataClientFactory, IOptions<DynamicsSettings> dynamicsOptions)
        {
            this.odataClientFactory = odataClientFactory;
            settings = dynamicsOptions.Value;
        }

        public DynamicsContext Create() => Create(MergeOption.AppendOnly);

        public DynamicsContext CreateChangeOverwrite() => Create(MergeOption.OverwriteChanges);

        public DynamicsContext CreateReadOnly() => Create(MergeOption.NoTracking);

        private DynamicsContext Create(MergeOption mergeOption)
        {
            var ctx = odataClientFactory.CreateClient<DynamicsContext>(settings.EntityBaseUri, "dynamics");
            ctx.MergeOption = mergeOption;
            return ctx;
        }
    }
}
