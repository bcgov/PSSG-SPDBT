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

import { UserProfileResponse } from '../models/user-profile-response';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation apiUserGet
   */
  static readonly ApiUserGetPath = '/api/user';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiUserGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiUserGet$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<UserProfileResponse>> {

    const rb = new RequestBuilder(this.rootUrl, UserProfileService.ApiUserGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<UserProfileResponse>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiUserGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiUserGet(params?: {
  },
  context?: HttpContext

): Observable<UserProfileResponse> {

    return this.apiUserGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<UserProfileResponse>) => r.body as UserProfileResponse)
    );
  }

}
