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

import { OrgUserCreateRequest } from '../models/org-user-create-request';
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
   * Path part for operation apiOrgUserPut
   */
  static readonly ApiOrgUserPutPath = '/api/org-user';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgUserPut()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgUserPut$Response(params?: {
    userId?: string;
    context?: HttpContext
    body?: OrgUserUpdateRequest
  }
): Observable<StrictHttpResponse<OrgUserResponse>> {

    const rb = new RequestBuilder(this.rootUrl, OrgUserService.ApiOrgUserPutPath, 'put');
    if (params) {
      rb.query('userId', params.userId, {});
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<OrgUserResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiOrgUserPut$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgUserPut(params?: {
    userId?: string;
    context?: HttpContext
    body?: OrgUserUpdateRequest
  }
): Observable<OrgUserResponse> {

    return this.apiOrgUserPut$Response(params).pipe(
      map((r: StrictHttpResponse<OrgUserResponse>) => r.body as OrgUserResponse)
    );
  }

  /**
   * Path part for operation apiOrgUserPost
   */
  static readonly ApiOrgUserPostPath = '/api/org-user';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgUserPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgUserPost$Response(params: {
    context?: HttpContext
    body: OrgUserCreateRequest
  }
): Observable<StrictHttpResponse<OrgUserResponse>> {

    const rb = new RequestBuilder(this.rootUrl, OrgUserService.ApiOrgUserPostPath, 'post');
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
        return r as StrictHttpResponse<OrgUserResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiOrgUserPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgUserPost(params: {
    context?: HttpContext
    body: OrgUserCreateRequest
  }
): Observable<OrgUserResponse> {

    return this.apiOrgUserPost$Response(params).pipe(
      map((r: StrictHttpResponse<OrgUserResponse>) => r.body as OrgUserResponse)
    );
  }

}
