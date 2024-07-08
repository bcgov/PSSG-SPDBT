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
import { apiApplicantApplicantIdTermAgreeGet } from '../fn/login/api-applicant-applicant-id-term-agree-get';
import { ApiApplicantApplicantIdTermAgreeGet$Params } from '../fn/login/api-applicant-applicant-id-term-agree-get';
import { apiApplicantLoginGet } from '../fn/login/api-applicant-login-get';
import { ApiApplicantLoginGet$Params } from '../fn/login/api-applicant-login-get';
import { apiBizBizIdManagerBizUserIdTermAgreeGet } from '../fn/login/api-biz-biz-id-manager-biz-user-id-term-agree-get';
import { ApiBizBizIdManagerBizUserIdTermAgreeGet$Params } from '../fn/login/api-biz-biz-id-manager-biz-user-id-term-agree-get';
import { apiBizLoginGet } from '../fn/login/api-biz-login-get';
import { ApiBizLoginGet$Params } from '../fn/login/api-biz-login-get';
import { apiBizsGet } from '../fn/login/api-bizs-get';
import { ApiBizsGet$Params } from '../fn/login/api-bizs-get';
import { ApplicantLoginResponse } from '../models/applicant-login-response';
import { BizListResponse } from '../models/biz-list-response';
import { BizUserLoginResponse } from '../models/biz-user-login-response';

@Injectable({ providedIn: 'root' })
export class LoginService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `apiApplicantLoginGet()` */
  static readonly ApiApplicantLoginGetPath = '/api/applicant/login';

  /**
   * login, for swl/permit portal, bc service card login.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiApplicantLoginGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantLoginGet$Response(params?: ApiApplicantLoginGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ApplicantLoginResponse>> {
    return apiApplicantLoginGet(this.http, this.rootUrl, params, context);
  }

  /**
   * login, for swl/permit portal, bc service card login.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiApplicantLoginGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantLoginGet(params?: ApiApplicantLoginGet$Params, context?: HttpContext): Observable<ApplicantLoginResponse> {
    return this.apiApplicantLoginGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<ApplicantLoginResponse>): ApplicantLoginResponse => r.body)
    );
  }

  /** Path part for operation `apiApplicantApplicantIdTermAgreeGet()` */
  static readonly ApiApplicantApplicantIdTermAgreeGetPath = '/api/applicant/{applicantId}/term-agree';

  /**
   * when user select agree to the Term. Call this endpoint.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiApplicantApplicantIdTermAgreeGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantApplicantIdTermAgreeGet$Response(params: ApiApplicantApplicantIdTermAgreeGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ActionResult>> {
    return apiApplicantApplicantIdTermAgreeGet(this.http, this.rootUrl, params, context);
  }

  /**
   * when user select agree to the Term. Call this endpoint.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiApplicantApplicantIdTermAgreeGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantApplicantIdTermAgreeGet(params: ApiApplicantApplicantIdTermAgreeGet$Params, context?: HttpContext): Observable<ActionResult> {
    return this.apiApplicantApplicantIdTermAgreeGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<ActionResult>): ActionResult => r.body)
    );
  }

  /** Path part for operation `apiBizsGet()` */
  static readonly ApiBizsGetPath = '/api/bizs';

  /**
   * user calls this endpoint to get the list of the biz that are already existing in system.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBizsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBizsGet$Response(params?: ApiBizsGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<BizListResponse>>> {
    return apiBizsGet(this.http, this.rootUrl, params, context);
  }

  /**
   * user calls this endpoint to get the list of the biz that are already existing in system.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBizsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBizsGet(params?: ApiBizsGet$Params, context?: HttpContext): Observable<Array<BizListResponse>> {
    return this.apiBizsGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<BizListResponse>>): Array<BizListResponse> => r.body)
    );
  }

  /** Path part for operation `apiBizLoginGet()` */
  static readonly ApiBizLoginGetPath = '/api/biz/login';

  /**
   * login, for biz licensing portal, bceid login, sample: api/biz/login?bizId=123
   * or api/biz/login.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBizLoginGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBizLoginGet$Response(params?: ApiBizLoginGet$Params, context?: HttpContext): Observable<StrictHttpResponse<BizUserLoginResponse>> {
    return apiBizLoginGet(this.http, this.rootUrl, params, context);
  }

  /**
   * login, for biz licensing portal, bceid login, sample: api/biz/login?bizId=123
   * or api/biz/login.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBizLoginGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBizLoginGet(params?: ApiBizLoginGet$Params, context?: HttpContext): Observable<BizUserLoginResponse> {
    return this.apiBizLoginGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<BizUserLoginResponse>): BizUserLoginResponse => r.body)
    );
  }

  /** Path part for operation `apiBizBizIdManagerBizUserIdTermAgreeGet()` */
  static readonly ApiBizBizIdManagerBizUserIdTermAgreeGetPath = '/api/biz/{bizId}/manager/{bizUserId}/term-agree';

  /**
   * when manager select agree to the Term. Call this endpoint.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBizBizIdManagerBizUserIdTermAgreeGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBizBizIdManagerBizUserIdTermAgreeGet$Response(params: ApiBizBizIdManagerBizUserIdTermAgreeGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ActionResult>> {
    return apiBizBizIdManagerBizUserIdTermAgreeGet(this.http, this.rootUrl, params, context);
  }

  /**
   * when manager select agree to the Term. Call this endpoint.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBizBizIdManagerBizUserIdTermAgreeGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBizBizIdManagerBizUserIdTermAgreeGet(params: ApiBizBizIdManagerBizUserIdTermAgreeGet$Params, context?: HttpContext): Observable<ActionResult> {
    return this.apiBizBizIdManagerBizUserIdTermAgreeGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<ActionResult>): ActionResult => r.body)
    );
  }

}
