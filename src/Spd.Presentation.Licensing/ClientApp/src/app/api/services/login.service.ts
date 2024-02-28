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

import { ApplicantLoginResponse } from '../models/applicant-login-response';

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

}
