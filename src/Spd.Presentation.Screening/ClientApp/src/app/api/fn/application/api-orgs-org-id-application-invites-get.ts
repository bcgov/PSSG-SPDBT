/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ApplicationInviteListResponse } from '../../models/application-invite-list-response';

export interface ApiOrgsOrgIdApplicationInvitesGet$Params {
  orgId: string;
  filters?: string;
  page?: number;
  pageSize?: number;
}

export function apiOrgsOrgIdApplicationInvitesGet(http: HttpClient, rootUrl: string, params: ApiOrgsOrgIdApplicationInvitesGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ApplicationInviteListResponse>> {
  const rb = new RequestBuilder(rootUrl, apiOrgsOrgIdApplicationInvitesGet.PATH, 'get');
  if (params) {
    rb.path('orgId', params.orgId, {});
    rb.query('filters', params.filters, {});
    rb.query('page', params.page, {});
    rb.query('pageSize', params.pageSize, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<ApplicationInviteListResponse>;
    })
  );
}

apiOrgsOrgIdApplicationInvitesGet.PATH = '/api/orgs/{orgId}/application-invites';
