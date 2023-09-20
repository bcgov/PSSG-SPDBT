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
import { DelegateCreateRequest } from '../models/delegate-create-request';
import { DelegateListResponse } from '../models/delegate-list-response';

@Injectable({
  providedIn: 'root',
})
export class DelegateService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation apiOrgsOrgIdApplicationApplicationIdDelegatesGet
   */
  static readonly ApiOrgsOrgIdApplicationApplicationIdDelegatesGetPath = '/api/orgs/{orgId}/application/{applicationId}/delegates';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdApplicationApplicationIdDelegatesGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdApplicationApplicationIdDelegatesGet$Response(params: {
    applicationId: string;
    orgId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<DelegateListResponse>> {

    const rb = new RequestBuilder(this.rootUrl, DelegateService.ApiOrgsOrgIdApplicationApplicationIdDelegatesGetPath, 'get');
    if (params) {
      rb.path('applicationId', params.applicationId, {});
      rb.path('orgId', params.orgId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<DelegateListResponse>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdApplicationApplicationIdDelegatesGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdApplicationApplicationIdDelegatesGet(params: {
    applicationId: string;
    orgId: string;
  },
  context?: HttpContext

): Observable<DelegateListResponse> {

    return this.apiOrgsOrgIdApplicationApplicationIdDelegatesGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<DelegateListResponse>) => r.body as DelegateListResponse)
    );
  }

  /**
   * Path part for operation apiOrgsOrgIdApplicationApplicationIdDelegatePost
   */
  static readonly ApiOrgsOrgIdApplicationApplicationIdDelegatePostPath = '/api/orgs/{orgId}/application/{applicationId}/delegate';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdApplicationApplicationIdDelegatePost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgsOrgIdApplicationApplicationIdDelegatePost$Response(params: {
    applicationId: string;
    orgId: string;
    body: DelegateCreateRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ActionResult>> {

    const rb = new RequestBuilder(this.rootUrl, DelegateService.ApiOrgsOrgIdApplicationApplicationIdDelegatePostPath, 'post');
    if (params) {
      rb.path('applicationId', params.applicationId, {});
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
        return r as StrictHttpResponse<ActionResult>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdApplicationApplicationIdDelegatePost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgsOrgIdApplicationApplicationIdDelegatePost(params: {
    applicationId: string;
    orgId: string;
    body: DelegateCreateRequest
  },
  context?: HttpContext

): Observable<ActionResult> {

    return this.apiOrgsOrgIdApplicationApplicationIdDelegatePost$Response(params,context).pipe(
      map((r: StrictHttpResponse<ActionResult>) => r.body as ActionResult)
    );
  }

  /**
   * Path part for operation apiOrgsOrgIdApplicationApplicationIdDelegateDelegateIdDelete
   */
  static readonly ApiOrgsOrgIdApplicationApplicationIdDelegateDelegateIdDeletePath = '/api/orgs/{orgId}/application/{applicationId}/delegate/{delegateId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdApplicationApplicationIdDelegateDelegateIdDelete()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdApplicationApplicationIdDelegateDelegateIdDelete$Response(params: {
    delegateId: string;
    applicationId: string;
    orgId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ActionResult>> {

    const rb = new RequestBuilder(this.rootUrl, DelegateService.ApiOrgsOrgIdApplicationApplicationIdDelegateDelegateIdDeletePath, 'delete');
    if (params) {
      rb.path('delegateId', params.delegateId, {});
      rb.path('applicationId', params.applicationId, {});
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
   * To access the full response (for headers, for example), `apiOrgsOrgIdApplicationApplicationIdDelegateDelegateIdDelete$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdApplicationApplicationIdDelegateDelegateIdDelete(params: {
    delegateId: string;
    applicationId: string;
    orgId: string;
  },
  context?: HttpContext

): Observable<ActionResult> {

    return this.apiOrgsOrgIdApplicationApplicationIdDelegateDelegateIdDelete$Response(params,context).pipe(
      map((r: StrictHttpResponse<ActionResult>) => r.body as ActionResult)
    );
  }

}
