/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpContext } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { AddressFindResponse } from '../models/address-find-response';
import { AddressRetrieveResponse } from '../models/address-retrieve-response';

@Injectable({
  providedIn: 'root',
})
export class AddressAutoCompleteService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation apiMetadataAddressGet
   */
  static readonly ApiMetadataAddressGetPath = '/api/metadata/address';

  /**
   * Find addresses matching the search term.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiMetadataAddressGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiMetadataAddressGet$Response(params: {

    /**
     * required
     */
    search: string;

    /**
     * optional, The ISO 2 or 3 character code for the country to search in. Default would be CAN
     */
    country?: string;

    /**
     * optional, The Id from a previous Find
     */
    lastId?: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Array<AddressFindResponse>>> {

    const rb = new RequestBuilder(this.rootUrl, AddressAutoCompleteService.ApiMetadataAddressGetPath, 'get');
    if (params) {
      rb.query('search', params.search, {});
      rb.query('country', params.country, {});
      rb.query('lastId', params.lastId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<AddressFindResponse>>;
      })
    );
  }

  /**
   * Find addresses matching the search term.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiMetadataAddressGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiMetadataAddressGet(params: {

    /**
     * required
     */
    search: string;

    /**
     * optional, The ISO 2 or 3 character code for the country to search in. Default would be CAN
     */
    country?: string;

    /**
     * optional, The Id from a previous Find
     */
    lastId?: string;
  },
  context?: HttpContext

): Observable<Array<AddressFindResponse>> {

    return this.apiMetadataAddressGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<Array<AddressFindResponse>>) => r.body as Array<AddressFindResponse>)
    );
  }

  /**
   * Path part for operation apiMetadataAddressIdGet
   */
  static readonly ApiMetadataAddressIdGetPath = '/api/metadata/address/{id}';

  /**
   * To retrieve the address details with Id for the item from Find method.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiMetadataAddressIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiMetadataAddressIdGet$Response(params: {

    /**
     * the id from find items, like CAN|1520704
     */
    id: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Array<AddressRetrieveResponse>>> {

    const rb = new RequestBuilder(this.rootUrl, AddressAutoCompleteService.ApiMetadataAddressIdGetPath, 'get');
    if (params) {
      rb.path('id', params.id, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<AddressRetrieveResponse>>;
      })
    );
  }

  /**
   * To retrieve the address details with Id for the item from Find method.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiMetadataAddressIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiMetadataAddressIdGet(params: {

    /**
     * the id from find items, like CAN|1520704
     */
    id: string;
  },
  context?: HttpContext

): Observable<Array<AddressRetrieveResponse>> {

    return this.apiMetadataAddressIdGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<Array<AddressRetrieveResponse>>) => r.body as Array<AddressRetrieveResponse>)
    );
  }

}
