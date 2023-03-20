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

import { CurrentUserInfo } from '../models/current-user-info';

@Injectable({
  providedIn: 'root',
})
export class CurrentUserService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation apiWhoamiGet
   */
  static readonly ApiWhoamiGetPath = '/api/whoami';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiWhoamiGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiWhoamiGet$Response(params?: {
    context?: HttpContext
  }
): Observable<StrictHttpResponse<CurrentUserInfo>> {

    const rb = new RequestBuilder(this.rootUrl, CurrentUserService.ApiWhoamiGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<CurrentUserInfo>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiWhoamiGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiWhoamiGet(params?: {
    context?: HttpContext
  }
): Observable<CurrentUserInfo> {

    return this.apiWhoamiGet$Response(params).pipe(
      map((r: StrictHttpResponse<CurrentUserInfo>) => r.body as CurrentUserInfo)
    );
  }

}
