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
import { ApplicationInviteCreateResponse } from '../models/application-invite-create-response';
import { CheckApplicationInviteDuplicateResponse } from '../models/check-application-invite-duplicate-response';

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
): Observable<StrictHttpResponse<Array<ApplicationInviteCreateResponse>>> {

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
        return r as StrictHttpResponse<Array<ApplicationInviteCreateResponse>>;
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
): Observable<Array<ApplicationInviteCreateResponse>> {

    return this.apiOrgsOrgIdApplicationInvitesPost$Response(params).pipe(
      map((r: StrictHttpResponse<Array<ApplicationInviteCreateResponse>>) => r.body as Array<ApplicationInviteCreateResponse>)
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

}
