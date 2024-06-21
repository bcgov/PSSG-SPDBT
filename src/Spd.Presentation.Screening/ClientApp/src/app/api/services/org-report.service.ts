/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { apiOrgsOrgIdReportsGet } from '../fn/org-report/api-orgs-org-id-reports-get';
import { ApiOrgsOrgIdReportsGet$Params } from '../fn/org-report/api-orgs-org-id-reports-get';
import { apiOrgsOrgIdReportsReportIdFileGet } from '../fn/org-report/api-orgs-org-id-reports-report-id-file-get';
import { ApiOrgsOrgIdReportsReportIdFileGet$Params } from '../fn/org-report/api-orgs-org-id-reports-report-id-file-get';
import { OrgReportListResponse } from '../models/org-report-list-response';

@Injectable({ providedIn: 'root' })
export class OrgReportService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `apiOrgsOrgIdReportsGet()` */
  static readonly ApiOrgsOrgIdReportsGetPath = '/api/orgs/{orgId}/reports';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdReportsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdReportsGet$Response(params: ApiOrgsOrgIdReportsGet$Params, context?: HttpContext): Observable<StrictHttpResponse<OrgReportListResponse>> {
    return apiOrgsOrgIdReportsGet(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdReportsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdReportsGet(params: ApiOrgsOrgIdReportsGet$Params, context?: HttpContext): Observable<OrgReportListResponse> {
    return this.apiOrgsOrgIdReportsGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<OrgReportListResponse>): OrgReportListResponse => r.body)
    );
  }

  /** Path part for operation `apiOrgsOrgIdReportsReportIdFileGet()` */
  static readonly ApiOrgsOrgIdReportsReportIdFileGetPath = '/api/orgs/{orgId}/reports/{reportId}/file';

  /**
   * download the report.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdReportsReportIdFileGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdReportsReportIdFileGet$Response(params: ApiOrgsOrgIdReportsReportIdFileGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Blob>> {
    return apiOrgsOrgIdReportsReportIdFileGet(this.http, this.rootUrl, params, context);
  }

  /**
   * download the report.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdReportsReportIdFileGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdReportsReportIdFileGet(params: ApiOrgsOrgIdReportsReportIdFileGet$Params, context?: HttpContext): Observable<Blob> {
    return this.apiOrgsOrgIdReportsReportIdFileGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Blob>): Blob => r.body)
    );
  }

}
