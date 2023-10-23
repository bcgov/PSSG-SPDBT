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
   * To access only the response body, use `apiConfigurationGet$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiConfigurationGet$Plain$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ConfigurationResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ConfigurationService.ApiConfigurationGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain',
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
   * To access the full response (for headers, for example), `apiConfigurationGet$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiConfigurationGet$Plain(params?: {
  },
  context?: HttpContext

): Observable<ConfigurationResponse> {

    return this.apiConfigurationGet$Plain$Response(params,context).pipe(
      map((r: StrictHttpResponse<ConfigurationResponse>) => r.body as ConfigurationResponse)
    );
  }

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiConfigurationGet$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiConfigurationGet$Json$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ConfigurationResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ConfigurationService.ApiConfigurationGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json',
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
   * To access the full response (for headers, for example), `apiConfigurationGet$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiConfigurationGet$Json(params?: {
  },
  context?: HttpContext

): Observable<ConfigurationResponse> {

    return this.apiConfigurationGet$Json$Response(params,context).pipe(
      map((r: StrictHttpResponse<ConfigurationResponse>) => r.body as ConfigurationResponse)
    );
  }

}
