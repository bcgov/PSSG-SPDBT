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
import { CheckDuplicateResponse } from '../models/check-duplicate-response';
import { OrgRegistrationCreateRequest } from '../models/org-registration-create-request';

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
): Observable<StrictHttpResponse<ActionResult>> {

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
        return r as StrictHttpResponse<ActionResult>;
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
): Observable<ActionResult> {

    return this.apiOrgRegistrationsPost$Response(params).pipe(
      map((r: StrictHttpResponse<ActionResult>) => r.body as ActionResult)
    );
  }

  /**
   * Path part for operation apiOrgRegistrationsDetectDuplicatePost
   */
  static readonly ApiOrgRegistrationsDetectDuplicatePostPath = '/api/org-registrations/detect-duplicate';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgRegistrationsDetectDuplicatePost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgRegistrationsDetectDuplicatePost$Response(params: {
    context?: HttpContext
    body: OrgRegistrationCreateRequest
  }
): Observable<StrictHttpResponse<CheckDuplicateResponse>> {

    const rb = new RequestBuilder(this.rootUrl, OrgRegistrationService.ApiOrgRegistrationsDetectDuplicatePostPath, 'post');
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
        return r as StrictHttpResponse<CheckDuplicateResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiOrgRegistrationsDetectDuplicatePost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgRegistrationsDetectDuplicatePost(params: {
    context?: HttpContext
    body: OrgRegistrationCreateRequest
  }
): Observable<CheckDuplicateResponse> {

    return this.apiOrgRegistrationsDetectDuplicatePost$Response(params).pipe(
      map((r: StrictHttpResponse<CheckDuplicateResponse>) => r.body as CheckDuplicateResponse)
    );
  }

}
