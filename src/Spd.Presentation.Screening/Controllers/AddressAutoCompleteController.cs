using MediatR;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Admin;

namespace Spd.Presentation.Screening.Controllers
{
    [ApiController]
    public class AddressAutoCompleteController : ControllerBase
    {
        private readonly ILogger<AddressAutoCompleteController> _logger;
        private readonly IMediator _mediator;

        public AddressAutoCompleteController(ILogger<AddressAutoCompleteController> logger, IMediator mediator)
        {
            _logger = logger;
            _mediator = mediator;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="searchTerm"></param>
        /// <returns></returns>
        /// Exp: GET http://localhost:5114/api/address-autocomplete?searchTerm=1
        [Route("api/address-autocomplete")]
        [HttpGet]
        public async Task<IEnumerable<AddressFindResponse>> Find([FromQuery] string searchTerm)
        {
            return await _mediator.Send(new FindAddressQuery(searchTerm));
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// Exp: GET http://localhost:5114/api/address-autocomplete/{}
        [Route("api/address-autocomplete/{id}")]
        [HttpGet]
        public async Task<IEnumerable<AddressRetrieveResponse>> Retrieve([FromRoute] string id)
        {
            return await _mediator.Send(new RetrieveAddressByIdQuery(id));
        }
    }
}