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

import { BCeIdConfigurationResponse } from '../models/b-ce-id-configuration-response';

@Injectable({
  providedIn: 'root',
})
export class BCeIdConfigurationService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation apiBceidConfigurationGet
   */
  static readonly ApiBceidConfigurationGetPath = '/api/bceid-configuration';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBceidConfigurationGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBceidConfigurationGet$Response(params?: {
    context?: HttpContext
  }
): Observable<StrictHttpResponse<BCeIdConfigurationResponse>> {

    const rb = new RequestBuilder(this.rootUrl, BCeIdConfigurationService.ApiBceidConfigurationGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<BCeIdConfigurationResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiBceidConfigurationGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBceidConfigurationGet(params?: {
    context?: HttpContext
  }
): Observable<BCeIdConfigurationResponse> {

    return this.apiBceidConfigurationGet$Response(params).pipe(
      map((r: StrictHttpResponse<BCeIdConfigurationResponse>) => r.body as BCeIdConfigurationResponse)
    );
  }

}
