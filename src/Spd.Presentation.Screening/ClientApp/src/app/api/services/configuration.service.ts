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
   * Return the configuration FE needs.
   * The environment value could be: Development, Production, Staging,Test, Training.
   *
   *
   *
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
   * Return the configuration FE needs.
   * The environment value could be: Development, Production, Staging,Test, Training.
   *
   *
   *
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

}
