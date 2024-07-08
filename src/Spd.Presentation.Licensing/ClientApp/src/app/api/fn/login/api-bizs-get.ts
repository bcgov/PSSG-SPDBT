/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { BizListResponse } from '../../models/biz-list-response';

export interface ApiBizsGet$Params {
}

export function apiBizsGet(http: HttpClient, rootUrl: string, params?: ApiBizsGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<BizListResponse>>> {
  const rb = new RequestBuilder(rootUrl, apiBizsGet.PATH, 'get');
  if (params) {
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<BizListResponse>>;
    })
  );
}

apiBizsGet.PATH = '/api/bizs';
