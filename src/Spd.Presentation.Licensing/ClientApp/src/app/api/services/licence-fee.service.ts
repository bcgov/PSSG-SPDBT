/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { apiLicenceFeeGet } from '../fn/licence-fee/api-licence-fee-get';
import { ApiLicenceFeeGet$Params } from '../fn/licence-fee/api-licence-fee-get';
import { LicenceFeeListResponse } from '../models/licence-fee-list-response';

@Injectable({ providedIn: 'root' })
export class LicenceFeeService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `apiLicenceFeeGet()` */
  static readonly ApiLicenceFeeGetPath = '/api/licence-fee';

  /**
   * Get licence fee
   * Sample: api/licence-fee?serviceTypeCode=SecurityWorkerLicence.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiLicenceFeeGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiLicenceFeeGet$Response(params?: ApiLicenceFeeGet$Params, context?: HttpContext): Observable<StrictHttpResponse<LicenceFeeListResponse>> {
    return apiLicenceFeeGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Get licence fee
   * Sample: api/licence-fee?serviceTypeCode=SecurityWorkerLicence.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiLicenceFeeGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiLicenceFeeGet(params?: ApiLicenceFeeGet$Params, context?: HttpContext): Observable<LicenceFeeListResponse> {
    return this.apiLicenceFeeGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<LicenceFeeListResponse>): LicenceFeeListResponse => r.body)
    );
  }

}
