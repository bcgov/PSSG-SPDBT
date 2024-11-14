using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Spd.Utilities.Hosting;
public interface IProvideInstrumentationSources
{
    InstrumentationSources GetInstrumentationSources();
}

public record InstrumentationSources
{
    public IEnumerable<string> TraceSources { get; set; } = [];
}

