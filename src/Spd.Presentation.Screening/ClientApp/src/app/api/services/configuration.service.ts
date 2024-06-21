/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { apiConfigurationGet } from '../fn/configuration/api-configuration-get';
import { ApiConfigurationGet$Params } from '../fn/configuration/api-configuration-get';
import { ConfigurationResponse } from '../models/configuration-response';

@Injectable({ providedIn: 'root' })
export class ConfigurationService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `apiConfigurationGet()` */
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
  apiConfigurationGet$Response(params?: ApiConfigurationGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ConfigurationResponse>> {
    return apiConfigurationGet(this.http, this.rootUrl, params, context);
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
  apiConfigurationGet(params?: ApiConfigurationGet$Params, context?: HttpContext): Observable<ConfigurationResponse> {
    return this.apiConfigurationGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<ConfigurationResponse>): ConfigurationResponse => r.body)
    );
  }

}
