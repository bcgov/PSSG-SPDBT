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

import { OrgResponse } from '../models/org-response';
import { OrgUpdateRequest } from '../models/org-update-request';

@Injectable({
  providedIn: 'root',
})
export class OrgService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation apiOrgOrgIdGet
   */
  static readonly ApiOrgOrgIdGetPath = '/api/org/{orgId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgOrgIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgOrgIdGet$Response(params: {
    orgId: string;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<OrgResponse>> {

    const rb = new RequestBuilder(this.rootUrl, OrgService.ApiOrgOrgIdGetPath, 'get');
    if (params) {
      rb.path('orgId', params.orgId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<OrgResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiOrgOrgIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgOrgIdGet(params: {
    orgId: string;
    context?: HttpContext
  }
): Observable<OrgResponse> {

    return this.apiOrgOrgIdGet$Response(params).pipe(
      map((r: StrictHttpResponse<OrgResponse>) => r.body as OrgResponse)
    );
  }

  /**
   * Path part for operation apiOrgOrgIdPut
   */
  static readonly ApiOrgOrgIdPutPath = '/api/org/{orgId}';

  /**
   * Updating existing organization profile.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgOrgIdPut()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgOrgIdPut$Response(params: {
    orgId: string;
    context?: HttpContext
    body?: OrgUpdateRequest
  }
): Observable<StrictHttpResponse<OrgResponse>> {

    const rb = new RequestBuilder(this.rootUrl, OrgService.ApiOrgOrgIdPutPath, 'put');
    if (params) {
      rb.path('orgId', params.orgId, {});
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<OrgResponse>;
      })
    );
  }

  /**
   * Updating existing organization profile.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiOrgOrgIdPut$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgOrgIdPut(params: {
    orgId: string;
    context?: HttpContext
    body?: OrgUpdateRequest
  }
): Observable<OrgResponse> {

    return this.apiOrgOrgIdPut$Response(params).pipe(
      map((r: StrictHttpResponse<OrgResponse>) => r.body as OrgResponse)
    );
  }

}
