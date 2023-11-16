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

import { LicenceFeeListResponse } from '../models/licence-fee-list-response';
import { WorkerLicenceTypeCode } from '../models/worker-licence-type-code';

@Injectable({
  providedIn: 'root',
})
export class LicenceFeeService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation apiLicenceFeeWorkerLicenceTypeCodeGet
   */
  static readonly ApiLicenceFeeWorkerLicenceTypeCodeGetPath = '/api/licence-fee/{workerLicenceTypeCode}';

  /**
   * Get licence fee.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiLicenceFeeWorkerLicenceTypeCodeGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiLicenceFeeWorkerLicenceTypeCodeGet$Response(params: {
    workerLicenceTypeCode: WorkerLicenceTypeCode;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<LicenceFeeListResponse>> {

    const rb = new RequestBuilder(this.rootUrl, LicenceFeeService.ApiLicenceFeeWorkerLicenceTypeCodeGetPath, 'get');
    if (params) {
      rb.path('workerLicenceTypeCode', params.workerLicenceTypeCode, {"style":"simple"});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<LicenceFeeListResponse>;
      })
    );
  }

  /**
   * Get licence fee.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiLicenceFeeWorkerLicenceTypeCodeGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiLicenceFeeWorkerLicenceTypeCodeGet(params: {
    workerLicenceTypeCode: WorkerLicenceTypeCode;
  },
  context?: HttpContext

): Observable<LicenceFeeListResponse> {

    return this.apiLicenceFeeWorkerLicenceTypeCodeGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<LicenceFeeListResponse>) => r.body as LicenceFeeListResponse)
    );
  }

}
