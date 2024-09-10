/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { BizMemberResponse } from '../../models/biz-member-response';
import { SwlContactInfo } from '../../models/swl-contact-info';

export interface ApiBusinessBizIdSwlControllingMembersPost$Params {
  bizId: string;
      body?: SwlContactInfo
}

export function apiBusinessBizIdSwlControllingMembersPost(http: HttpClient, rootUrl: string, params: ApiBusinessBizIdSwlControllingMembersPost$Params, context?: HttpContext): Observable<StrictHttpResponse<BizMemberResponse>> {
  const rb = new RequestBuilder(rootUrl, apiBusinessBizIdSwlControllingMembersPost.PATH, 'post');
  if (params) {
    rb.path('bizId', params.bizId, {});
    rb.body(params.body, 'application/*+json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<BizMemberResponse>;
    })
  );
}

apiBusinessBizIdSwlControllingMembersPost.PATH = '/api/business/{bizId}/swl-controlling-members';
