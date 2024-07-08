/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { BizUserLoginResponse } from '../../models/biz-user-login-response';

export interface ApiBizLoginGet$Params {
  bizId?: string;
}

export function apiBizLoginGet(http: HttpClient, rootUrl: string, params?: ApiBizLoginGet$Params, context?: HttpContext): Observable<StrictHttpResponse<BizUserLoginResponse>> {
  const rb = new RequestBuilder(rootUrl, apiBizLoginGet.PATH, 'get');
  if (params) {
    rb.query('bizId', params.bizId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<BizUserLoginResponse>;
    })
  );
}

apiBizLoginGet.PATH = '/api/biz/login';
