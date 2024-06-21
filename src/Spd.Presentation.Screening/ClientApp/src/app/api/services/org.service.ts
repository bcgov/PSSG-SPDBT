/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { apiOrgsAccessCodeAccessCodeGet } from '../fn/org/api-orgs-access-code-access-code-get';
import { ApiOrgsAccessCodeAccessCodeGet$Params } from '../fn/org/api-orgs-access-code-access-code-get';
import { apiOrgsInviteLinkVerifyGet } from '../fn/org/api-orgs-invite-link-verify-get';
import { ApiOrgsInviteLinkVerifyGet$Params } from '../fn/org/api-orgs-invite-link-verify-get';
import { apiOrgsOrgIdGet } from '../fn/org/api-orgs-org-id-get';
import { ApiOrgsOrgIdGet$Params } from '../fn/org/api-orgs-org-id-get';
import { apiOrgsOrgIdPut } from '../fn/org/api-orgs-org-id-put';
import { ApiOrgsOrgIdPut$Params } from '../fn/org/api-orgs-org-id-put';
import { AppOrgResponse } from '../models/app-org-response';
import { OrgInviteVerifyResponse } from '../models/org-invite-verify-response';
import { OrgResponse } from '../models/org-response';

@Injectable({ providedIn: 'root' })
export class OrgService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `apiOrgsOrgIdGet()` */
  static readonly ApiOrgsOrgIdGetPath = '/api/orgs/{orgId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdGet$Response(params: ApiOrgsOrgIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<OrgResponse>> {
    return apiOrgsOrgIdGet(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdGet(params: ApiOrgsOrgIdGet$Params, context?: HttpContext): Observable<OrgResponse> {
    return this.apiOrgsOrgIdGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<OrgResponse>): OrgResponse => r.body)
    );
  }

  /** Path part for operation `apiOrgsOrgIdPut()` */
  static readonly ApiOrgsOrgIdPutPath = '/api/orgs/{orgId}';

  /**
   * Updating existing organization profile.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdPut()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgsOrgIdPut$Response(params: ApiOrgsOrgIdPut$Params, context?: HttpContext): Observable<StrictHttpResponse<OrgResponse>> {
    return apiOrgsOrgIdPut(this.http, this.rootUrl, params, context);
  }

  /**
   * Updating existing organization profile.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdPut$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgsOrgIdPut(params: ApiOrgsOrgIdPut$Params, context?: HttpContext): Observable<OrgResponse> {
    return this.apiOrgsOrgIdPut$Response(params, context).pipe(
      map((r: StrictHttpResponse<OrgResponse>): OrgResponse => r.body)
    );
  }

  /** Path part for operation `apiOrgsAccessCodeAccessCodeGet()` */
  static readonly ApiOrgsAccessCodeAccessCodeGetPath = '/api/orgs/access-code/{accessCode}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsAccessCodeAccessCodeGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsAccessCodeAccessCodeGet$Response(params: ApiOrgsAccessCodeAccessCodeGet$Params, context?: HttpContext): Observable<StrictHttpResponse<AppOrgResponse>> {
    return apiOrgsAccessCodeAccessCodeGet(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsAccessCodeAccessCodeGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsAccessCodeAccessCodeGet(params: ApiOrgsAccessCodeAccessCodeGet$Params, context?: HttpContext): Observable<AppOrgResponse> {
    return this.apiOrgsAccessCodeAccessCodeGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<AppOrgResponse>): AppOrgResponse => r.body)
    );
  }

  /** Path part for operation `apiOrgsInviteLinkVerifyGet()` */
  static readonly ApiOrgsInviteLinkVerifyGetPath = '/api/orgs/invite-link-verify';

  /**
   * the link is used for some existing org which has no org registration. 
   * But later, they found they have bceid, and they want to connect their bceid to this org as the primary contact.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsInviteLinkVerifyGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsInviteLinkVerifyGet$Response(params?: ApiOrgsInviteLinkVerifyGet$Params, context?: HttpContext): Observable<StrictHttpResponse<OrgInviteVerifyResponse>> {
    return apiOrgsInviteLinkVerifyGet(this.http, this.rootUrl, params, context);
  }

  /**
   * the link is used for some existing org which has no org registration. 
   * But later, they found they have bceid, and they want to connect their bceid to this org as the primary contact.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsInviteLinkVerifyGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsInviteLinkVerifyGet(params?: ApiOrgsInviteLinkVerifyGet$Params, context?: HttpContext): Observable<OrgInviteVerifyResponse> {
    return this.apiOrgsInviteLinkVerifyGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<OrgInviteVerifyResponse>): OrgInviteVerifyResponse => r.body)
    );
  }

}
