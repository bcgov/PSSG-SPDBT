using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;

namespace Spd.Utilities.Hosting
{
    public class PipelineServices
    {
        public IApplicationBuilder Application { get; set; } = null!;
        public IConfiguration Configuration { get; set; } = null!;
        public IHostEnvironment Environment { get; set; } = null!;
    }

    public interface IConfigureComponentPipeline
    {
        void ConfigurePipeline(PipelineServices services);
    }
}
