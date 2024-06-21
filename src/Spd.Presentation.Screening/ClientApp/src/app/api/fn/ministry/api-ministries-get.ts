/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { MinistryResponse } from '../../models/ministry-response';

export interface ApiMinistriesGet$Params {
}

export function apiMinistriesGet(http: HttpClient, rootUrl: string, params?: ApiMinistriesGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<MinistryResponse>>> {
  const rb = new RequestBuilder(rootUrl, apiMinistriesGet.PATH, 'get');
  if (params) {
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<MinistryResponse>>;
    })
  );
}

apiMinistriesGet.PATH = '/api/ministries';
