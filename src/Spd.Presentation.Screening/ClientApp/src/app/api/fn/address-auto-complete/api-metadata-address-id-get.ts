/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { AddressRetrieveResponse } from '../../models/address-retrieve-response';

export interface ApiMetadataAddressIdGet$Params {

/**
 * the id from find items, like CAN|1520704
 */
  id: string;
}

export function apiMetadataAddressIdGet(http: HttpClient, rootUrl: string, params: ApiMetadataAddressIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<AddressRetrieveResponse>>> {
  const rb = new RequestBuilder(rootUrl, apiMetadataAddressIdGet.PATH, 'get');
  if (params) {
    rb.path('id', params.id, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<AddressRetrieveResponse>>;
    })
  );
}

apiMetadataAddressIdGet.PATH = '/api/metadata/address/{id}';
