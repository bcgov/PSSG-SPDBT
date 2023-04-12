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
   * Path part for operation apiUserProfileWhoamiGet
   */
  static readonly ApiUserProfileWhoamiGetPath = '/api/user-profile/whoami';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiUserProfileWhoamiGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiUserProfileWhoamiGet$Response(params?: {
    context?: HttpContext
  }
): Observable<StrictHttpResponse<UserProfileResponse>> {

    const rb = new RequestBuilder(this.rootUrl, UserProfileService.ApiUserProfileWhoamiGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<UserProfileResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiUserProfileWhoamiGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiUserProfileWhoamiGet(params?: {
    context?: HttpContext
  }
): Observable<UserProfileResponse> {

    return this.apiUserProfileWhoamiGet$Response(params).pipe(
      map((r: StrictHttpResponse<UserProfileResponse>) => r.body as UserProfileResponse)
    );
  }

}
