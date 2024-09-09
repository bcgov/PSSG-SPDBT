/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { Members } from '../../models/members';

export interface ApiBusinessBizIdMembersGet$Params {
  bizId: string;
}

export function apiBusinessBizIdMembersGet(http: HttpClient, rootUrl: string, params: ApiBusinessBizIdMembersGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Members>> {
  const rb = new RequestBuilder(rootUrl, apiBusinessBizIdMembersGet.PATH, 'get');
  if (params) {
    rb.path('bizId', params.bizId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Members>;
    })
  );
}

apiBusinessBizIdMembersGet.PATH = '/api/business/{bizId}/members';
