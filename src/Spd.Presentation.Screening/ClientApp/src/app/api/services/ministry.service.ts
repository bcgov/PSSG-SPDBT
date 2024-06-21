/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { apiMinistriesGet } from '../fn/ministry/api-ministries-get';
import { ApiMinistriesGet$Params } from '../fn/ministry/api-ministries-get';
import { MinistryResponse } from '../models/ministry-response';

@Injectable({ providedIn: 'root' })
export class MinistryService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `apiMinistriesGet()` */
  static readonly ApiMinistriesGetPath = '/api/ministries';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiMinistriesGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiMinistriesGet$Response(params?: ApiMinistriesGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<MinistryResponse>>> {
    return apiMinistriesGet(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiMinistriesGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiMinistriesGet(params?: ApiMinistriesGet$Params, context?: HttpContext): Observable<Array<MinistryResponse>> {
    return this.apiMinistriesGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<MinistryResponse>>): Array<MinistryResponse> => r.body)
    );
  }

}
