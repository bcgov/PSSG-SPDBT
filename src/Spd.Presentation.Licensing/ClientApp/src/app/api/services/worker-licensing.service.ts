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

import { LicenceAppDocumentResponse } from '../models/licence-app-document-response';
import { LicenceDocumentTypeCode } from '../models/licence-document-type-code';
import { WorkerLicenceAppListResponse } from '../models/worker-licence-app-list-response';
import { WorkerLicenceAppSubmitRequest } from '../models/worker-licence-app-submit-request';
import { WorkerLicenceAppUpsertRequest } from '../models/worker-licence-app-upsert-request';
import { WorkerLicenceAppUpsertResponse } from '../models/worker-licence-app-upsert-response';
import { WorkerLicenceResponse } from '../models/worker-licence-response';

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
   * Path part for operation apiWorkerLicenceApplicationsGet
   */
  static readonly ApiWorkerLicenceApplicationsGetPath = '/api/worker-licence-applications';

  /**
   * Get List of draft or InProgress Security Worker Licence Application.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiWorkerLicenceApplicationsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiWorkerLicenceApplicationsGet$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Array<WorkerLicenceAppListResponse>>> {

    const rb = new RequestBuilder(this.rootUrl, WorkerLicensingService.ApiWorkerLicenceApplicationsGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<WorkerLicenceAppListResponse>>;
      })
    );
  }

  /**
   * Get List of draft or InProgress Security Worker Licence Application.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiWorkerLicenceApplicationsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiWorkerLicenceApplicationsGet(params?: {
  },
  context?: HttpContext

): Observable<Array<WorkerLicenceAppListResponse>> {

    return this.apiWorkerLicenceApplicationsGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<Array<WorkerLicenceAppListResponse>>) => r.body as Array<WorkerLicenceAppListResponse>)
    );
  }

  /**
   * Path part for operation apiWorkerLicenceApplicationsPost
   */
  static readonly ApiWorkerLicenceApplicationsPostPath = '/api/worker-licence-applications';

  /**
   * Create Security Worker Licence Application.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiWorkerLicenceApplicationsPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiWorkerLicenceApplicationsPost$Response(params: {
    body: WorkerLicenceAppUpsertRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<WorkerLicenceAppUpsertResponse>> {

    const rb = new RequestBuilder(this.rootUrl, WorkerLicensingService.ApiWorkerLicenceApplicationsPostPath, 'post');
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
        return r as StrictHttpResponse<WorkerLicenceAppUpsertResponse>;
      })
    );
  }

  /**
   * Create Security Worker Licence Application.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiWorkerLicenceApplicationsPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiWorkerLicenceApplicationsPost(params: {
    body: WorkerLicenceAppUpsertRequest
  },
  context?: HttpContext

): Observable<WorkerLicenceAppUpsertResponse> {

    return this.apiWorkerLicenceApplicationsPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<WorkerLicenceAppUpsertResponse>) => r.body as WorkerLicenceAppUpsertResponse)
    );
  }

  /**
   * Path part for operation apiWorkerLicenceApplicationsLicenceAppIdGet
   */
  static readonly ApiWorkerLicenceApplicationsLicenceAppIdGetPath = '/api/worker-licence-applications/{licenceAppId}';

  /**
   * Get Security Worker Licence Application.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiWorkerLicenceApplicationsLicenceAppIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiWorkerLicenceApplicationsLicenceAppIdGet$Response(params: {
    licenceAppId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<WorkerLicenceResponse>> {

    const rb = new RequestBuilder(this.rootUrl, WorkerLicensingService.ApiWorkerLicenceApplicationsLicenceAppIdGetPath, 'get');
    if (params) {
      rb.path('licenceAppId', params.licenceAppId, {"style":"simple"});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<WorkerLicenceResponse>;
      })
    );
  }

  /**
   * Get Security Worker Licence Application.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiWorkerLicenceApplicationsLicenceAppIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiWorkerLicenceApplicationsLicenceAppIdGet(params: {
    licenceAppId: string;
  },
  context?: HttpContext

): Observable<WorkerLicenceResponse> {

    return this.apiWorkerLicenceApplicationsLicenceAppIdGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<WorkerLicenceResponse>) => r.body as WorkerLicenceResponse)
    );
  }

  /**
   * Path part for operation apiWorkerLicenceApplicationsLicenceAppIdFilesPost
   */
  static readonly ApiWorkerLicenceApplicationsLicenceAppIdFilesPostPath = '/api/worker-licence-applications/{licenceAppId}/files';

  /**
   * Upload licence application files.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiWorkerLicenceApplicationsLicenceAppIdFilesPost()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiWorkerLicenceApplicationsLicenceAppIdFilesPost$Response(params: {
    licenceAppId: string;
    body?: {
'Documents'?: Array<Blob>;
'LicenceDocumentTypeCode'?: LicenceDocumentTypeCode;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Array<LicenceAppDocumentResponse>>> {

    const rb = new RequestBuilder(this.rootUrl, WorkerLicensingService.ApiWorkerLicenceApplicationsLicenceAppIdFilesPostPath, 'post');
    if (params) {
      rb.path('licenceAppId', params.licenceAppId, {"style":"simple"});
      rb.body(params.body, 'multipart/form-data');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<LicenceAppDocumentResponse>>;
      })
    );
  }

  /**
   * Upload licence application files.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiWorkerLicenceApplicationsLicenceAppIdFilesPost$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiWorkerLicenceApplicationsLicenceAppIdFilesPost(params: {
    licenceAppId: string;
    body?: {
'Documents'?: Array<Blob>;
'LicenceDocumentTypeCode'?: LicenceDocumentTypeCode;
}
  },
  context?: HttpContext

): Observable<Array<LicenceAppDocumentResponse>> {

    return this.apiWorkerLicenceApplicationsLicenceAppIdFilesPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<Array<LicenceAppDocumentResponse>>) => r.body as Array<LicenceAppDocumentResponse>)
    );
  }

  /**
   * Path part for operation apiWorkerLicenceApplicationsSubmitPost
   */
  static readonly ApiWorkerLicenceApplicationsSubmitPostPath = '/api/worker-licence-applications/submit';

  /**
   * Submit Security Worker Licence Application.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiWorkerLicenceApplicationsSubmitPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiWorkerLicenceApplicationsSubmitPost$Response(params: {
    body: WorkerLicenceAppSubmitRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<WorkerLicenceAppUpsertResponse>> {

    const rb = new RequestBuilder(this.rootUrl, WorkerLicensingService.ApiWorkerLicenceApplicationsSubmitPostPath, 'post');
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
        return r as StrictHttpResponse<WorkerLicenceAppUpsertResponse>;
      })
    );
  }

  /**
   * Submit Security Worker Licence Application.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiWorkerLicenceApplicationsSubmitPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiWorkerLicenceApplicationsSubmitPost(params: {
    body: WorkerLicenceAppSubmitRequest
  },
  context?: HttpContext

): Observable<WorkerLicenceAppUpsertResponse> {

    return this.apiWorkerLicenceApplicationsSubmitPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<WorkerLicenceAppUpsertResponse>) => r.body as WorkerLicenceAppUpsertResponse)
    );
  }

  /**
   * Path part for operation apiWorkerLicenceApplicationsSubmitAnonymousPost
   */
  static readonly ApiWorkerLicenceApplicationsSubmitAnonymousPostPath = '/api/worker-licence-applications/submit/anonymous';

  /**
   * Submit Security Worker Licence Application Anonymously.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiWorkerLicenceApplicationsSubmitAnonymousPost()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiWorkerLicenceApplicationsSubmitAnonymousPost$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<WorkerLicenceAppUpsertResponse>> {

    const rb = new RequestBuilder(this.rootUrl, WorkerLicensingService.ApiWorkerLicenceApplicationsSubmitAnonymousPostPath, 'post');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<WorkerLicenceAppUpsertResponse>;
      })
    );
  }

  /**
   * Submit Security Worker Licence Application Anonymously.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiWorkerLicenceApplicationsSubmitAnonymousPost$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiWorkerLicenceApplicationsSubmitAnonymousPost(params?: {
  },
  context?: HttpContext

): Observable<WorkerLicenceAppUpsertResponse> {

    return this.apiWorkerLicenceApplicationsSubmitAnonymousPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<WorkerLicenceAppUpsertResponse>) => r.body as WorkerLicenceAppUpsertResponse)
    );
  }

}
