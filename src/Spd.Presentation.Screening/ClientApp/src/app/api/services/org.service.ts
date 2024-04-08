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

import { AppOrgResponse } from '../models/app-org-response';
import { OrgInviteVerifyResponse } from '../models/org-invite-verify-response';
import { OrgResponse } from '../models/org-response';
import { OrgUpdateRequest } from '../models/org-update-request';

@Injectable({
  providedIn: 'root',
})
export class OrgService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation apiOrgsOrgIdGet
   */
  static readonly ApiOrgsOrgIdGetPath = '/api/orgs/{orgId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdGet$Response(params: {
    orgId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<OrgResponse>> {

    const rb = new RequestBuilder(this.rootUrl, OrgService.ApiOrgsOrgIdGetPath, 'get');
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
        return r as StrictHttpResponse<OrgResponse>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdGet(params: {
    orgId: string;
  },
  context?: HttpContext

): Observable<OrgResponse> {

    return this.apiOrgsOrgIdGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<OrgResponse>) => r.body as OrgResponse)
    );
  }

  /**
   * Path part for operation apiOrgsOrgIdPut
   */
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
  apiOrgsOrgIdPut$Response(params: {
    orgId: string;
    body?: OrgUpdateRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<OrgResponse>> {

    const rb = new RequestBuilder(this.rootUrl, OrgService.ApiOrgsOrgIdPutPath, 'put');
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
        return r as StrictHttpResponse<OrgResponse>;
      })
    );
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
  apiOrgsOrgIdPut(params: {
    orgId: string;
    body?: OrgUpdateRequest
  },
  context?: HttpContext

): Observable<OrgResponse> {

    return this.apiOrgsOrgIdPut$Response(params,context).pipe(
      map((r: StrictHttpResponse<OrgResponse>) => r.body as OrgResponse)
    );
  }

  /**
   * Path part for operation apiOrgsAccessCodeAccessCodeGet
   */
  static readonly ApiOrgsAccessCodeAccessCodeGetPath = '/api/orgs/access-code/{accessCode}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsAccessCodeAccessCodeGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsAccessCodeAccessCodeGet$Response(params: {
    accessCode: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<AppOrgResponse>> {

    const rb = new RequestBuilder(this.rootUrl, OrgService.ApiOrgsAccessCodeAccessCodeGetPath, 'get');
    if (params) {
      rb.path('accessCode', params.accessCode, {});
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
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsAccessCodeAccessCodeGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsAccessCodeAccessCodeGet(params: {
    accessCode: string;
  },
  context?: HttpContext

): Observable<AppOrgResponse> {

    return this.apiOrgsAccessCodeAccessCodeGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<AppOrgResponse>) => r.body as AppOrgResponse)
    );
  }

  /**
   * Path part for operation apiOrgsInviteLinkVerifyGet
   */
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
  apiOrgsInviteLinkVerifyGet$Response(params?: {
    encodedOrgId?: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<OrgInviteVerifyResponse>> {

    const rb = new RequestBuilder(this.rootUrl, OrgService.ApiOrgsInviteLinkVerifyGetPath, 'get');
    if (params) {
      rb.query('encodedOrgId', params.encodedOrgId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<OrgInviteVerifyResponse>;
      })
    );
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
  apiOrgsInviteLinkVerifyGet(params?: {
    encodedOrgId?: string;
  },
  context?: HttpContext

): Observable<OrgInviteVerifyResponse> {

    return this.apiOrgsInviteLinkVerifyGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<OrgInviteVerifyResponse>) => r.body as OrgInviteVerifyResponse)
    );
  }

}
