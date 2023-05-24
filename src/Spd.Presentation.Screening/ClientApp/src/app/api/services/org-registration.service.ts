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

import { AnonymousOrgRegistrationCreateRequest } from '../models/anonymous-org-registration-create-request';
import { OrgRegistrationCreateRequest } from '../models/org-registration-create-request';
import { OrgRegistrationCreateResponse } from '../models/org-registration-create-response';
import { OrgRegistrationPortalStatusResponse } from '../models/org-registration-portal-status-response';

@Injectable({
  providedIn: 'root',
})
export class OrgRegistrationService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation apiAnonymousOrgRegistrationsPost
   */
  static readonly ApiAnonymousOrgRegistrationsPostPath = '/api/anonymous-org-registrations';

  /**
   * User not login, use this endpoint with googleRecaptcha as security check.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiAnonymousOrgRegistrationsPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiAnonymousOrgRegistrationsPost$Response(params: {
    context?: HttpContext
    body: AnonymousOrgRegistrationCreateRequest
  }
): Observable<StrictHttpResponse<OrgRegistrationCreateResponse>> {

    const rb = new RequestBuilder(this.rootUrl, OrgRegistrationService.ApiAnonymousOrgRegistrationsPostPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<OrgRegistrationCreateResponse>;
      })
    );
  }

  /**
   * User not login, use this endpoint with googleRecaptcha as security check.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiAnonymousOrgRegistrationsPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiAnonymousOrgRegistrationsPost(params: {
    context?: HttpContext
    body: AnonymousOrgRegistrationCreateRequest
  }
): Observable<OrgRegistrationCreateResponse> {

    return this.apiAnonymousOrgRegistrationsPost$Response(params).pipe(
      map((r: StrictHttpResponse<OrgRegistrationCreateResponse>) => r.body as OrgRegistrationCreateResponse)
    );
  }

  /**
   * Path part for operation apiOrgRegistrationsPost
   */
  static readonly ApiOrgRegistrationsPostPath = '/api/org-registrations';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgRegistrationsPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgRegistrationsPost$Response(params: {
    context?: HttpContext
    body: OrgRegistrationCreateRequest
  }
): Observable<StrictHttpResponse<OrgRegistrationCreateResponse>> {

    const rb = new RequestBuilder(this.rootUrl, OrgRegistrationService.ApiOrgRegistrationsPostPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<OrgRegistrationCreateResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiOrgRegistrationsPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgRegistrationsPost(params: {
    context?: HttpContext
    body: OrgRegistrationCreateRequest
  }
): Observable<OrgRegistrationCreateResponse> {

    return this.apiOrgRegistrationsPost$Response(params).pipe(
      map((r: StrictHttpResponse<OrgRegistrationCreateResponse>) => r.body as OrgRegistrationCreateResponse)
    );
  }

  /**
   * Path part for operation apiOrgRegistrationsRegistrationNumberStatusGet
   */
  static readonly ApiOrgRegistrationsRegistrationNumberStatusGetPath = '/api/org-registrations/{registrationNumber}/status';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgRegistrationsRegistrationNumberStatusGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgRegistrationsRegistrationNumberStatusGet$Response(params: {
    registrationNumber: string;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<OrgRegistrationPortalStatusResponse>> {

    const rb = new RequestBuilder(this.rootUrl, OrgRegistrationService.ApiOrgRegistrationsRegistrationNumberStatusGetPath, 'get');
    if (params) {
      rb.path('registrationNumber', params.registrationNumber, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<OrgRegistrationPortalStatusResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiOrgRegistrationsRegistrationNumberStatusGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgRegistrationsRegistrationNumberStatusGet(params: {
    registrationNumber: string;
    context?: HttpContext
  }
): Observable<OrgRegistrationPortalStatusResponse> {

    return this.apiOrgRegistrationsRegistrationNumberStatusGet$Response(params).pipe(
      map((r: StrictHttpResponse<OrgRegistrationPortalStatusResponse>) => r.body as OrgRegistrationPortalStatusResponse)
    );
  }

}
