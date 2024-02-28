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
   * Get.
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
   * Get.
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

}
