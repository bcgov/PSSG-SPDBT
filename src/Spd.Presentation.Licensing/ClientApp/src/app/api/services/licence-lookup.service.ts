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

import { LicenceLookupResponse } from '../models/licence-lookup-response';

@Injectable({
  providedIn: 'root',
})
export class LicenceLookupService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation apiLicenceLookupLicenceNumberGet
   */
  static readonly ApiLicenceLookupLicenceNumberGetPath = '/api/licence-lookup/{licenceNumber}';

  /**
   * Get licence by licence number
   * Example: http://localhost:5114/api/licence-lookup/TEST-02?accessCode=TEST.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiLicenceLookupLicenceNumberGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiLicenceLookupLicenceNumberGet$Response(params: {
    licenceNumber: string;
    accessCode?: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<LicenceLookupResponse>> {

    const rb = new RequestBuilder(this.rootUrl, LicenceLookupService.ApiLicenceLookupLicenceNumberGetPath, 'get');
    if (params) {
      rb.path('licenceNumber', params.licenceNumber, {"style":"simple"});
      rb.query('accessCode', params.accessCode, {"style":"form"});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<LicenceLookupResponse>;
      })
    );
  }

  /**
   * Get licence by licence number
   * Example: http://localhost:5114/api/licence-lookup/TEST-02?accessCode=TEST.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiLicenceLookupLicenceNumberGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiLicenceLookupLicenceNumberGet(params: {
    licenceNumber: string;
    accessCode?: string;
  },
  context?: HttpContext

): Observable<LicenceLookupResponse> {

    return this.apiLicenceLookupLicenceNumberGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<LicenceLookupResponse>) => r.body as LicenceLookupResponse)
    );
  }

}
