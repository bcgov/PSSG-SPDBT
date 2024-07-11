/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { OrgUserResponse } from '../../models/org-user-response';
import { OrgUserUpdateRequest } from '../../models/org-user-update-request';

export interface ApiOrgsOrgIdUsersUserIdPut$Params {
  userId: string;
  orgId: string;
      body?: OrgUserUpdateRequest
}

export function apiOrgsOrgIdUsersUserIdPut(http: HttpClient, rootUrl: string, params: ApiOrgsOrgIdUsersUserIdPut$Params, context?: HttpContext): Observable<StrictHttpResponse<OrgUserResponse>> {
  const rb = new RequestBuilder(rootUrl, apiOrgsOrgIdUsersUserIdPut.PATH, 'put');
  if (params) {
    rb.path('userId', params.userId, {});
    rb.path('orgId', params.orgId, {});
    rb.body(params.body, 'application/*+json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<OrgUserResponse>;
    })
  );
}

apiOrgsOrgIdUsersUserIdPut.PATH = '/api/orgs/{orgId}/users/{userId}';
