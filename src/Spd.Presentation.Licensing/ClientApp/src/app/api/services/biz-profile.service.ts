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

import { BizProfileResponse } from '../models/biz-profile-response';

@Injectable({
  providedIn: 'root',
})
export class BizProfileService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation apiBizIdGet
   */
  static readonly ApiBizIdGetPath = '/api/biz/{id}';

  /**
   * Get Business profile.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBizIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBizIdGet$Response(params: {
    id: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<BizProfileResponse>> {

    const rb = new RequestBuilder(this.rootUrl, BizProfileService.ApiBizIdGetPath, 'get');
    if (params) {
      rb.path('id', params.id, {"style":"simple"});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<BizProfileResponse>;
      })
    );
  }

  /**
   * Get Business profile.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBizIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBizIdGet(params: {
    id: string;
  },
  context?: HttpContext

): Observable<BizProfileResponse> {

    return this.apiBizIdGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<BizProfileResponse>) => r.body as BizProfileResponse)
    );
  }

}
