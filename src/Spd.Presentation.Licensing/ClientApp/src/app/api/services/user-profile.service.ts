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
import { OrgUserProfileResponse } from '../models/org-user-profile-response';

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
   * Security Worker whoami, for security worker portal
   * return 204 No Content when there is no contact found with this BCSC.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiSecurityWorkerWhoamiGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiSecurityWorkerWhoamiGet$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ApplicantProfileResponse>> {

    const rb = new RequestBuilder(this.rootUrl, UserProfileService.ApiSecurityWorkerWhoamiGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ApplicantProfileResponse>;
      })
    );
  }

  /**
   * Security Worker whoami, for security worker portal
   * return 204 No Content when there is no contact found with this BCSC.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiSecurityWorkerWhoamiGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiSecurityWorkerWhoamiGet(params?: {
  },
  context?: HttpContext

): Observable<ApplicantProfileResponse> {

    return this.apiSecurityWorkerWhoamiGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<ApplicantProfileResponse>) => r.body as ApplicantProfileResponse)
    );
  }

  /**
   * Path part for operation apiSecurityWorkerLoginGet
   */
  static readonly ApiSecurityWorkerLoginGetPath = '/api/security-worker/login';

  /**
   * Security Worker whoami, for security worker portal
   * return 204 No Content when there is no contact found with this BCSC.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiSecurityWorkerLoginGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiSecurityWorkerLoginGet$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ApplicantProfileResponse>> {

    const rb = new RequestBuilder(this.rootUrl, UserProfileService.ApiSecurityWorkerLoginGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ApplicantProfileResponse>;
      })
    );
  }

  /**
   * Security Worker whoami, for security worker portal
   * return 204 No Content when there is no contact found with this BCSC.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiSecurityWorkerLoginGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiSecurityWorkerLoginGet(params?: {
  },
  context?: HttpContext

): Observable<ApplicantProfileResponse> {

    return this.apiSecurityWorkerLoginGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<ApplicantProfileResponse>) => r.body as ApplicantProfileResponse)
    );
  }

  /**
   * Path part for operation apiBizLicenceWhoamiGet
   */
  static readonly ApiBizLicenceWhoamiGetPath = '/api/biz-licence/whoami';

  /**
   * Biz bceid login, for biz licence.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBizLicenceWhoamiGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBizLicenceWhoamiGet$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<OrgUserProfileResponse>> {

    const rb = new RequestBuilder(this.rootUrl, UserProfileService.ApiBizLicenceWhoamiGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<OrgUserProfileResponse>;
      })
    );
  }

  /**
   * Biz bceid login, for biz licence.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBizLicenceWhoamiGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBizLicenceWhoamiGet(params?: {
  },
  context?: HttpContext

): Observable<OrgUserProfileResponse> {

    return this.apiBizLicenceWhoamiGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<OrgUserProfileResponse>) => r.body as OrgUserProfileResponse)
    );
  }

}
