/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpContext } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { OrgReportListResponse } from '../models/org-report-list-response';

@Injectable({
  providedIn: 'root',
})
export class OrgReportService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation apiOrgsOrgIdReportsGet
   */
  static readonly ApiOrgsOrgIdReportsGetPath = '/api/orgs/{orgId}/reports';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdReportsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdReportsGet$Response(params: {
    dateFilter?: string;
    orgId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<OrgReportListResponse>> {

    const rb = new RequestBuilder(this.rootUrl, OrgReportService.ApiOrgsOrgIdReportsGetPath, 'get');
    if (params) {
      rb.query('dateFilter', params.dateFilter, {});
      rb.path('orgId', params.orgId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<OrgReportListResponse>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdReportsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdReportsGet(params: {
    dateFilter?: string;
    orgId: string;
  },
  context?: HttpContext

): Observable<OrgReportListResponse> {

    return this.apiOrgsOrgIdReportsGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<OrgReportListResponse>) => r.body as OrgReportListResponse)
    );
  }

}
