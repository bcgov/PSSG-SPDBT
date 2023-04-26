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

import { ApplicationCreateRequest } from '../models/application-create-request';
import { ApplicationCreateResponse } from '../models/application-create-response';
import { ApplicationInvitesCreateRequest } from '../models/application-invites-create-request';
import { ApplicationInvitesCreateResponse } from '../models/application-invites-create-response';
import { ApplicationListResponse } from '../models/application-list-response';

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
   * create more than one application invites. if checkDuplicate is true, the implementation will check if there is existing duplicated applicants or invites.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdApplicationInvitesPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgsOrgIdApplicationInvitesPost$Response(params: {
    orgId: string;
    context?: HttpContext
    body: ApplicationInvitesCreateRequest
  }
): Observable<StrictHttpResponse<ApplicationInvitesCreateResponse>> {

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
        return r as StrictHttpResponse<ApplicationInvitesCreateResponse>;
      })
    );
  }

  /**
   * create more than one application invites. if checkDuplicate is true, the implementation will check if there is existing duplicated applicants or invites.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdApplicationInvitesPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgsOrgIdApplicationInvitesPost(params: {
    orgId: string;
    context?: HttpContext
    body: ApplicationInvitesCreateRequest
  }
): Observable<ApplicationInvitesCreateResponse> {

    return this.apiOrgsOrgIdApplicationInvitesPost$Response(params).pipe(
      map((r: StrictHttpResponse<ApplicationInvitesCreateResponse>) => r.body as ApplicationInvitesCreateResponse)
    );
  }

  /**
   * Path part for operation apiOrgsOrgIdApplicationPost
   */
  static readonly ApiOrgsOrgIdApplicationPostPath = '/api/orgs/{orgId}/application';

  /**
   * create application. if checkDuplicate is true, it will check if there is existing duplicated applications.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdApplicationPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgsOrgIdApplicationPost$Response(params: {

    /**
     * organizationId
     */
    orgId: string;
    context?: HttpContext
    body: ApplicationCreateRequest
  }
): Observable<StrictHttpResponse<ApplicationCreateResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicationService.ApiOrgsOrgIdApplicationPostPath, 'post');
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
        return r as StrictHttpResponse<ApplicationCreateResponse>;
      })
    );
  }

  /**
   * create application. if checkDuplicate is true, it will check if there is existing duplicated applications.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdApplicationPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgsOrgIdApplicationPost(params: {

    /**
     * organizationId
     */
    orgId: string;
    context?: HttpContext
    body: ApplicationCreateRequest
  }
): Observable<ApplicationCreateResponse> {

    return this.apiOrgsOrgIdApplicationPost$Response(params).pipe(
      map((r: StrictHttpResponse<ApplicationCreateResponse>) => r.body as ApplicationCreateResponse)
    );
  }

  /**
   * Path part for operation apiOrgsOrgIdApplicationsGet
   */
  static readonly ApiOrgsOrgIdApplicationsGetPath = '/api/orgs/{orgId}/applications';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdApplicationsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdApplicationsGet$Response(params: {
    orgId: string;
    filters?: string;
    sorts?: string;
    page?: number;
    pageSize?: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<ApplicationListResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicationService.ApiOrgsOrgIdApplicationsGetPath, 'get');
    if (params) {
      rb.path('orgId', params.orgId, {});
      rb.query('filters', params.filters, {});
      rb.query('sorts', params.sorts, {});
      rb.query('page', params.page, {});
      rb.query('pageSize', params.pageSize, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ApplicationListResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdApplicationsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdApplicationsGet(params: {
    orgId: string;
    filters?: string;
    sorts?: string;
    page?: number;
    pageSize?: number;
    context?: HttpContext
  }
): Observable<ApplicationListResponse> {

    return this.apiOrgsOrgIdApplicationsGet$Response(params).pipe(
      map((r: StrictHttpResponse<ApplicationListResponse>) => r.body as ApplicationListResponse)
    );
  }

}
