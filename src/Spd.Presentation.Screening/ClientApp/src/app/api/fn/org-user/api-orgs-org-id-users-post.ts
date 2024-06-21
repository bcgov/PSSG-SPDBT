/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { OrgUserCreateRequest } from '../../models/org-user-create-request';
import { OrgUserResponse } from '../../models/org-user-response';

export interface ApiOrgsOrgIdUsersPost$Params {
  orgId: string;
      body: OrgUserCreateRequest
}

export function apiOrgsOrgIdUsersPost(http: HttpClient, rootUrl: string, params: ApiOrgsOrgIdUsersPost$Params, context?: HttpContext): Observable<StrictHttpResponse<OrgUserResponse>> {
  const rb = new RequestBuilder(rootUrl, apiOrgsOrgIdUsersPost.PATH, 'post');
  if (params) {
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

apiOrgsOrgIdUsersPost.PATH = '/api/orgs/{orgId}/users';
