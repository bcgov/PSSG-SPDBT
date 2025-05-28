using MediatR;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Common.Admin;
using Spd.Utilities.Shared;

namespace Spd.Presentation.GuideDogServiceDog.Controllers;

[ApiController]
public class DogSchoolController : SpdControllerBase
{
    private readonly IMediator _mediator;

    public DogSchoolController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get accredited dog Schools
    /// </summary>
    /// <param name="ct"></param>
    /// <returns></returns>
    [Route("api/accredited-dog-schools")]
    [HttpGet]
    public async Task<IEnumerable<DogSchoolResponse>> GetAccreditedDogTrainingSchools(CancellationToken ct)
    {
        return await _mediator.Send(new GetAccreditedDogTrainingSchoolListQuery(), ct);
    }
}
