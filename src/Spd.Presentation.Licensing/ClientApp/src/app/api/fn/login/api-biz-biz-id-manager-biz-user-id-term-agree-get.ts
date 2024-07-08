/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ActionResult } from '../../models/action-result';

export interface ApiBizBizIdManagerBizUserIdTermAgreeGet$Params {
  bizId: string;
  bizUserId: string;
}

export function apiBizBizIdManagerBizUserIdTermAgreeGet(http: HttpClient, rootUrl: string, params: ApiBizBizIdManagerBizUserIdTermAgreeGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ActionResult>> {
  const rb = new RequestBuilder(rootUrl, apiBizBizIdManagerBizUserIdTermAgreeGet.PATH, 'get');
  if (params) {
    rb.path('bizId', params.bizId, {});
    rb.path('bizUserId', params.bizUserId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<ActionResult>;
    })
  );
}

apiBizBizIdManagerBizUserIdTermAgreeGet.PATH = '/api/biz/{bizId}/manager/{bizUserId}/term-agree';
