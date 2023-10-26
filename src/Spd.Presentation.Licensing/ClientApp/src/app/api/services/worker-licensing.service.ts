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

import { WorkerLicenceCreateRequest } from '../models/worker-licence-create-request';
import { WorkerLicenceCreateResponse } from '../models/worker-licence-create-response';

@Injectable({
  providedIn: 'root',
})
export class WorkerLicensingService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation apiWorkerLicencesPost
   */
  static readonly ApiWorkerLicencesPostPath = '/api/worker-licences';

  /**
   * Create Security Worker Licence Application.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiWorkerLicencesPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiWorkerLicencesPost$Response(params: {
    body: WorkerLicenceCreateRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<WorkerLicenceCreateResponse>> {

    const rb = new RequestBuilder(this.rootUrl, WorkerLicensingService.ApiWorkerLicencesPostPath, 'post');
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
        return r as StrictHttpResponse<WorkerLicenceCreateResponse>;
      })
    );
  }

  /**
   * Create Security Worker Licence Application.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiWorkerLicencesPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiWorkerLicencesPost(params: {
    body: WorkerLicenceCreateRequest
  },
  context?: HttpContext

): Observable<WorkerLicenceCreateResponse> {

    return this.apiWorkerLicencesPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<WorkerLicenceCreateResponse>) => r.body as WorkerLicenceCreateResponse)
    );
  }

  /**
   * Path part for operation apiAnonymousWorkerLicencesPost
   */
  static readonly ApiAnonymousWorkerLicencesPostPath = '/api/anonymous-worker-licences';

  /**
   * Create Security Worker Licence Application Anonymously.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiAnonymousWorkerLicencesPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiAnonymousWorkerLicencesPost$Response(params: {
    body: WorkerLicenceCreateRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<WorkerLicenceCreateResponse>> {

    const rb = new RequestBuilder(this.rootUrl, WorkerLicensingService.ApiAnonymousWorkerLicencesPostPath, 'post');
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
        return r as StrictHttpResponse<WorkerLicenceCreateResponse>;
      })
    );
  }

  /**
   * Create Security Worker Licence Application Anonymously.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiAnonymousWorkerLicencesPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiAnonymousWorkerLicencesPost(params: {
    body: WorkerLicenceCreateRequest
  },
  context?: HttpContext

): Observable<WorkerLicenceCreateResponse> {

    return this.apiAnonymousWorkerLicencesPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<WorkerLicenceCreateResponse>) => r.body as WorkerLicenceCreateResponse)
    );
  }

}
