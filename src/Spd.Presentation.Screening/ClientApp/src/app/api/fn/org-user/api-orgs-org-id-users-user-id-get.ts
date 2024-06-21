/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { OrgUserResponse } from '../../models/org-user-response';

export interface ApiOrgsOrgIdUsersUserIdGet$Params {
  orgId: string;

/**
 * Guid of the user
 */
  userId: string;
}

export function apiOrgsOrgIdUsersUserIdGet(http: HttpClient, rootUrl: string, params: ApiOrgsOrgIdUsersUserIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<OrgUserResponse>> {
  const rb = new RequestBuilder(rootUrl, apiOrgsOrgIdUsersUserIdGet.PATH, 'get');
  if (params) {
    rb.path('orgId', params.orgId, {});
    rb.path('userId', params.userId, {});
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

apiOrgsOrgIdUsersUserIdGet.PATH = '/api/orgs/{orgId}/users/{userId}';
