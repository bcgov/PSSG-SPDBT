using MediatR;
using Microsoft.AspNetCore.Mvc;
using Spd.Manager.Common.Admin;
using Spd.Utilities.Shared;
using System.ComponentModel.DataAnnotations;

namespace Spd.Presentation.Licensing.Controllers;

public class AddressAutoCompleteController : SpdControllerBase
{
    private readonly IMediator _mediator;

    public AddressAutoCompleteController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Find addresses matching the search term.
    /// </summary>
    /// <remark>
    /// If the next step of the search process in returned data is Find, use the result Id as next Find lastId to do next round search.Or use null.
    /// If the next step of the search process in returned data is Retrieve, use the result Id as Retrieve endpoint Id to get final result.
    /// </remark>
    /// <param name="search">required</param>
    /// <param name="country">optional, The ISO 2 or 3 character code for the country to search in. Default would be CAN</param>
    /// <param name="lastId">optional, The Id from a previous Find</param>
    /// <returns>AddressFindResponse</returns>
    /// Exp: GET http://localhost:5114/api/metadata/address?search=1
    /// Exp: GET http://localhost:5114/api/metadata/address?search=1&amp;country=USA
    //Exp: GET http://localhost:5114/api/metadata/address?search=1&lastId=1520704
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
    /// <returns>AddressRetrieveResponse</returns>
    /// Exp: GET http://localhost:5114/api/metadata/address/1520704
    [Route("api/metadata/address/{id}")]
    [HttpGet]
    public async Task<IEnumerable<AddressRetrieveResponse>> Retrieve([FromRoute] string id)
    {
        return await _mediator.Send(new RetrieveAddressByIdQuery(id));
    }
}