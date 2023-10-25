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

import { ConfigurationResponse } from '../models/configuration-response';
import { InvalidWorkerLicenceCategoryMatrixConfiguration } from '../models/invalid-worker-licence-category-matrix-configuration';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation apiConfigurationGet
   */
  static readonly ApiConfigurationGetPath = '/api/configuration';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiConfigurationGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiConfigurationGet$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ConfigurationResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ConfigurationService.ApiConfigurationGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ConfigurationResponse>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiConfigurationGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiConfigurationGet(params?: {
  },
  context?: HttpContext

): Observable<ConfigurationResponse> {

    return this.apiConfigurationGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<ConfigurationResponse>) => r.body as ConfigurationResponse)
    );
  }

  /**
   * Path part for operation apiInvalidCategoryMatrixGet
   */
  static readonly ApiInvalidCategoryMatrixGetPath = '/api/invalid-category-matrix';

  /**
   * Get Invalid Security Worker licence category combination Matrix.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiInvalidCategoryMatrixGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiInvalidCategoryMatrixGet$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<InvalidWorkerLicenceCategoryMatrixConfiguration>> {

    const rb = new RequestBuilder(this.rootUrl, ConfigurationService.ApiInvalidCategoryMatrixGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<InvalidWorkerLicenceCategoryMatrixConfiguration>;
      })
    );
  }

  /**
   * Get Invalid Security Worker licence category combination Matrix.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiInvalidCategoryMatrixGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiInvalidCategoryMatrixGet(params?: {
  },
  context?: HttpContext

): Observable<InvalidWorkerLicenceCategoryMatrixConfiguration> {

    return this.apiInvalidCategoryMatrixGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<InvalidWorkerLicenceCategoryMatrixConfiguration>) => r.body as InvalidWorkerLicenceCategoryMatrixConfiguration)
    );
  }

}
