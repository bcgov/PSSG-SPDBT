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

import { AnonymousApplicantAppCreateRequest } from '../models/anonymous-applicant-app-create-request';
import { AppInviteVerifyRequest } from '../models/app-invite-verify-request';
import { AppOrgResponse } from '../models/app-org-response';
import { ApplicantAppCreateRequest } from '../models/applicant-app-create-request';
import { ApplicantUserInfo } from '../models/applicant-user-info';
import { ApplicationCreateResponse } from '../models/application-create-response';

@Injectable({
  providedIn: 'root',
})
export class ApplicantService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation apiApplicantsInvitesPost
   */
  static readonly ApiApplicantsInvitesPostPath = '/api/applicants/invites';

  /**
   * Verify if the current application invite is correct, and return needed info.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiApplicantsInvitesPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiApplicantsInvitesPost$Response(params: {

    /**
     * which include InviteEncryptedCode
     */
    body: AppInviteVerifyRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<AppOrgResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicantService.ApiApplicantsInvitesPostPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<AppOrgResponse>;
      })
    );
  }

  /**
   * Verify if the current application invite is correct, and return needed info.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiApplicantsInvitesPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiApplicantsInvitesPost(params: {

    /**
     * which include InviteEncryptedCode
     */
    body: AppInviteVerifyRequest
  },
  context?: HttpContext

): Observable<AppOrgResponse> {

    return this.apiApplicantsInvitesPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<AppOrgResponse>) => r.body as AppOrgResponse)
    );
  }

  /**
   * Path part for operation apiApplicantsScreeningsPost
   */
  static readonly ApiApplicantsScreeningsPostPath = '/api/applicants/screenings';

  /**
   * create application.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiApplicantsScreeningsPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiApplicantsScreeningsPost$Response(params?: {
    body?: ApplicantAppCreateRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ApplicationCreateResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicantService.ApiApplicantsScreeningsPostPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ApplicationCreateResponse>;
      })
    );
  }

  /**
   * create application.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiApplicantsScreeningsPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiApplicantsScreeningsPost(params?: {
    body?: ApplicantAppCreateRequest
  },
  context?: HttpContext

): Observable<ApplicationCreateResponse> {

    return this.apiApplicantsScreeningsPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<ApplicationCreateResponse>) => r.body as ApplicationCreateResponse)
    );
  }

  /**
   * Path part for operation apiApplicantsScreeningsAnonymousPost
   */
  static readonly ApiApplicantsScreeningsAnonymousPostPath = '/api/applicants/screenings/anonymous';

  /**
   * anonymous applicant create application.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiApplicantsScreeningsAnonymousPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiApplicantsScreeningsAnonymousPost$Response(params?: {
    body?: AnonymousApplicantAppCreateRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ApplicationCreateResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicantService.ApiApplicantsScreeningsAnonymousPostPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ApplicationCreateResponse>;
      })
    );
  }

  /**
   * anonymous applicant create application.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiApplicantsScreeningsAnonymousPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiApplicantsScreeningsAnonymousPost(params?: {
    body?: AnonymousApplicantAppCreateRequest
  },
  context?: HttpContext

): Observable<ApplicationCreateResponse> {

    return this.apiApplicantsScreeningsAnonymousPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<ApplicationCreateResponse>) => r.body as ApplicationCreateResponse)
    );
  }

  /**
   * Path part for operation apiApplicantsUserinfoGet
   */
  static readonly ApiApplicantsUserinfoGetPath = '/api/applicants/userinfo';

  /**
   * used for Applicants logs in with BCSC to submit an application.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiApplicantsUserinfoGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsUserinfoGet$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ApplicantUserInfo>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicantService.ApiApplicantsUserinfoGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ApplicantUserInfo>;
      })
    );
  }

  /**
   * used for Applicants logs in with BCSC to submit an application.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiApplicantsUserinfoGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsUserinfoGet(params?: {
  },
  context?: HttpContext

): Observable<ApplicantUserInfo> {

    return this.apiApplicantsUserinfoGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<ApplicantUserInfo>) => r.body as ApplicantUserInfo)
    );
  }

}
