/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { BizPortalUserListResponse } from '../../models/biz-portal-user-list-response';

export interface ApiBusinessBizIdPortalUsersGet$Params {
  bizId: string;
}

export function apiBusinessBizIdPortalUsersGet(http: HttpClient, rootUrl: string, params: ApiBusinessBizIdPortalUsersGet$Params, context?: HttpContext): Observable<StrictHttpResponse<BizPortalUserListResponse>> {
  const rb = new RequestBuilder(rootUrl, apiBusinessBizIdPortalUsersGet.PATH, 'get');
  if (params) {
    rb.path('bizId', params.bizId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<BizPortalUserListResponse>;
    })
  );
}

apiBusinessBizIdPortalUsersGet.PATH = '/api/business/{bizId}/portal-users';
