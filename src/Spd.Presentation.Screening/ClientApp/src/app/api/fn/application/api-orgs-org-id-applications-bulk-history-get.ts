/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { BulkHistoryListResponse } from '../../models/bulk-history-list-response';

export interface ApiOrgsOrgIdApplicationsBulkHistoryGet$Params {
  orgId: string;
  sorts?: string;
  page?: number;
  pageSize?: number;
}

export function apiOrgsOrgIdApplicationsBulkHistoryGet(http: HttpClient, rootUrl: string, params: ApiOrgsOrgIdApplicationsBulkHistoryGet$Params, context?: HttpContext): Observable<StrictHttpResponse<BulkHistoryListResponse>> {
  const rb = new RequestBuilder(rootUrl, apiOrgsOrgIdApplicationsBulkHistoryGet.PATH, 'get');
  if (params) {
    rb.path('orgId', params.orgId, {});
    rb.query('sorts', params.sorts, {});
    rb.query('page', params.page, {});
    rb.query('pageSize', params.pageSize, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<BulkHistoryListResponse>;
    })
  );
}

apiOrgsOrgIdApplicationsBulkHistoryGet.PATH = '/api/orgs/{orgId}/applications/bulk/history';
