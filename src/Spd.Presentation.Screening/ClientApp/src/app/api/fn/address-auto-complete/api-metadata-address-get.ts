/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { AddressFindResponse } from '../../models/address-find-response';

export interface ApiMetadataAddressGet$Params {
  search: string;

/**
 * optional, The ISO 2 or 3 character code for the country to search in. Default would be CAN
 */
  country?: string;

/**
 * optional, The Id from a previous Find
 */
  lastId?: string;
}

export function apiMetadataAddressGet(http: HttpClient, rootUrl: string, params: ApiMetadataAddressGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<AddressFindResponse>>> {
  const rb = new RequestBuilder(rootUrl, apiMetadataAddressGet.PATH, 'get');
  if (params) {
    rb.query('search', params.search, {});
    rb.query('country', params.country, {});
    rb.query('lastId', params.lastId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<AddressFindResponse>>;
    })
  );
}

apiMetadataAddressGet.PATH = '/api/metadata/address';
