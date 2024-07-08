/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { AddressFindResponse } from '../models/address-find-response';
import { AddressRetrieveResponse } from '../models/address-retrieve-response';
import { apiMetadataAddressGet } from '../fn/address-auto-complete/api-metadata-address-get';
import { ApiMetadataAddressGet$Params } from '../fn/address-auto-complete/api-metadata-address-get';
import { apiMetadataAddressIdGet } from '../fn/address-auto-complete/api-metadata-address-id-get';
import { ApiMetadataAddressIdGet$Params } from '../fn/address-auto-complete/api-metadata-address-id-get';

@Injectable({ providedIn: 'root' })
export class AddressAutoCompleteService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `apiMetadataAddressGet()` */
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
  apiMetadataAddressGet$Response(params: ApiMetadataAddressGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<AddressFindResponse>>> {
    return apiMetadataAddressGet(this.http, this.rootUrl, params, context);
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
  apiMetadataAddressGet(params: ApiMetadataAddressGet$Params, context?: HttpContext): Observable<Array<AddressFindResponse>> {
    return this.apiMetadataAddressGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<AddressFindResponse>>): Array<AddressFindResponse> => r.body)
    );
  }

  /** Path part for operation `apiMetadataAddressIdGet()` */
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
  apiMetadataAddressIdGet$Response(params: ApiMetadataAddressIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<AddressRetrieveResponse>>> {
    return apiMetadataAddressIdGet(this.http, this.rootUrl, params, context);
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
  apiMetadataAddressIdGet(params: ApiMetadataAddressIdGet$Params, context?: HttpContext): Observable<Array<AddressRetrieveResponse>> {
    return this.apiMetadataAddressIdGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<AddressRetrieveResponse>>): Array<AddressRetrieveResponse> => r.body)
    );
  }

}
