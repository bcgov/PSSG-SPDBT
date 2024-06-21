/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ActionResult } from '../../models/action-result';

export interface ApiOrgsOrgIdUsersUserIdDelete$Params {
  userId: string;
  orgId: string;
}

export function apiOrgsOrgIdUsersUserIdDelete(http: HttpClient, rootUrl: string, params: ApiOrgsOrgIdUsersUserIdDelete$Params, context?: HttpContext): Observable<StrictHttpResponse<ActionResult>> {
  const rb = new RequestBuilder(rootUrl, apiOrgsOrgIdUsersUserIdDelete.PATH, 'delete');
  if (params) {
    rb.path('userId', params.userId, {});
    rb.path('orgId', params.orgId, {});
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

apiOrgsOrgIdUsersUserIdDelete.PATH = '/api/orgs/{orgId}/users/{userId}';
