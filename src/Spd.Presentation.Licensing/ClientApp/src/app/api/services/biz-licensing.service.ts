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

import { BizLicenceAppUpsertRequest } from '../models/biz-licence-app-upsert-request';
import { Unit } from '../models/unit';

@Injectable({
  providedIn: 'root',
})
export class BizLicensingService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation apiBusinessLicencePost
   */
  static readonly ApiBusinessLicencePostPath = '/api/business-licence';

  /**
   * Save Business Licence Application.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBusinessLicencePost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiBusinessLicencePost$Response(params: {
    body: BizLicenceAppUpsertRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Unit>> {

    const rb = new RequestBuilder(this.rootUrl, BizLicensingService.ApiBusinessLicencePostPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Unit>;
      })
    );
  }

  /**
   * Save Business Licence Application.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBusinessLicencePost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiBusinessLicencePost(params: {
    body: BizLicenceAppUpsertRequest
  },
  context?: HttpContext

): Observable<Unit> {

    return this.apiBusinessLicencePost$Response(params,context).pipe(
      map((r: StrictHttpResponse<Unit>) => r.body as Unit)
    );
  }

}