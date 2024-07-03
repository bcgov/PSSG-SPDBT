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

import { LicenceAppListResponse } from '../models/licence-app-list-response';

@Injectable({
  providedIn: 'root',
})
export class LicenceAppService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation apiApplicantsApplicantIdLicenceApplicationsGet
   */
  static readonly ApiApplicantsApplicantIdLicenceApplicationsGetPath = '/api/applicants/{applicantId}/licence-applications';

  /**
   * Get List of draft or InProgress Security Worker Licence Application or Permit Application.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiApplicantsApplicantIdLicenceApplicationsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsApplicantIdLicenceApplicationsGet$Response(params: {
    applicantId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Array<LicenceAppListResponse>>> {

    const rb = new RequestBuilder(this.rootUrl, LicenceAppService.ApiApplicantsApplicantIdLicenceApplicationsGetPath, 'get');
    if (params) {
      rb.path('applicantId', params.applicantId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<LicenceAppListResponse>>;
      })
    );
  }

  /**
   * Get List of draft or InProgress Security Worker Licence Application or Permit Application.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiApplicantsApplicantIdLicenceApplicationsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsApplicantIdLicenceApplicationsGet(params: {
    applicantId: string;
  },
  context?: HttpContext

): Observable<Array<LicenceAppListResponse>> {

    return this.apiApplicantsApplicantIdLicenceApplicationsGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<Array<LicenceAppListResponse>>) => r.body as Array<LicenceAppListResponse>)
    );
  }

  /**
   * Path part for operation apiBizsBizIdLicenceApplicationsGet
   */
  static readonly ApiBizsBizIdLicenceApplicationsGetPath = '/api/bizs/{bizId}/licence-applications';

  /**
   * Get List of draft or InProgress Security Business Licence Application.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBizsBizIdLicenceApplicationsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBizsBizIdLicenceApplicationsGet$Response(params: {
    bizId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Array<LicenceAppListResponse>>> {

    const rb = new RequestBuilder(this.rootUrl, LicenceAppService.ApiBizsBizIdLicenceApplicationsGetPath, 'get');
    if (params) {
      rb.path('bizId', params.bizId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<LicenceAppListResponse>>;
      })
    );
  }

  /**
   * Get List of draft or InProgress Security Business Licence Application.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBizsBizIdLicenceApplicationsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBizsBizIdLicenceApplicationsGet(params: {
    bizId: string;
  },
  context?: HttpContext

): Observable<Array<LicenceAppListResponse>> {

    return this.apiBizsBizIdLicenceApplicationsGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<Array<LicenceAppListResponse>>) => r.body as Array<LicenceAppListResponse>)
    );
  }

}
