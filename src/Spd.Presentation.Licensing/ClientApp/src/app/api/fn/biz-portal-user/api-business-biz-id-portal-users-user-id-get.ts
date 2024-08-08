/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { BizPortalUserResponse } from '../../models/biz-portal-user-response';

export interface ApiBusinessBizIdPortalUsersUserIdGet$Params {
  bizId: string;
  userId: string;
}

export function apiBusinessBizIdPortalUsersUserIdGet(http: HttpClient, rootUrl: string, params: ApiBusinessBizIdPortalUsersUserIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<BizPortalUserResponse>> {
  const rb = new RequestBuilder(rootUrl, apiBusinessBizIdPortalUsersUserIdGet.PATH, 'get');
  if (params) {
    rb.path('bizId', params.bizId, {});
    rb.path('userId', params.userId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<BizPortalUserResponse>;
    })
  );
}

apiBusinessBizIdPortalUsersUserIdGet.PATH = '/api/business/{bizId}/portal-users/{userId}';
