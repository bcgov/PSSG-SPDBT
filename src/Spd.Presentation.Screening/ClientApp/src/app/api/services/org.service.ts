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
   * Path part for operation apiOrgsOrgIdGet
   */
  static readonly ApiOrgsOrgIdGetPath = '/api/orgs/{orgId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdGet$Response(params: {
    orgId: string;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<OrgResponse>> {

    const rb = new RequestBuilder(this.rootUrl, OrgService.ApiOrgsOrgIdGetPath, 'get');
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
   * To access the full response (for headers, for example), `apiOrgsOrgIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdGet(params: {
    orgId: string;
    context?: HttpContext
  }
): Observable<OrgResponse> {

    return this.apiOrgsOrgIdGet$Response(params).pipe(
      map((r: StrictHttpResponse<OrgResponse>) => r.body as OrgResponse)
    );
  }

  /**
   * Path part for operation apiOrgsOrgIdPut
   */
  static readonly ApiOrgsOrgIdPutPath = '/api/orgs/{orgId}';

  /**
   * Updating existing organization profile.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdPut()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgsOrgIdPut$Response(params: {
    orgId: string;
    context?: HttpContext
    body?: OrgUpdateRequest
  }
): Observable<StrictHttpResponse<OrgResponse>> {

    const rb = new RequestBuilder(this.rootUrl, OrgService.ApiOrgsOrgIdPutPath, 'put');
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
   * To access the full response (for headers, for example), `apiOrgsOrgIdPut$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgsOrgIdPut(params: {
    orgId: string;
    context?: HttpContext
    body?: OrgUpdateRequest
  }
): Observable<OrgResponse> {

    return this.apiOrgsOrgIdPut$Response(params).pipe(
      map((r: StrictHttpResponse<OrgResponse>) => r.body as OrgResponse)
    );
  }

}
