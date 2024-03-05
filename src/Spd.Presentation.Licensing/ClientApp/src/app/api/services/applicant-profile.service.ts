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

import { ApplicantListResponse } from '../models/applicant-list-response';
import { ApplicantProfileResponse } from '../models/applicant-profile-response';

@Injectable({
  providedIn: 'root',
})
export class ApplicantProfileService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation apiApplicantIdGet
   */
  static readonly ApiApplicantIdGetPath = '/api/applicant/{id}';

  /**
   * Get applicant profile.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiApplicantIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantIdGet$Response(params: {
    id: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ApplicantProfileResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicantProfileService.ApiApplicantIdGetPath, 'get');
    if (params) {
      rb.path('id', params.id, {"style":"simple"});
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
   * Get applicant profile.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiApplicantIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantIdGet(params: {
    id: string;
  },
  context?: HttpContext

): Observable<ApplicantProfileResponse> {

    return this.apiApplicantIdGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<ApplicantProfileResponse>) => r.body as ApplicantProfileResponse)
    );
  }

  /**
   * Path part for operation apiApplicantSearchGet
   */
  static readonly ApiApplicantSearchGetPath = '/api/applicant/search';

  /**
   * Get applicants who has the same name and birthday as login person.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiApplicantSearchGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantSearchGet$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Array<ApplicantListResponse>>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicantProfileService.ApiApplicantSearchGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<ApplicantListResponse>>;
      })
    );
  }

  /**
   * Get applicants who has the same name and birthday as login person.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiApplicantSearchGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantSearchGet(params?: {
  },
  context?: HttpContext

): Observable<Array<ApplicantListResponse>> {

    return this.apiApplicantSearchGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<Array<ApplicantListResponse>>) => r.body as Array<ApplicantListResponse>)
    );
  }

}
