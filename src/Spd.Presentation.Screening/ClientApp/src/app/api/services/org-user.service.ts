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

  /**
   * Path part for operation apiOrgUserUserIdGet
   */
  static readonly ApiOrgUserUserIdGetPath = '/api/org-user/{userId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgUserUserIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgUserUserIdGet$Response(params: {
    userId: string;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<OrgUserResponse>> {

    const rb = new RequestBuilder(this.rootUrl, OrgUserService.ApiOrgUserUserIdGetPath, 'get');
    if (params) {
      rb.path('userId', params.userId, {});
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
   * To access the full response (for headers, for example), `apiOrgUserUserIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgUserUserIdGet(params: {
    userId: string;
    context?: HttpContext
  }
): Observable<OrgUserResponse> {

    return this.apiOrgUserUserIdGet$Response(params).pipe(
      map((r: StrictHttpResponse<OrgUserResponse>) => r.body as OrgUserResponse)
    );
  }

  /**
   * Path part for operation apiOrgUserUserIdPut
   */
  static readonly ApiOrgUserUserIdPutPath = '/api/org-user/{userId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgUserUserIdPut()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgUserUserIdPut$Response(params: {
    userId: string;
    context?: HttpContext
    body?: OrgUserUpdateRequest
  }
): Observable<StrictHttpResponse<OrgUserResponse>> {

    const rb = new RequestBuilder(this.rootUrl, OrgUserService.ApiOrgUserUserIdPutPath, 'put');
    if (params) {
      rb.path('userId', params.userId, {});
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
   * To access the full response (for headers, for example), `apiOrgUserUserIdPut$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgUserUserIdPut(params: {
    userId: string;
    context?: HttpContext
    body?: OrgUserUpdateRequest
  }
): Observable<OrgUserResponse> {

    return this.apiOrgUserUserIdPut$Response(params).pipe(
      map((r: StrictHttpResponse<OrgUserResponse>) => r.body as OrgUserResponse)
    );
  }

  /**
   * Path part for operation apiOrgUserUserIdDelete
   */
  static readonly ApiOrgUserUserIdDeletePath = '/api/org-user/{userId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgUserUserIdDelete()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgUserUserIdDelete$Response(params: {
    userId: string;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, OrgUserService.ApiOrgUserUserIdDeletePath, 'delete');
    if (params) {
      rb.path('userId', params.userId, {});
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiOrgUserUserIdDelete$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgUserUserIdDelete(params: {
    userId: string;
    context?: HttpContext
  }
): Observable<void> {

    return this.apiOrgUserUserIdDelete$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation apiOrgUsersOrganizationIdGet
   */
  static readonly ApiOrgUsersOrganizationIdGetPath = '/api/org-users/{organizationId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgUsersOrganizationIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgUsersOrganizationIdGet$Response(params: {
    organizationId: string;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<Array<OrgUserResponse>>> {

    const rb = new RequestBuilder(this.rootUrl, OrgUserService.ApiOrgUsersOrganizationIdGetPath, 'get');
    if (params) {
      rb.path('organizationId', params.organizationId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<OrgUserResponse>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiOrgUsersOrganizationIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgUsersOrganizationIdGet(params: {
    organizationId: string;
    context?: HttpContext
  }
): Observable<Array<OrgUserResponse>> {

    return this.apiOrgUsersOrganizationIdGet$Response(params).pipe(
      map((r: StrictHttpResponse<Array<OrgUserResponse>>) => r.body as Array<OrgUserResponse>)
    );
  }

}
