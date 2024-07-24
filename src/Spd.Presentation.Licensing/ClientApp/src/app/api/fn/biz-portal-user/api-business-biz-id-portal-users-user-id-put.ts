/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { BizPortalUserResponse } from '../../models/biz-portal-user-response';
import { BizPortalUserUpdateRequest } from '../../models/biz-portal-user-update-request';

export interface ApiBusinessBizIdPortalUsersUserIdPut$Params {
  bizId: string;
  userId: string;
      body: BizPortalUserUpdateRequest
}

export function apiBusinessBizIdPortalUsersUserIdPut(http: HttpClient, rootUrl: string, params: ApiBusinessBizIdPortalUsersUserIdPut$Params, context?: HttpContext): Observable<StrictHttpResponse<BizPortalUserResponse>> {
  const rb = new RequestBuilder(rootUrl, apiBusinessBizIdPortalUsersUserIdPut.PATH, 'put');
  if (params) {
    rb.path('bizId', params.bizId, {});
    rb.path('userId', params.userId, {});
    rb.body(params.body, 'application/*+json');
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

apiBusinessBizIdPortalUsersUserIdPut.PATH = '/api/business/{bizId}/portal-users/{userId}';
