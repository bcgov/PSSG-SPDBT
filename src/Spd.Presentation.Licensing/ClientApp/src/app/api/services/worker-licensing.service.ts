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

import { LicenceAppFileCreateResponse } from '../models/licence-app-file-create-response';
import { LicenceDocumentTypeCode } from '../models/licence-document-type-code';
import { WorkerLicenceResponse } from '../models/worker-licence-response';
import { WorkerLicenceUpsertRequest } from '../models/worker-licence-upsert-request';
import { WorkerLicenceUpsertResponse } from '../models/worker-licence-upsert-response';

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
    body: WorkerLicenceUpsertRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<WorkerLicenceUpsertResponse>> {

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
        return r as StrictHttpResponse<WorkerLicenceUpsertResponse>;
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
    body: WorkerLicenceUpsertRequest
  },
  context?: HttpContext

): Observable<WorkerLicenceUpsertResponse> {

    return this.apiWorkerLicenceApplicationsPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<WorkerLicenceUpsertResponse>) => r.body as WorkerLicenceUpsertResponse)
    );
  }

  /**
   * Path part for operation apiWorkerLicenceApplicationsIdGet
   */
  static readonly ApiWorkerLicenceApplicationsIdGetPath = '/api/worker-licence-applications/{id}';

  /**
   * Create Security Worker Licence Application.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiWorkerLicenceApplicationsIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiWorkerLicenceApplicationsIdGet$Response(params: {
    id: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<WorkerLicenceResponse>> {

    const rb = new RequestBuilder(this.rootUrl, WorkerLicensingService.ApiWorkerLicenceApplicationsIdGetPath, 'get');
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
        return r as StrictHttpResponse<WorkerLicenceResponse>;
      })
    );
  }

  /**
   * Create Security Worker Licence Application.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiWorkerLicenceApplicationsIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiWorkerLicenceApplicationsIdGet(params: {
    id: string;
  },
  context?: HttpContext

): Observable<WorkerLicenceResponse> {

    return this.apiWorkerLicenceApplicationsIdGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<WorkerLicenceResponse>) => r.body as WorkerLicenceResponse)
    );
  }

  /**
   * Path part for operation apiWorkerLicenceApplicationsIdFilesPost
   */
  static readonly ApiWorkerLicenceApplicationsIdFilesPostPath = '/api/worker-licence-applications/{id}/files';

  /**
   * Upload licence application files.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiWorkerLicenceApplicationsIdFilesPost()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiWorkerLicenceApplicationsIdFilesPost$Response(params: {
    id: string;
    body?: {
'Files'?: Array<Blob>;
'LicenceDocumentTypeCode'?: LicenceDocumentTypeCode;
'ExpiryDate'?: string;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Array<LicenceAppFileCreateResponse>>> {

    const rb = new RequestBuilder(this.rootUrl, WorkerLicensingService.ApiWorkerLicenceApplicationsIdFilesPostPath, 'post');
    if (params) {
      rb.path('id', params.id, {"style":"simple"});
      rb.body(params.body, 'multipart/form-data');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<LicenceAppFileCreateResponse>>;
      })
    );
  }

  /**
   * Upload licence application files.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiWorkerLicenceApplicationsIdFilesPost$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiWorkerLicenceApplicationsIdFilesPost(params: {
    id: string;
    body?: {
'Files'?: Array<Blob>;
'LicenceDocumentTypeCode'?: LicenceDocumentTypeCode;
'ExpiryDate'?: string;
}
  },
  context?: HttpContext

): Observable<Array<LicenceAppFileCreateResponse>> {

    return this.apiWorkerLicenceApplicationsIdFilesPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<Array<LicenceAppFileCreateResponse>>) => r.body as Array<LicenceAppFileCreateResponse>)
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
    body: WorkerLicenceUpsertRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<WorkerLicenceUpsertResponse>> {

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
        return r as StrictHttpResponse<WorkerLicenceUpsertResponse>;
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
    body: WorkerLicenceUpsertRequest
  },
  context?: HttpContext

): Observable<WorkerLicenceUpsertResponse> {

    return this.apiAnonymousWorkerLicencesPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<WorkerLicenceUpsertResponse>) => r.body as WorkerLicenceUpsertResponse)
    );
  }

}
