/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { BizPortalUserCreateRequest } from '../../models/biz-portal-user-create-request';
import { BizPortalUserResponse } from '../../models/biz-portal-user-response';

export interface ApiBusinessBizIdPortalUsersPost$Params {
  bizId: string;
      body: BizPortalUserCreateRequest
}

export function apiBusinessBizIdPortalUsersPost(http: HttpClient, rootUrl: string, params: ApiBusinessBizIdPortalUsersPost$Params, context?: HttpContext): Observable<StrictHttpResponse<BizPortalUserResponse>> {
  const rb = new RequestBuilder(rootUrl, apiBusinessBizIdPortalUsersPost.PATH, 'post');
  if (params) {
    rb.path('bizId', params.bizId, {});
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

apiBusinessBizIdPortalUsersPost.PATH = '/api/business/{bizId}/portal-users';
