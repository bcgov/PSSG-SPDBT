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

import { ApplicationInviteCreateRequest } from '../models/application-invite-create-request';
import { ApplicationSubmissionCreateRequest } from '../models/application-submission-create-request';
import { CheckApplicationInviteDuplicateResponse } from '../models/check-application-invite-duplicate-response';
import { CheckApplicationSubmissionDuplicateResponse } from '../models/check-application-submission-duplicate-response';
import { Unit } from '../models/unit';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation apiOrgsOrgIdApplicationInvitesPost
   */
  static readonly ApiOrgsOrgIdApplicationInvitesPostPath = '/api/orgs/{orgId}/application-invites';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdApplicationInvitesPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgsOrgIdApplicationInvitesPost$Response(params: {
    orgId: string;
    context?: HttpContext
    body: Array<ApplicationInviteCreateRequest>
  }
): Observable<StrictHttpResponse<Unit>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicationService.ApiOrgsOrgIdApplicationInvitesPostPath, 'post');
    if (params) {
      rb.path('orgId', params.orgId, {});
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Unit>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdApplicationInvitesPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgsOrgIdApplicationInvitesPost(params: {
    orgId: string;
    context?: HttpContext
    body: Array<ApplicationInviteCreateRequest>
  }
): Observable<Unit> {

    return this.apiOrgsOrgIdApplicationInvitesPost$Response(params).pipe(
      map((r: StrictHttpResponse<Unit>) => r.body as Unit)
    );
  }

  /**
   * Path part for operation apiOrgsOrgIdDetectInviteDuplicatesPost
   */
  static readonly ApiOrgsOrgIdDetectInviteDuplicatesPostPath = '/api/orgs/{orgId}/detect-invite-duplicates';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdDetectInviteDuplicatesPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgsOrgIdDetectInviteDuplicatesPost$Response(params: {
    orgId: string;
    context?: HttpContext
    body: Array<ApplicationInviteCreateRequest>
  }
): Observable<StrictHttpResponse<Array<CheckApplicationInviteDuplicateResponse>>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicationService.ApiOrgsOrgIdDetectInviteDuplicatesPostPath, 'post');
    if (params) {
      rb.path('orgId', params.orgId, {});
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<CheckApplicationInviteDuplicateResponse>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdDetectInviteDuplicatesPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgsOrgIdDetectInviteDuplicatesPost(params: {
    orgId: string;
    context?: HttpContext
    body: Array<ApplicationInviteCreateRequest>
  }
): Observable<Array<CheckApplicationInviteDuplicateResponse>> {

    return this.apiOrgsOrgIdDetectInviteDuplicatesPost$Response(params).pipe(
      map((r: StrictHttpResponse<Array<CheckApplicationInviteDuplicateResponse>>) => r.body as Array<CheckApplicationInviteDuplicateResponse>)
    );
  }

  /**
   * Path part for operation apiOrgsOrgIdApplicationSubmissionPost
   */
  static readonly ApiOrgsOrgIdApplicationSubmissionPostPath = '/api/orgs/{orgId}/application-submission';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdApplicationSubmissionPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgsOrgIdApplicationSubmissionPost$Response(params: {
    orgId: string;
    context?: HttpContext
    body: ApplicationSubmissionCreateRequest
  }
): Observable<StrictHttpResponse<Unit>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicationService.ApiOrgsOrgIdApplicationSubmissionPostPath, 'post');
    if (params) {
      rb.path('orgId', params.orgId, {});
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Unit>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdApplicationSubmissionPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgsOrgIdApplicationSubmissionPost(params: {
    orgId: string;
    context?: HttpContext
    body: ApplicationSubmissionCreateRequest
  }
): Observable<Unit> {

    return this.apiOrgsOrgIdApplicationSubmissionPost$Response(params).pipe(
      map((r: StrictHttpResponse<Unit>) => r.body as Unit)
    );
  }

  /**
   * Path part for operation apiOrgsOrgIdDetectApplicationDuplicatePost
   */
  static readonly ApiOrgsOrgIdDetectApplicationDuplicatePostPath = '/api/orgs/{orgId}/detect-application-duplicate';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdDetectApplicationDuplicatePost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgsOrgIdDetectApplicationDuplicatePost$Response(params: {
    orgId: string;
    context?: HttpContext
    body: ApplicationSubmissionCreateRequest
  }
): Observable<StrictHttpResponse<CheckApplicationSubmissionDuplicateResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicationService.ApiOrgsOrgIdDetectApplicationDuplicatePostPath, 'post');
    if (params) {
      rb.path('orgId', params.orgId, {});
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<CheckApplicationSubmissionDuplicateResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdDetectApplicationDuplicatePost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgsOrgIdDetectApplicationDuplicatePost(params: {
    orgId: string;
    context?: HttpContext
    body: ApplicationSubmissionCreateRequest
  }
): Observable<CheckApplicationSubmissionDuplicateResponse> {

    return this.apiOrgsOrgIdDetectApplicationDuplicatePost$Response(params).pipe(
      map((r: StrictHttpResponse<CheckApplicationSubmissionDuplicateResponse>) => r.body as CheckApplicationSubmissionDuplicateResponse)
    );
  }

}
