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
import { apiBusinessBizIdPortalUsersGet } from '../fn/biz-portal-user/api-business-biz-id-portal-users-get';
import { ApiBusinessBizIdPortalUsersGet$Params } from '../fn/biz-portal-user/api-business-biz-id-portal-users-get';
import { apiBusinessBizIdPortalUsersPost } from '../fn/biz-portal-user/api-business-biz-id-portal-users-post';
import { ApiBusinessBizIdPortalUsersPost$Params } from '../fn/biz-portal-user/api-business-biz-id-portal-users-post';
import { apiBusinessBizIdPortalUsersUserIdDelete } from '../fn/biz-portal-user/api-business-biz-id-portal-users-user-id-delete';
import { ApiBusinessBizIdPortalUsersUserIdDelete$Params } from '../fn/biz-portal-user/api-business-biz-id-portal-users-user-id-delete';
import { apiBusinessBizIdPortalUsersUserIdGet } from '../fn/biz-portal-user/api-business-biz-id-portal-users-user-id-get';
import { ApiBusinessBizIdPortalUsersUserIdGet$Params } from '../fn/biz-portal-user/api-business-biz-id-portal-users-user-id-get';
import { apiBusinessBizIdPortalUsersUserIdPut } from '../fn/biz-portal-user/api-business-biz-id-portal-users-user-id-put';
import { ApiBusinessBizIdPortalUsersUserIdPut$Params } from '../fn/biz-portal-user/api-business-biz-id-portal-users-user-id-put';
import { BizPortalUserListResponse } from '../models/biz-portal-user-list-response';
import { BizPortalUserResponse } from '../models/biz-portal-user-response';

@Injectable({ providedIn: 'root' })
export class BizPortalUserService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `apiBusinessBizIdPortalUsersGet()` */
  static readonly ApiBusinessBizIdPortalUsersGetPath = '/api/business/{bizId}/portal-users';

  /**
   * Get Business Portal User list.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBusinessBizIdPortalUsersGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBusinessBizIdPortalUsersGet$Response(params: ApiBusinessBizIdPortalUsersGet$Params, context?: HttpContext): Observable<StrictHttpResponse<BizPortalUserListResponse>> {
    return apiBusinessBizIdPortalUsersGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Get Business Portal User list.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBusinessBizIdPortalUsersGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBusinessBizIdPortalUsersGet(params: ApiBusinessBizIdPortalUsersGet$Params, context?: HttpContext): Observable<BizPortalUserListResponse> {
    return this.apiBusinessBizIdPortalUsersGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<BizPortalUserListResponse>): BizPortalUserListResponse => r.body)
    );
  }

  /** Path part for operation `apiBusinessBizIdPortalUsersPost()` */
  static readonly ApiBusinessBizIdPortalUsersPostPath = '/api/business/{bizId}/portal-users';

  /**
   * Create Business Portal User.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBusinessBizIdPortalUsersPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiBusinessBizIdPortalUsersPost$Response(params: ApiBusinessBizIdPortalUsersPost$Params, context?: HttpContext): Observable<StrictHttpResponse<BizPortalUserResponse>> {
    return apiBusinessBizIdPortalUsersPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Create Business Portal User.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBusinessBizIdPortalUsersPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiBusinessBizIdPortalUsersPost(params: ApiBusinessBizIdPortalUsersPost$Params, context?: HttpContext): Observable<BizPortalUserResponse> {
    return this.apiBusinessBizIdPortalUsersPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<BizPortalUserResponse>): BizPortalUserResponse => r.body)
    );
  }

  /** Path part for operation `apiBusinessBizIdPortalUsersUserIdGet()` */
  static readonly ApiBusinessBizIdPortalUsersUserIdGetPath = '/api/business/{bizId}/portal-users/{userId}';

  /**
   * Get Business Portal User.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBusinessBizIdPortalUsersUserIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBusinessBizIdPortalUsersUserIdGet$Response(params: ApiBusinessBizIdPortalUsersUserIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<BizPortalUserResponse>> {
    return apiBusinessBizIdPortalUsersUserIdGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Get Business Portal User.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBusinessBizIdPortalUsersUserIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBusinessBizIdPortalUsersUserIdGet(params: ApiBusinessBizIdPortalUsersUserIdGet$Params, context?: HttpContext): Observable<BizPortalUserResponse> {
    return this.apiBusinessBizIdPortalUsersUserIdGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<BizPortalUserResponse>): BizPortalUserResponse => r.body)
    );
  }

  /** Path part for operation `apiBusinessBizIdPortalUsersUserIdPut()` */
  static readonly ApiBusinessBizIdPortalUsersUserIdPutPath = '/api/business/{bizId}/portal-users/{userId}';

  /**
   * Update Business Portal User.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBusinessBizIdPortalUsersUserIdPut()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiBusinessBizIdPortalUsersUserIdPut$Response(params: ApiBusinessBizIdPortalUsersUserIdPut$Params, context?: HttpContext): Observable<StrictHttpResponse<BizPortalUserResponse>> {
    return apiBusinessBizIdPortalUsersUserIdPut(this.http, this.rootUrl, params, context);
  }

  /**
   * Update Business Portal User.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBusinessBizIdPortalUsersUserIdPut$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiBusinessBizIdPortalUsersUserIdPut(params: ApiBusinessBizIdPortalUsersUserIdPut$Params, context?: HttpContext): Observable<BizPortalUserResponse> {
    return this.apiBusinessBizIdPortalUsersUserIdPut$Response(params, context).pipe(
      map((r: StrictHttpResponse<BizPortalUserResponse>): BizPortalUserResponse => r.body)
    );
  }

  /** Path part for operation `apiBusinessBizIdPortalUsersUserIdDelete()` */
  static readonly ApiBusinessBizIdPortalUsersUserIdDeletePath = '/api/business/{bizId}/portal-users/{userId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBusinessBizIdPortalUsersUserIdDelete()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBusinessBizIdPortalUsersUserIdDelete$Response(params: ApiBusinessBizIdPortalUsersUserIdDelete$Params, context?: HttpContext): Observable<StrictHttpResponse<ActionResult>> {
    return apiBusinessBizIdPortalUsersUserIdDelete(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBusinessBizIdPortalUsersUserIdDelete$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBusinessBizIdPortalUsersUserIdDelete(params: ApiBusinessBizIdPortalUsersUserIdDelete$Params, context?: HttpContext): Observable<ActionResult> {
    return this.apiBusinessBizIdPortalUsersUserIdDelete$Response(params, context).pipe(
      map((r: StrictHttpResponse<ActionResult>): ActionResult => r.body)
    );
  }

}
