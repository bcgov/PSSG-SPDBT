/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ApplicationListResponse } from '../../models/application-list-response';

export interface ApiOrgsOrgIdApplicationsGet$Params {
  orgId: string;
  filters?: string;
  sorts?: string;
  page?: number;
  pageSize?: number;
  showAllPSSOApps?: boolean;
}

export function apiOrgsOrgIdApplicationsGet(http: HttpClient, rootUrl: string, params: ApiOrgsOrgIdApplicationsGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ApplicationListResponse>> {
  const rb = new RequestBuilder(rootUrl, apiOrgsOrgIdApplicationsGet.PATH, 'get');
  if (params) {
    rb.path('orgId', params.orgId, {});
    rb.query('filters', params.filters, {});
    rb.query('sorts', params.sorts, {});
    rb.query('page', params.page, {});
    rb.query('pageSize', params.pageSize, {});
    rb.query('showAllPSSOApps', params.showAllPSSOApps, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<ApplicationListResponse>;
    })
  );
}

apiOrgsOrgIdApplicationsGet.PATH = '/api/orgs/{orgId}/applications';
