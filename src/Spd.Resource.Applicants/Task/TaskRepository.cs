using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Caching.Distributed;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Applicants.Task;
internal class TaskRepository : ITaskRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;

    public TaskRepository(IDynamicsContextFactory ctx, IMapper mapper, IDistributedCache cache)
    {
        _context = ctx.Create();
        _mapper = mapper;
    }

    public async Task<TaskListResp> QueryAsync(TaskQry qry, CancellationToken cancellationToken)
    {
        IEnumerable<spd_licencefee>? feeResult = _context.spd_licencefees.Expand(a => a.spd_ServiceTypeId).ToList();

        //if (!qry.IncludeInactive)
        //    feeResult = feeResult.Where(d => d.statecode != DynamicsConstants.StateCode_Inactive);

        //if (qry.WorkerLicenceTypeEnum != null)
        //{
        //    DynamicsContextLookupHelpers.ServiceTypeGuidDictionary.TryGetValue(qry.WorkerLicenceTypeEnum.ToString(), out Guid stGuid);
        //    feeResult = feeResult.Where(f => f._spd_servicetypeid_value == stGuid);
        //}

        //if (qry.LicenceTermEnum != null)
        //{
        //    int term = (int)Enum.Parse<LicenceTermOptionSet>(qry.LicenceTermEnum.ToString());
        //    feeResult = feeResult.Where(f => f.spd_term == term);
        //}

        //if (qry.ApplicationTypeEnum != null)
        //{
        //    int type = (int)Enum.Parse<LicenceApplicationTypeOptionSet>(qry.ApplicationTypeEnum.ToString());
        //    feeResult = feeResult.Where(f => f.spd_type == type);
        //}

        //if (qry.BusinessTypeEnum != null)
        //{
        //    int bizType = (int)Enum.Parse<BusinessTypeOptionSet>(qry.BusinessTypeEnum.ToString());
        //    feeResult = feeResult.Where(f => f.spd_businesstype == bizType);
        //}

        //if (qry.HasValidSwl90DayLicence != null)
        //{
        //    int hasValidSwl90Day = (int)SharedMappingFuncs.GetYesNo(qry.HasValidSwl90DayLicence);
        //    feeResult = feeResult.Where(f => f.spd_hasvalidswl90daylicence == hasValidSwl90Day);
        //}
        var list = _mapper.Map<IEnumerable<TaskResp>>(feeResult);
        var response = new TaskListResp();
        response.TaskResps = list;
        return response;
    }
}
