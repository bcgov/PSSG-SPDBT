/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { BizMemberResponse } from '../../models/biz-member-response';
import { NonSwlContactInfo } from '../../models/non-swl-contact-info';

export interface ApiBusinessBizIdNonSwlControllingMembersBizContactIdPut$Params {
  bizId: string;
  bizContactId: string;
      body?: NonSwlContactInfo
}

export function apiBusinessBizIdNonSwlControllingMembersBizContactIdPut(http: HttpClient, rootUrl: string, params: ApiBusinessBizIdNonSwlControllingMembersBizContactIdPut$Params, context?: HttpContext): Observable<StrictHttpResponse<BizMemberResponse>> {
  const rb = new RequestBuilder(rootUrl, apiBusinessBizIdNonSwlControllingMembersBizContactIdPut.PATH, 'put');
  if (params) {
    rb.path('bizId', params.bizId, {});
    rb.path('bizContactId', params.bizContactId, {});
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

apiBusinessBizIdNonSwlControllingMembersBizContactIdPut.PATH = '/api/business/{bizId}/non-swl-controlling-members/{bizContactId}';
