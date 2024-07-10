/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { apiAnonymousOrgRegistrationsPost } from '../fn/org-registration/api-anonymous-org-registrations-post';
import { ApiAnonymousOrgRegistrationsPost$Params } from '../fn/org-registration/api-anonymous-org-registrations-post';
import { apiOrgRegistrationsPost } from '../fn/org-registration/api-org-registrations-post';
import { ApiOrgRegistrationsPost$Params } from '../fn/org-registration/api-org-registrations-post';
import { apiOrgRegistrationsRegistrationNumberStatusGet } from '../fn/org-registration/api-org-registrations-registration-number-status-get';
import { ApiOrgRegistrationsRegistrationNumberStatusGet$Params } from '../fn/org-registration/api-org-registrations-registration-number-status-get';
import { OrgRegistrationCreateResponse } from '../models/org-registration-create-response';
import { OrgRegistrationPortalStatusResponse } from '../models/org-registration-portal-status-response';

@Injectable({ providedIn: 'root' })
export class OrgRegistrationService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `apiAnonymousOrgRegistrationsPost()` */
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
  apiAnonymousOrgRegistrationsPost$Response(params: ApiAnonymousOrgRegistrationsPost$Params, context?: HttpContext): Observable<StrictHttpResponse<OrgRegistrationCreateResponse>> {
    return apiAnonymousOrgRegistrationsPost(this.http, this.rootUrl, params, context);
  }

  /**
   * User not login, use this endpoint with googleRecaptcha as security check.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiAnonymousOrgRegistrationsPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiAnonymousOrgRegistrationsPost(params: ApiAnonymousOrgRegistrationsPost$Params, context?: HttpContext): Observable<OrgRegistrationCreateResponse> {
    return this.apiAnonymousOrgRegistrationsPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<OrgRegistrationCreateResponse>): OrgRegistrationCreateResponse => r.body)
    );
  }

  /** Path part for operation `apiOrgRegistrationsPost()` */
  static readonly ApiOrgRegistrationsPostPath = '/api/org-registrations';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgRegistrationsPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgRegistrationsPost$Response(params: ApiOrgRegistrationsPost$Params, context?: HttpContext): Observable<StrictHttpResponse<OrgRegistrationCreateResponse>> {
    return apiOrgRegistrationsPost(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgRegistrationsPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgRegistrationsPost(params: ApiOrgRegistrationsPost$Params, context?: HttpContext): Observable<OrgRegistrationCreateResponse> {
    return this.apiOrgRegistrationsPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<OrgRegistrationCreateResponse>): OrgRegistrationCreateResponse => r.body)
    );
  }

  /** Path part for operation `apiOrgRegistrationsRegistrationNumberStatusGet()` */
  static readonly ApiOrgRegistrationsRegistrationNumberStatusGetPath = '/api/org-registrations/{registrationNumber}/status';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgRegistrationsRegistrationNumberStatusGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgRegistrationsRegistrationNumberStatusGet$Response(params: ApiOrgRegistrationsRegistrationNumberStatusGet$Params, context?: HttpContext): Observable<StrictHttpResponse<OrgRegistrationPortalStatusResponse>> {
    return apiOrgRegistrationsRegistrationNumberStatusGet(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgRegistrationsRegistrationNumberStatusGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgRegistrationsRegistrationNumberStatusGet(params: ApiOrgRegistrationsRegistrationNumberStatusGet$Params, context?: HttpContext): Observable<OrgRegistrationPortalStatusResponse> {
    return this.apiOrgRegistrationsRegistrationNumberStatusGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<OrgRegistrationPortalStatusResponse>): OrgRegistrationPortalStatusResponse => r.body)
    );
  }

}
