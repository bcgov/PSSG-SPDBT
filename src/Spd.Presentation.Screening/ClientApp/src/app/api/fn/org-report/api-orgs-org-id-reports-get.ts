/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { OrgReportListResponse } from '../../models/org-report-list-response';

export interface ApiOrgsOrgIdReportsGet$Params {
  orgId: string;
}

export function apiOrgsOrgIdReportsGet(http: HttpClient, rootUrl: string, params: ApiOrgsOrgIdReportsGet$Params, context?: HttpContext): Observable<StrictHttpResponse<OrgReportListResponse>> {
  const rb = new RequestBuilder(rootUrl, apiOrgsOrgIdReportsGet.PATH, 'get');
  if (params) {
    rb.path('orgId', params.orgId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<OrgReportListResponse>;
    })
  );
}

apiOrgsOrgIdReportsGet.PATH = '/api/orgs/{orgId}/reports';
