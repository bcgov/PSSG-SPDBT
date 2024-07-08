/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { BizProfileUpdateRequest } from '../../models/biz-profile-update-request';

export interface ApiBizBizIdPut$Params {
  bizId: string;
      body?: BizProfileUpdateRequest
}

export function apiBizBizIdPut(http: HttpClient, rootUrl: string, params: ApiBizBizIdPut$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
  const rb = new RequestBuilder(rootUrl, apiBizBizIdPut.PATH, 'put');
  if (params) {
    rb.path('bizId', params.bizId, {});
    rb.body(params.body, 'application/*+json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<string>;
    })
  );
}

apiBizBizIdPut.PATH = '/api/biz/{bizId}';
