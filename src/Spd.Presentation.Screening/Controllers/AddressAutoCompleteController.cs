using MediatR;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Admin;
using System.ComponentModel.DataAnnotations;

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
        /// Find addresses matching the search term.
        /// If the next step of the search process in returned data is "Find", use the result Id as next Find lastId to do next round search.Or use null.
        /// If the next step of the search process in returned data is "Retrieve", use the result Id as Retrieve endpoint Id to get final result.
        /// </summary>
        /// <param name="searchTerm">required</param>
        /// <param name="country">optional: The ISO 2 or 3 character code for the country to search in. If not specified, default would be CAN.</param>
        /// <param name="lastId">optional: The Id from a previous Find.</param>
        /// <returns></returns>
        /// Exp: GET http://localhost:5114/api/metadata/address?search=1
        /// Exp: GET http://localhost:5114/api/metadata/address?search=1&country=USA
        /// Exp: GET http://localhost:5114/api/metadata/address?search=1&lastId=1520704
        [Route("api/metadata/address")]
        [HttpGet]
        public async Task<IEnumerable<AddressFindResponse>> Find([FromQuery][Required] string search, string? country, string? lastId)
        {
            if (string.IsNullOrWhiteSpace(country))
                return await _mediator.Send(new FindAddressQuery(search, LastId: lastId));
            else
                return await _mediator.Send(new FindAddressQuery(search, country, lastId));
        }

        /// <summary>
        /// To retrieve the address details with Id for the item from Find method.
        /// </summary>
        /// <param name="id">the id from find items, like CAN|1520704</param>
        /// <returns></returns>
        /// Exp: GET http://localhost:5114/api/metadata/address/1520704
        [Route("api/metadata/address/{id}")]
        [HttpGet]
        public async Task<IEnumerable<AddressRetrieveResponse>> Retrieve([FromRoute] string id)
        {
            return await _mediator.Send(new RetrieveAddressByIdQuery(id));
        }
    }
}