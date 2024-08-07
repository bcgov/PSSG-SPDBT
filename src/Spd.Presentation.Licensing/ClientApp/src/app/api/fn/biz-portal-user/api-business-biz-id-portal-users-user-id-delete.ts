/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ActionResult } from '../../models/action-result';

export interface ApiBusinessBizIdPortalUsersUserIdDelete$Params {
  userId: string;
  bizId: string;
}

export function apiBusinessBizIdPortalUsersUserIdDelete(http: HttpClient, rootUrl: string, params: ApiBusinessBizIdPortalUsersUserIdDelete$Params, context?: HttpContext): Observable<StrictHttpResponse<ActionResult>> {
  const rb = new RequestBuilder(rootUrl, apiBusinessBizIdPortalUsersUserIdDelete.PATH, 'delete');
  if (params) {
    rb.path('userId', params.userId, {});
    rb.path('bizId', params.bizId, {});
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

apiBusinessBizIdPortalUsersUserIdDelete.PATH = '/api/business/{bizId}/portal-users/{userId}';
