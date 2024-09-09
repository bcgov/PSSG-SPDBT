/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ActionResult } from '../../models/action-result';

export interface ApiBusinessBizIdMembersBizContactIdDelete$Params {
  bizId: string;
  bizContactId: string;
}

export function apiBusinessBizIdMembersBizContactIdDelete(http: HttpClient, rootUrl: string, params: ApiBusinessBizIdMembersBizContactIdDelete$Params, context?: HttpContext): Observable<StrictHttpResponse<ActionResult>> {
  const rb = new RequestBuilder(rootUrl, apiBusinessBizIdMembersBizContactIdDelete.PATH, 'delete');
  if (params) {
    rb.path('bizId', params.bizId, {});
    rb.path('bizContactId', params.bizContactId, {});
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

apiBusinessBizIdMembersBizContactIdDelete.PATH = '/api/business/{bizId}/members/{bizContactId}';
