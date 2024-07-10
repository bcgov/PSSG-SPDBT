/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { OrgUserResponse } from '../../models/org-user-response';

export interface ApiOrgsAddBceidPrimaryUsersOrgIdGet$Params {
  orgId: string;
}

export function apiOrgsAddBceidPrimaryUsersOrgIdGet(http: HttpClient, rootUrl: string, params: ApiOrgsAddBceidPrimaryUsersOrgIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<OrgUserResponse>> {
  const rb = new RequestBuilder(rootUrl, apiOrgsAddBceidPrimaryUsersOrgIdGet.PATH, 'get');
  if (params) {
    rb.path('orgId', params.orgId, {});
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

apiOrgsAddBceidPrimaryUsersOrgIdGet.PATH = '/api/orgs/add-bceid-primary-users/{orgId}';
