/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ClearanceAccessListResponse } from '../../models/clearance-access-list-response';

export interface ApiOrgsOrgIdClearancesExpiredGet$Params {
  orgId: string;
  filters?: string;
  sorts?: string;
  page?: number;
  pageSize?: number;
}

export function apiOrgsOrgIdClearancesExpiredGet(http: HttpClient, rootUrl: string, params: ApiOrgsOrgIdClearancesExpiredGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ClearanceAccessListResponse>> {
  const rb = new RequestBuilder(rootUrl, apiOrgsOrgIdClearancesExpiredGet.PATH, 'get');
  if (params) {
    rb.path('orgId', params.orgId, {});
    rb.query('filters', params.filters, {});
    rb.query('sorts', params.sorts, {});
    rb.query('page', params.page, {});
    rb.query('pageSize', params.pageSize, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<ClearanceAccessListResponse>;
    })
  );
}

apiOrgsOrgIdClearancesExpiredGet.PATH = '/api/orgs/{orgId}/clearances/expired';
