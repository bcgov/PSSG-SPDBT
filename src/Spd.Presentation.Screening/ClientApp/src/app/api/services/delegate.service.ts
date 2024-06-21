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
import { apiOrgsOrgIdApplicationApplicationIdDelegateDelegateIdDelete } from '../fn/delegate/api-orgs-org-id-application-application-id-delegate-delegate-id-delete';
import { ApiOrgsOrgIdApplicationApplicationIdDelegateDelegateIdDelete$Params } from '../fn/delegate/api-orgs-org-id-application-application-id-delegate-delegate-id-delete';
import { apiOrgsOrgIdApplicationApplicationIdDelegatePost } from '../fn/delegate/api-orgs-org-id-application-application-id-delegate-post';
import { ApiOrgsOrgIdApplicationApplicationIdDelegatePost$Params } from '../fn/delegate/api-orgs-org-id-application-application-id-delegate-post';
import { apiOrgsOrgIdApplicationApplicationIdDelegatesGet } from '../fn/delegate/api-orgs-org-id-application-application-id-delegates-get';
import { ApiOrgsOrgIdApplicationApplicationIdDelegatesGet$Params } from '../fn/delegate/api-orgs-org-id-application-application-id-delegates-get';
import { DelegateListResponse } from '../models/delegate-list-response';

@Injectable({ providedIn: 'root' })
export class DelegateService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `apiOrgsOrgIdApplicationApplicationIdDelegatesGet()` */
  static readonly ApiOrgsOrgIdApplicationApplicationIdDelegatesGetPath = '/api/orgs/{orgId}/application/{applicationId}/delegates';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdApplicationApplicationIdDelegatesGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdApplicationApplicationIdDelegatesGet$Response(params: ApiOrgsOrgIdApplicationApplicationIdDelegatesGet$Params, context?: HttpContext): Observable<StrictHttpResponse<DelegateListResponse>> {
    return apiOrgsOrgIdApplicationApplicationIdDelegatesGet(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdApplicationApplicationIdDelegatesGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdApplicationApplicationIdDelegatesGet(params: ApiOrgsOrgIdApplicationApplicationIdDelegatesGet$Params, context?: HttpContext): Observable<DelegateListResponse> {
    return this.apiOrgsOrgIdApplicationApplicationIdDelegatesGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<DelegateListResponse>): DelegateListResponse => r.body)
    );
  }

  /** Path part for operation `apiOrgsOrgIdApplicationApplicationIdDelegatePost()` */
  static readonly ApiOrgsOrgIdApplicationApplicationIdDelegatePostPath = '/api/orgs/{orgId}/application/{applicationId}/delegate';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdApplicationApplicationIdDelegatePost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgsOrgIdApplicationApplicationIdDelegatePost$Response(params: ApiOrgsOrgIdApplicationApplicationIdDelegatePost$Params, context?: HttpContext): Observable<StrictHttpResponse<ActionResult>> {
    return apiOrgsOrgIdApplicationApplicationIdDelegatePost(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdApplicationApplicationIdDelegatePost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgsOrgIdApplicationApplicationIdDelegatePost(params: ApiOrgsOrgIdApplicationApplicationIdDelegatePost$Params, context?: HttpContext): Observable<ActionResult> {
    return this.apiOrgsOrgIdApplicationApplicationIdDelegatePost$Response(params, context).pipe(
      map((r: StrictHttpResponse<ActionResult>): ActionResult => r.body)
    );
  }

  /** Path part for operation `apiOrgsOrgIdApplicationApplicationIdDelegateDelegateIdDelete()` */
  static readonly ApiOrgsOrgIdApplicationApplicationIdDelegateDelegateIdDeletePath = '/api/orgs/{orgId}/application/{applicationId}/delegate/{delegateId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdApplicationApplicationIdDelegateDelegateIdDelete()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdApplicationApplicationIdDelegateDelegateIdDelete$Response(params: ApiOrgsOrgIdApplicationApplicationIdDelegateDelegateIdDelete$Params, context?: HttpContext): Observable<StrictHttpResponse<ActionResult>> {
    return apiOrgsOrgIdApplicationApplicationIdDelegateDelegateIdDelete(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdApplicationApplicationIdDelegateDelegateIdDelete$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdApplicationApplicationIdDelegateDelegateIdDelete(params: ApiOrgsOrgIdApplicationApplicationIdDelegateDelegateIdDelete$Params, context?: HttpContext): Observable<ActionResult> {
    return this.apiOrgsOrgIdApplicationApplicationIdDelegateDelegateIdDelete$Response(params, context).pipe(
      map((r: StrictHttpResponse<ActionResult>): ActionResult => r.body)
    );
  }

}
