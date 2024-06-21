/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ApplicationPaymentListResponse } from '../../models/application-payment-list-response';

export interface ApiOrgsOrgIdApplicationsPaymentsGet$Params {
  orgId: string;
  filters?: string;
  sorts?: string;
  page?: number;
  pageSize?: number;
}

export function apiOrgsOrgIdApplicationsPaymentsGet(http: HttpClient, rootUrl: string, params: ApiOrgsOrgIdApplicationsPaymentsGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ApplicationPaymentListResponse>> {
  const rb = new RequestBuilder(rootUrl, apiOrgsOrgIdApplicationsPaymentsGet.PATH, 'get');
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
      return r as StrictHttpResponse<ApplicationPaymentListResponse>;
    })
  );
}

apiOrgsOrgIdApplicationsPaymentsGet.PATH = '/api/orgs/{orgId}/applications/payments';
