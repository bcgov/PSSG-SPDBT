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
import { ApplicantLoginResponse } from '../models/applicant-login-response';
import { BizListResponse } from '../models/biz-list-response';
import { BizUserLoginResponse } from '../models/biz-user-login-response';

@Injectable({
  providedIn: 'root',
})
export class LoginService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation apiApplicantLoginGet
   */
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
  apiApplicantLoginGet$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ApplicantLoginResponse>> {

    const rb = new RequestBuilder(this.rootUrl, LoginService.ApiApplicantLoginGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ApplicantLoginResponse>;
      })
    );
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
  apiApplicantLoginGet(params?: {
  },
  context?: HttpContext

): Observable<ApplicantLoginResponse> {

    return this.apiApplicantLoginGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<ApplicantLoginResponse>) => r.body as ApplicantLoginResponse)
    );
  }

  /**
   * Path part for operation apiApplicantApplicantIdTermAgreeGet
   */
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
  apiApplicantApplicantIdTermAgreeGet$Response(params: {
    applicantId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ActionResult>> {

    const rb = new RequestBuilder(this.rootUrl, LoginService.ApiApplicantApplicantIdTermAgreeGetPath, 'get');
    if (params) {
      rb.path('applicantId', params.applicantId, {"style":"simple"});
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
   * when user select agree to the Term. Call this endpoint.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiApplicantApplicantIdTermAgreeGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantApplicantIdTermAgreeGet(params: {
    applicantId: string;
  },
  context?: HttpContext

): Observable<ActionResult> {

    return this.apiApplicantApplicantIdTermAgreeGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<ActionResult>) => r.body as ActionResult)
    );
  }

  /**
   * Path part for operation apiBizsGet
   */
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
  apiBizsGet$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Array<BizListResponse>>> {

    const rb = new RequestBuilder(this.rootUrl, LoginService.ApiBizsGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<BizListResponse>>;
      })
    );
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
  apiBizsGet(params?: {
  },
  context?: HttpContext

): Observable<Array<BizListResponse>> {

    return this.apiBizsGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<Array<BizListResponse>>) => r.body as Array<BizListResponse>)
    );
  }

  /**
   * Path part for operation apiBizBizIdLoginGet
   */
  static readonly ApiBizBizIdLoginGetPath = '/api/biz/{bizId}/login';

  /**
   * login, for biz licensing portal, bceid login.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBizBizIdLoginGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBizBizIdLoginGet$Response(params: {
    bizId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<BizUserLoginResponse>> {

    const rb = new RequestBuilder(this.rootUrl, LoginService.ApiBizBizIdLoginGetPath, 'get');
    if (params) {
      rb.path('bizId', params.bizId, {"style":"simple"});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<BizUserLoginResponse>;
      })
    );
  }

  /**
   * login, for biz licensing portal, bceid login.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBizBizIdLoginGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBizBizIdLoginGet(params: {
    bizId: string;
  },
  context?: HttpContext

): Observable<BizUserLoginResponse> {

    return this.apiBizBizIdLoginGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<BizUserLoginResponse>) => r.body as BizUserLoginResponse)
    );
  }

  /**
   * Path part for operation apiBizBizIdManagerBizUserIdTermAgreeGet
   */
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
  apiBizBizIdManagerBizUserIdTermAgreeGet$Response(params: {
    bizId: string;
    bizUserId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ActionResult>> {

    const rb = new RequestBuilder(this.rootUrl, LoginService.ApiBizBizIdManagerBizUserIdTermAgreeGetPath, 'get');
    if (params) {
      rb.path('bizId', params.bizId, {"style":"simple"});
      rb.path('bizUserId', params.bizUserId, {"style":"simple"});
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
   * when manager select agree to the Term. Call this endpoint.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBizBizIdManagerBizUserIdTermAgreeGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBizBizIdManagerBizUserIdTermAgreeGet(params: {
    bizId: string;
    bizUserId: string;
  },
  context?: HttpContext

): Observable<ActionResult> {

    return this.apiBizBizIdManagerBizUserIdTermAgreeGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<ActionResult>) => r.body as ActionResult)
    );
  }

}
