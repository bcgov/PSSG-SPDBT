/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { apiBizBizIdPut } from '../fn/biz-profile/api-biz-biz-id-put';
import { ApiBizBizIdPut$Params } from '../fn/biz-profile/api-biz-biz-id-put';
import { apiBizIdGet } from '../fn/biz-profile/api-biz-id-get';
import { ApiBizIdGet$Params } from '../fn/biz-profile/api-biz-id-get';
import { BizProfileResponse } from '../models/biz-profile-response';

@Injectable({ providedIn: 'root' })
export class BizProfileService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `apiBizIdGet()` */
  static readonly ApiBizIdGetPath = '/api/biz/{id}';

  /**
   * Get Business profile.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBizIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBizIdGet$Response(params: ApiBizIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<BizProfileResponse>> {
    return apiBizIdGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Get Business profile.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBizIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBizIdGet(params: ApiBizIdGet$Params, context?: HttpContext): Observable<BizProfileResponse> {
    return this.apiBizIdGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<BizProfileResponse>): BizProfileResponse => r.body)
    );
  }

  /** Path part for operation `apiBizBizIdPut()` */
  static readonly ApiBizBizIdPutPath = '/api/biz/{bizId}';

  /**
   * Update Business profile.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBizBizIdPut()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiBizBizIdPut$Response(params: ApiBizBizIdPut$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
    return apiBizBizIdPut(this.http, this.rootUrl, params, context);
  }

  /**
   * Update Business profile.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBizBizIdPut$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiBizBizIdPut(params: ApiBizBizIdPut$Params, context?: HttpContext): Observable<string> {
    return this.apiBizBizIdPut$Response(params, context).pipe(
      map((r: StrictHttpResponse<string>): string => r.body)
    );
  }

}
