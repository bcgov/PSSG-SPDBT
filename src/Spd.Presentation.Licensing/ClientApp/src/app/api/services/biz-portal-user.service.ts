/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { apiBusinessBizIdPortalUsersPost } from '../fn/biz-portal-user/api-business-biz-id-portal-users-post';
import { ApiBusinessBizIdPortalUsersPost$Params } from '../fn/biz-portal-user/api-business-biz-id-portal-users-post';
import { BizPortalUserResponse } from '../models/biz-portal-user-response';

@Injectable({ providedIn: 'root' })
export class BizPortalUserService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
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

}
