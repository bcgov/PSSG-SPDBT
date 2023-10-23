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

import { ApplicantProfileResponse } from '../models/applicant-profile-response';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation apiSecurityWorkerWhoamiGet
   */
  static readonly ApiSecurityWorkerWhoamiGetPath = '/api/security-worker/whoami';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiSecurityWorkerWhoamiGet$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiSecurityWorkerWhoamiGet$Plain$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ApplicantProfileResponse>> {

    const rb = new RequestBuilder(this.rootUrl, UserProfileService.ApiSecurityWorkerWhoamiGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ApplicantProfileResponse>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiSecurityWorkerWhoamiGet$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiSecurityWorkerWhoamiGet$Plain(params?: {
  },
  context?: HttpContext

): Observable<ApplicantProfileResponse> {

    return this.apiSecurityWorkerWhoamiGet$Plain$Response(params,context).pipe(
      map((r: StrictHttpResponse<ApplicantProfileResponse>) => r.body as ApplicantProfileResponse)
    );
  }

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiSecurityWorkerWhoamiGet$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiSecurityWorkerWhoamiGet$Json$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ApplicantProfileResponse>> {

    const rb = new RequestBuilder(this.rootUrl, UserProfileService.ApiSecurityWorkerWhoamiGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ApplicantProfileResponse>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiSecurityWorkerWhoamiGet$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiSecurityWorkerWhoamiGet$Json(params?: {
  },
  context?: HttpContext

): Observable<ApplicantProfileResponse> {

    return this.apiSecurityWorkerWhoamiGet$Json$Response(params,context).pipe(
      map((r: StrictHttpResponse<ApplicantProfileResponse>) => r.body as ApplicantProfileResponse)
    );
  }

  /**
   * Path part for operation apiBizLicenceWhoamiGet
   */
  static readonly ApiBizLicenceWhoamiGetPath = '/api/biz-licence/whoami';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBizLicenceWhoamiGet$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBizLicenceWhoamiGet$Plain$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ApplicantProfileResponse>> {

    const rb = new RequestBuilder(this.rootUrl, UserProfileService.ApiBizLicenceWhoamiGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ApplicantProfileResponse>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBizLicenceWhoamiGet$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBizLicenceWhoamiGet$Plain(params?: {
  },
  context?: HttpContext

): Observable<ApplicantProfileResponse> {

    return this.apiBizLicenceWhoamiGet$Plain$Response(params,context).pipe(
      map((r: StrictHttpResponse<ApplicantProfileResponse>) => r.body as ApplicantProfileResponse)
    );
  }

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBizLicenceWhoamiGet$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBizLicenceWhoamiGet$Json$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ApplicantProfileResponse>> {

    const rb = new RequestBuilder(this.rootUrl, UserProfileService.ApiBizLicenceWhoamiGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ApplicantProfileResponse>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBizLicenceWhoamiGet$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBizLicenceWhoamiGet$Json(params?: {
  },
  context?: HttpContext

): Observable<ApplicantProfileResponse> {

    return this.apiBizLicenceWhoamiGet$Json$Response(params,context).pipe(
      map((r: StrictHttpResponse<ApplicantProfileResponse>) => r.body as ApplicantProfileResponse)
    );
  }

}
