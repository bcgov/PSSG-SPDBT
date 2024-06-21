/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { OrgUserListResponse } from '../../models/org-user-list-response';

export interface ApiOrgsOrgIdUsersGet$Params {
  orgId: string;
}

export function apiOrgsOrgIdUsersGet(http: HttpClient, rootUrl: string, params: ApiOrgsOrgIdUsersGet$Params, context?: HttpContext): Observable<StrictHttpResponse<OrgUserListResponse>> {
  const rb = new RequestBuilder(rootUrl, apiOrgsOrgIdUsersGet.PATH, 'get');
  if (params) {
    rb.path('orgId', params.orgId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<OrgUserListResponse>;
    })
  );
}

apiOrgsOrgIdUsersGet.PATH = '/api/orgs/{orgId}/users';
