/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { NonSwlContactInfo } from '../../models/non-swl-contact-info';

export interface ApiBusinessBizIdNonSwlControllingMembersBizContactIdGet$Params {
  bizContactId: string;
  bizId: string;
}

export function apiBusinessBizIdNonSwlControllingMembersBizContactIdGet(http: HttpClient, rootUrl: string, params: ApiBusinessBizIdNonSwlControllingMembersBizContactIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<NonSwlContactInfo>> {
  const rb = new RequestBuilder(rootUrl, apiBusinessBizIdNonSwlControllingMembersBizContactIdGet.PATH, 'get');
  if (params) {
    rb.path('bizContactId', params.bizContactId, {});
    rb.path('bizId', params.bizId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<NonSwlContactInfo>;
    })
  );
}

apiBusinessBizIdNonSwlControllingMembersBizContactIdGet.PATH = '/api/business/{bizId}/non-swl-controlling-members/{bizContactId}';
