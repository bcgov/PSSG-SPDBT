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

import { ApplicantProfileResponse } from '../models/applicant-profile-response';
import { UserProfileResponse } from '../models/user-profile-response';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation apiUsersWhoamiGet
   */
  static readonly ApiUsersWhoamiGetPath = '/api/users/whoami';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiUsersWhoamiGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiUsersWhoamiGet$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<UserProfileResponse>> {

    const rb = new RequestBuilder(this.rootUrl, UserProfileService.ApiUsersWhoamiGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<UserProfileResponse>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiUsersWhoamiGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiUsersWhoamiGet(params?: {
  },
  context?: HttpContext

): Observable<UserProfileResponse> {

    return this.apiUsersWhoamiGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<UserProfileResponse>) => r.body as UserProfileResponse)
    );
  }

  /**
   * Path part for operation apiApplicantsWhoamiGet
   */
  static readonly ApiApplicantsWhoamiGetPath = '/api/applicants/whoami';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiApplicantsWhoamiGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsWhoamiGet$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ApplicantProfileResponse>> {

    const rb = new RequestBuilder(this.rootUrl, UserProfileService.ApiApplicantsWhoamiGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ApplicantProfileResponse>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiApplicantsWhoamiGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsWhoamiGet(params?: {
  },
  context?: HttpContext

): Observable<ApplicantProfileResponse> {

    return this.apiApplicantsWhoamiGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<ApplicantProfileResponse>) => r.body as ApplicantProfileResponse)
    );
  }

}
