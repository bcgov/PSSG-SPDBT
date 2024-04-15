using AutoMapper;
using Spd.Manager.Common;

namespace Spd.Presentation.Dynamics;

public class Mapping : Profile
{
    public Mapping()
    {
        CreateMap<JobSpecification, Spd.Manager.Common.JobSpecification>()
               .ConstructUsing(s => CreateFromJobSpecification(s));
    }

    private static Spd.Manager.Common.JobSpecification CreateFromJobSpecification(JobSpecification specs) =>
      specs.Class switch
      {
          JobClassification.BcMailPlusFingerprintLetter => new FingerprintLetterJobSpecification(specs.JobContextId),
          JobClassification.BCMailPlusBusinessLicence => throw new NotImplementedException(),
          _ => throw new NotImplementedException()
      };
}
