/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { ActionResult } from '../models/action-result';
import { apiOrgsAddBceidPrimaryUsersOrgIdGet } from '../fn/org-user/api-orgs-add-bceid-primary-users-org-id-get';
import { ApiOrgsAddBceidPrimaryUsersOrgIdGet$Params } from '../fn/org-user/api-orgs-add-bceid-primary-users-org-id-get';
import { apiOrgsOrgIdUsersGet } from '../fn/org-user/api-orgs-org-id-users-get';
import { ApiOrgsOrgIdUsersGet$Params } from '../fn/org-user/api-orgs-org-id-users-get';
import { apiOrgsOrgIdUsersPost } from '../fn/org-user/api-orgs-org-id-users-post';
import { ApiOrgsOrgIdUsersPost$Params } from '../fn/org-user/api-orgs-org-id-users-post';
import { apiOrgsOrgIdUsersUserIdDelete } from '../fn/org-user/api-orgs-org-id-users-user-id-delete';
import { ApiOrgsOrgIdUsersUserIdDelete$Params } from '../fn/org-user/api-orgs-org-id-users-user-id-delete';
import { apiOrgsOrgIdUsersUserIdGet } from '../fn/org-user/api-orgs-org-id-users-user-id-get';
import { ApiOrgsOrgIdUsersUserIdGet$Params } from '../fn/org-user/api-orgs-org-id-users-user-id-get';
import { apiOrgsOrgIdUsersUserIdPut } from '../fn/org-user/api-orgs-org-id-users-user-id-put';
import { ApiOrgsOrgIdUsersUserIdPut$Params } from '../fn/org-user/api-orgs-org-id-users-user-id-put';
import { apiUserInvitationPost } from '../fn/org-user/api-user-invitation-post';
import { ApiUserInvitationPost$Params } from '../fn/org-user/api-user-invitation-post';
import { InvitationResponse } from '../models/invitation-response';
import { OrgUserListResponse } from '../models/org-user-list-response';
import { OrgUserResponse } from '../models/org-user-response';

@Injectable({ providedIn: 'root' })
export class OrgUserService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `apiUserInvitationPost()` */
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
  apiUserInvitationPost$Response(params: ApiUserInvitationPost$Params, context?: HttpContext): Observable<StrictHttpResponse<InvitationResponse>> {
    return apiUserInvitationPost(this.http, this.rootUrl, params, context);
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
  apiUserInvitationPost(params: ApiUserInvitationPost$Params, context?: HttpContext): Observable<InvitationResponse> {
    return this.apiUserInvitationPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<InvitationResponse>): InvitationResponse => r.body)
    );
  }

  /** Path part for operation `apiOrgsOrgIdUsersGet()` */
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
  apiOrgsOrgIdUsersGet$Response(params: ApiOrgsOrgIdUsersGet$Params, context?: HttpContext): Observable<StrictHttpResponse<OrgUserListResponse>> {
    return apiOrgsOrgIdUsersGet(this.http, this.rootUrl, params, context);
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
  apiOrgsOrgIdUsersGet(params: ApiOrgsOrgIdUsersGet$Params, context?: HttpContext): Observable<OrgUserListResponse> {
    return this.apiOrgsOrgIdUsersGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<OrgUserListResponse>): OrgUserListResponse => r.body)
    );
  }

  /** Path part for operation `apiOrgsOrgIdUsersPost()` */
  static readonly ApiOrgsOrgIdUsersPostPath = '/api/orgs/{orgId}/users';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdUsersPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgsOrgIdUsersPost$Response(params: ApiOrgsOrgIdUsersPost$Params, context?: HttpContext): Observable<StrictHttpResponse<OrgUserResponse>> {
    return apiOrgsOrgIdUsersPost(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdUsersPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgsOrgIdUsersPost(params: ApiOrgsOrgIdUsersPost$Params, context?: HttpContext): Observable<OrgUserResponse> {
    return this.apiOrgsOrgIdUsersPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<OrgUserResponse>): OrgUserResponse => r.body)
    );
  }

  /** Path part for operation `apiOrgsOrgIdUsersUserIdGet()` */
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
  apiOrgsOrgIdUsersUserIdGet$Response(params: ApiOrgsOrgIdUsersUserIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<OrgUserResponse>> {
    return apiOrgsOrgIdUsersUserIdGet(this.http, this.rootUrl, params, context);
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
  apiOrgsOrgIdUsersUserIdGet(params: ApiOrgsOrgIdUsersUserIdGet$Params, context?: HttpContext): Observable<OrgUserResponse> {
    return this.apiOrgsOrgIdUsersUserIdGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<OrgUserResponse>): OrgUserResponse => r.body)
    );
  }

  /** Path part for operation `apiOrgsOrgIdUsersUserIdPut()` */
  static readonly ApiOrgsOrgIdUsersUserIdPutPath = '/api/orgs/{orgId}/users/{userId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdUsersUserIdPut()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgsOrgIdUsersUserIdPut$Response(params: ApiOrgsOrgIdUsersUserIdPut$Params, context?: HttpContext): Observable<StrictHttpResponse<OrgUserResponse>> {
    return apiOrgsOrgIdUsersUserIdPut(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdUsersUserIdPut$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgsOrgIdUsersUserIdPut(params: ApiOrgsOrgIdUsersUserIdPut$Params, context?: HttpContext): Observable<OrgUserResponse> {
    return this.apiOrgsOrgIdUsersUserIdPut$Response(params, context).pipe(
      map((r: StrictHttpResponse<OrgUserResponse>): OrgUserResponse => r.body)
    );
  }

  /** Path part for operation `apiOrgsOrgIdUsersUserIdDelete()` */
  static readonly ApiOrgsOrgIdUsersUserIdDeletePath = '/api/orgs/{orgId}/users/{userId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdUsersUserIdDelete()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdUsersUserIdDelete$Response(params: ApiOrgsOrgIdUsersUserIdDelete$Params, context?: HttpContext): Observable<StrictHttpResponse<ActionResult>> {
    return apiOrgsOrgIdUsersUserIdDelete(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdUsersUserIdDelete$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdUsersUserIdDelete(params: ApiOrgsOrgIdUsersUserIdDelete$Params, context?: HttpContext): Observable<ActionResult> {
    return this.apiOrgsOrgIdUsersUserIdDelete$Response(params, context).pipe(
      map((r: StrictHttpResponse<ActionResult>): ActionResult => r.body)
    );
  }

  /** Path part for operation `apiOrgsAddBceidPrimaryUsersOrgIdGet()` */
  static readonly ApiOrgsAddBceidPrimaryUsersOrgIdGetPath = '/api/orgs/add-bceid-primary-users/{orgId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsAddBceidPrimaryUsersOrgIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsAddBceidPrimaryUsersOrgIdGet$Response(params: ApiOrgsAddBceidPrimaryUsersOrgIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<OrgUserResponse>> {
    return apiOrgsAddBceidPrimaryUsersOrgIdGet(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsAddBceidPrimaryUsersOrgIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsAddBceidPrimaryUsersOrgIdGet(params: ApiOrgsAddBceidPrimaryUsersOrgIdGet$Params, context?: HttpContext): Observable<OrgUserResponse> {
    return this.apiOrgsAddBceidPrimaryUsersOrgIdGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<OrgUserResponse>): OrgUserResponse => r.body)
    );
  }

}
