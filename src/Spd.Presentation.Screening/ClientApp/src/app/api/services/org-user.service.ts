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

import { ActionResult } from '../models/action-result';
import { InvitationRequest } from '../models/invitation-request';
import { InvitationResponse } from '../models/invitation-response';
import { OrgUserCreateRequest } from '../models/org-user-create-request';
import { OrgUserListResponse } from '../models/org-user-list-response';
import { OrgUserResponse } from '../models/org-user-response';
import { OrgUserUpdateRequest } from '../models/org-user-update-request';

@Injectable({
  providedIn: 'root',
})
export class OrgUserService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation apiUserInvitationPost
   */
  static readonly ApiUserInvitationPostPath = '/api/user/invitation';

  /**
   * Verify if the current invite and login user are correct.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiUserInvitationPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiUserInvitationPost$Response(params: {

    /**
     * which include InviteHashCode
     */
    body: InvitationRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<InvitationResponse>> {

    const rb = new RequestBuilder(this.rootUrl, OrgUserService.ApiUserInvitationPostPath, 'post');
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
        return r as StrictHttpResponse<InvitationResponse>;
      })
    );
  }

  /**
   * Verify if the current invite and login user are correct.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiUserInvitationPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiUserInvitationPost(params: {

    /**
     * which include InviteHashCode
     */
    body: InvitationRequest
  },
  context?: HttpContext

): Observable<InvitationResponse> {

    return this.apiUserInvitationPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<InvitationResponse>) => r.body as InvitationResponse)
    );
  }

  /**
   * Path part for operation apiOrgsOrgIdUsersGet
   */
  static readonly ApiOrgsOrgIdUsersGetPath = '/api/orgs/{orgId}/users';

  /**
   * return active users belong to the organization.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdUsersGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdUsersGet$Response(params: {
    orgId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<OrgUserListResponse>> {

    const rb = new RequestBuilder(this.rootUrl, OrgUserService.ApiOrgsOrgIdUsersGetPath, 'get');
    if (params) {
      rb.path('orgId', params.orgId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<OrgUserListResponse>;
      })
    );
  }

  /**
   * return active users belong to the organization.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdUsersGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdUsersGet(params: {
    orgId: string;
  },
  context?: HttpContext

): Observable<OrgUserListResponse> {

    return this.apiOrgsOrgIdUsersGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<OrgUserListResponse>) => r.body as OrgUserListResponse)
    );
  }

  /**
   * Path part for operation apiOrgsOrgIdUsersPost
   */
  static readonly ApiOrgsOrgIdUsersPostPath = '/api/orgs/{orgId}/users';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdUsersPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgsOrgIdUsersPost$Response(params: {
    orgId: string;
    body: OrgUserCreateRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<OrgUserResponse>> {

    const rb = new RequestBuilder(this.rootUrl, OrgUserService.ApiOrgsOrgIdUsersPostPath, 'post');
    if (params) {
      rb.path('orgId', params.orgId, {});
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<OrgUserResponse>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdUsersPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgsOrgIdUsersPost(params: {
    orgId: string;
    body: OrgUserCreateRequest
  },
  context?: HttpContext

): Observable<OrgUserResponse> {

    return this.apiOrgsOrgIdUsersPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<OrgUserResponse>) => r.body as OrgUserResponse)
    );
  }

  /**
   * Path part for operation apiOrgsOrgIdUsersUserIdGet
   */
  static readonly ApiOrgsOrgIdUsersUserIdGetPath = '/api/orgs/{orgId}/users/{userId}';

  /**
   * Get Organization Authorized User from its user id.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdUsersUserIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdUsersUserIdGet$Response(params: {
    orgId: string;

    /**
     * Guid of the user
     */
    userId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<OrgUserResponse>> {

    const rb = new RequestBuilder(this.rootUrl, OrgUserService.ApiOrgsOrgIdUsersUserIdGetPath, 'get');
    if (params) {
      rb.path('orgId', params.orgId, {});
      rb.path('userId', params.userId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<OrgUserResponse>;
      })
    );
  }

  /**
   * Get Organization Authorized User from its user id.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdUsersUserIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdUsersUserIdGet(params: {
    orgId: string;

    /**
     * Guid of the user
     */
    userId: string;
  },
  context?: HttpContext

): Observable<OrgUserResponse> {

    return this.apiOrgsOrgIdUsersUserIdGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<OrgUserResponse>) => r.body as OrgUserResponse)
    );
  }

  /**
   * Path part for operation apiOrgsOrgIdUsersUserIdPut
   */
  static readonly ApiOrgsOrgIdUsersUserIdPutPath = '/api/orgs/{orgId}/users/{userId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdUsersUserIdPut()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgsOrgIdUsersUserIdPut$Response(params: {
    userId: string;
    orgId: string;
    body?: OrgUserUpdateRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<OrgUserResponse>> {

    const rb = new RequestBuilder(this.rootUrl, OrgUserService.ApiOrgsOrgIdUsersUserIdPutPath, 'put');
    if (params) {
      rb.path('userId', params.userId, {});
      rb.path('orgId', params.orgId, {});
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<OrgUserResponse>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdUsersUserIdPut$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgsOrgIdUsersUserIdPut(params: {
    userId: string;
    orgId: string;
    body?: OrgUserUpdateRequest
  },
  context?: HttpContext

): Observable<OrgUserResponse> {

    return this.apiOrgsOrgIdUsersUserIdPut$Response(params,context).pipe(
      map((r: StrictHttpResponse<OrgUserResponse>) => r.body as OrgUserResponse)
    );
  }

  /**
   * Path part for operation apiOrgsOrgIdUsersUserIdDelete
   */
  static readonly ApiOrgsOrgIdUsersUserIdDeletePath = '/api/orgs/{orgId}/users/{userId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdUsersUserIdDelete()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdUsersUserIdDelete$Response(params: {
    userId: string;
    orgId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ActionResult>> {

    const rb = new RequestBuilder(this.rootUrl, OrgUserService.ApiOrgsOrgIdUsersUserIdDeletePath, 'delete');
    if (params) {
      rb.path('userId', params.userId, {});
      rb.path('orgId', params.orgId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ActionResult>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdUsersUserIdDelete$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdUsersUserIdDelete(params: {
    userId: string;
    orgId: string;
  },
  context?: HttpContext

): Observable<ActionResult> {

    return this.apiOrgsOrgIdUsersUserIdDelete$Response(params,context).pipe(
      map((r: StrictHttpResponse<ActionResult>) => r.body as ActionResult)
    );
  }

  /**
   * Path part for operation apiOrgsAddBceidPrimaryUsersOrgIdGet
   */
  static readonly ApiOrgsAddBceidPrimaryUsersOrgIdGetPath = '/api/orgs/add-bceid-primary-users/{orgId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsAddBceidPrimaryUsersOrgIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsAddBceidPrimaryUsersOrgIdGet$Response(params: {
    orgId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<OrgUserResponse>> {

    const rb = new RequestBuilder(this.rootUrl, OrgUserService.ApiOrgsAddBceidPrimaryUsersOrgIdGetPath, 'get');
    if (params) {
      rb.path('orgId', params.orgId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<OrgUserResponse>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsAddBceidPrimaryUsersOrgIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsAddBceidPrimaryUsersOrgIdGet(params: {
    orgId: string;
  },
  context?: HttpContext

): Observable<OrgUserResponse> {

    return this.apiOrgsAddBceidPrimaryUsersOrgIdGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<OrgUserResponse>) => r.body as OrgUserResponse)
    );
  }

}
