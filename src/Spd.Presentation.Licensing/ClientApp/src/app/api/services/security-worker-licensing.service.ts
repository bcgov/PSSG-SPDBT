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

import { GoogleRecaptcha } from '../models/google-recaptcha';
import { IActionResult } from '../models/i-action-result';
import { LicenceAppDocumentResponse } from '../models/licence-app-document-response';
import { LicenceDocumentTypeCode } from '../models/licence-document-type-code';
import { WorkerLicenceAppResponse } from '../models/worker-licence-app-response';
import { WorkerLicenceAppSubmitRequest } from '../models/worker-licence-app-submit-request';
import { WorkerLicenceAppUpsertRequest } from '../models/worker-licence-app-upsert-request';
import { WorkerLicenceCommandResponse } from '../models/worker-licence-command-response';

@Injectable({
  providedIn: 'root',
})
export class SecurityWorkerLicensingService extends BaseService {
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
   * Create Security Worker Licence Application, the DocumentInfos under WorkerLicenceAppUpsertRequest should contain all documents this application needs. If the document
   * is not needed for this application, then remove it from documentInfos.
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

): Observable<StrictHttpResponse<WorkerLicenceCommandResponse>> {

    const rb = new RequestBuilder(this.rootUrl, SecurityWorkerLicensingService.ApiWorkerLicenceApplicationsPostPath, 'post');
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
        return r as StrictHttpResponse<WorkerLicenceCommandResponse>;
      })
    );
  }

  /**
   * Create Security Worker Licence Application, the DocumentInfos under WorkerLicenceAppUpsertRequest should contain all documents this application needs. If the document
   * is not needed for this application, then remove it from documentInfos.
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

): Observable<WorkerLicenceCommandResponse> {

    return this.apiWorkerLicenceApplicationsPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<WorkerLicenceCommandResponse>) => r.body as WorkerLicenceCommandResponse)
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

): Observable<StrictHttpResponse<WorkerLicenceAppResponse>> {

    const rb = new RequestBuilder(this.rootUrl, SecurityWorkerLicensingService.ApiWorkerLicenceApplicationsLicenceAppIdGetPath, 'get');
    if (params) {
      rb.path('licenceAppId', params.licenceAppId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<WorkerLicenceAppResponse>;
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

): Observable<WorkerLicenceAppResponse> {

    return this.apiWorkerLicenceApplicationsLicenceAppIdGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<WorkerLicenceAppResponse>) => r.body as WorkerLicenceAppResponse)
    );
  }

  /**
   * Path part for operation apiApplicantsApplicantIdSwlLatestGet
   */
  static readonly ApiApplicantsApplicantIdSwlLatestGetPath = '/api/applicants/{applicantId}/swl-latest';

  /**
   * Get Lastest Security Worker Licence Application.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiApplicantsApplicantIdSwlLatestGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsApplicantIdSwlLatestGet$Response(params: {
    applicantId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<WorkerLicenceAppResponse>> {

    const rb = new RequestBuilder(this.rootUrl, SecurityWorkerLicensingService.ApiApplicantsApplicantIdSwlLatestGetPath, 'get');
    if (params) {
      rb.path('applicantId', params.applicantId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<WorkerLicenceAppResponse>;
      })
    );
  }

  /**
   * Get Lastest Security Worker Licence Application.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiApplicantsApplicantIdSwlLatestGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsApplicantIdSwlLatestGet(params: {
    applicantId: string;
  },
  context?: HttpContext

): Observable<WorkerLicenceAppResponse> {

    return this.apiApplicantsApplicantIdSwlLatestGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<WorkerLicenceAppResponse>) => r.body as WorkerLicenceAppResponse)
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

    const rb = new RequestBuilder(this.rootUrl, SecurityWorkerLicensingService.ApiWorkerLicenceApplicationsLicenceAppIdFilesPostPath, 'post');
    if (params) {
      rb.path('licenceAppId', params.licenceAppId, {});
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
    body: WorkerLicenceAppUpsertRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<WorkerLicenceCommandResponse>> {

    const rb = new RequestBuilder(this.rootUrl, SecurityWorkerLicensingService.ApiWorkerLicenceApplicationsSubmitPostPath, 'post');
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
        return r as StrictHttpResponse<WorkerLicenceCommandResponse>;
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
    body: WorkerLicenceAppUpsertRequest
  },
  context?: HttpContext

): Observable<WorkerLicenceCommandResponse> {

    return this.apiWorkerLicenceApplicationsSubmitPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<WorkerLicenceCommandResponse>) => r.body as WorkerLicenceCommandResponse)
    );
  }

  /**
   * Path part for operation apiWorkerLicenceApplicationsAuthenticatedFilesPost
   */
  static readonly ApiWorkerLicenceApplicationsAuthenticatedFilesPostPath = '/api/worker-licence-applications/authenticated/files';

  /**
   * Upload licence application files for authenticated users.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiWorkerLicenceApplicationsAuthenticatedFilesPost()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiWorkerLicenceApplicationsAuthenticatedFilesPost$Response(params?: {
    body?: {
'Documents'?: Array<Blob>;
'LicenceDocumentTypeCode'?: LicenceDocumentTypeCode;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<string>> {

    const rb = new RequestBuilder(this.rootUrl, SecurityWorkerLicensingService.ApiWorkerLicenceApplicationsAuthenticatedFilesPostPath, 'post');
    if (params) {
      rb.body(params.body, 'multipart/form-data');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<string>;
      })
    );
  }

  /**
   * Upload licence application files for authenticated users.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiWorkerLicenceApplicationsAuthenticatedFilesPost$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiWorkerLicenceApplicationsAuthenticatedFilesPost(params?: {
    body?: {
'Documents'?: Array<Blob>;
'LicenceDocumentTypeCode'?: LicenceDocumentTypeCode;
}
  },
  context?: HttpContext

): Observable<string> {

    return this.apiWorkerLicenceApplicationsAuthenticatedFilesPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<string>) => r.body as string)
    );
  }

  /**
   * Path part for operation apiWorkerLicenceApplicationsAuthenticatedSubmitPost
   */
  static readonly ApiWorkerLicenceApplicationsAuthenticatedSubmitPostPath = '/api/worker-licence-applications/authenticated/submit';

  /**
   * Submit Security Worker Licence Application Json part for authenticated users, supports only: renewal, update and replace
   * After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiWorkerLicenceApplicationsAuthenticatedSubmitPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiWorkerLicenceApplicationsAuthenticatedSubmitPost$Response(params?: {

    /**
     * WorkerLicenceAppAnonymousSubmitRequestJson data
     */
    body?: WorkerLicenceAppSubmitRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<WorkerLicenceCommandResponse>> {

    const rb = new RequestBuilder(this.rootUrl, SecurityWorkerLicensingService.ApiWorkerLicenceApplicationsAuthenticatedSubmitPostPath, 'post');
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
        return r as StrictHttpResponse<WorkerLicenceCommandResponse>;
      })
    );
  }

  /**
   * Submit Security Worker Licence Application Json part for authenticated users, supports only: renewal, update and replace
   * After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiWorkerLicenceApplicationsAuthenticatedSubmitPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiWorkerLicenceApplicationsAuthenticatedSubmitPost(params?: {

    /**
     * WorkerLicenceAppAnonymousSubmitRequestJson data
     */
    body?: WorkerLicenceAppSubmitRequest
  },
  context?: HttpContext

): Observable<WorkerLicenceCommandResponse> {

    return this.apiWorkerLicenceApplicationsAuthenticatedSubmitPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<WorkerLicenceCommandResponse>) => r.body as WorkerLicenceCommandResponse)
    );
  }

  /**
   * Path part for operation apiWorkerLicenceApplicationGet
   */
  static readonly ApiWorkerLicenceApplicationGetPath = '/api/worker-licence-application';

  /**
   * Get Security Worker Licence Application, anonymous one, so, we get the licenceAppId from cookies.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiWorkerLicenceApplicationGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiWorkerLicenceApplicationGet$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<WorkerLicenceAppResponse>> {

    const rb = new RequestBuilder(this.rootUrl, SecurityWorkerLicensingService.ApiWorkerLicenceApplicationGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<WorkerLicenceAppResponse>;
      })
    );
  }

  /**
   * Get Security Worker Licence Application, anonymous one, so, we get the licenceAppId from cookies.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiWorkerLicenceApplicationGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiWorkerLicenceApplicationGet(params?: {
  },
  context?: HttpContext

): Observable<WorkerLicenceAppResponse> {

    return this.apiWorkerLicenceApplicationGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<WorkerLicenceAppResponse>) => r.body as WorkerLicenceAppResponse)
    );
  }

  /**
   * Path part for operation apiWorkerLicenceApplicationsAnonymousKeyCodePost
   */
  static readonly ApiWorkerLicenceApplicationsAnonymousKeyCodePostPath = '/api/worker-licence-applications/anonymous/keyCode';

  /**
   * Upload licence application first step: frontend needs to make this first request to get a Guid code.
   * the keycode will be set in the cookies.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiWorkerLicenceApplicationsAnonymousKeyCodePost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiWorkerLicenceApplicationsAnonymousKeyCodePost$Response(params?: {
    body?: GoogleRecaptcha
  },
  context?: HttpContext

): Observable<StrictHttpResponse<IActionResult>> {

    const rb = new RequestBuilder(this.rootUrl, SecurityWorkerLicensingService.ApiWorkerLicenceApplicationsAnonymousKeyCodePostPath, 'post');
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
        return r as StrictHttpResponse<IActionResult>;
      })
    );
  }

  /**
   * Upload licence application first step: frontend needs to make this first request to get a Guid code.
   * the keycode will be set in the cookies.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiWorkerLicenceApplicationsAnonymousKeyCodePost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiWorkerLicenceApplicationsAnonymousKeyCodePost(params?: {
    body?: GoogleRecaptcha
  },
  context?: HttpContext

): Observable<IActionResult> {

    return this.apiWorkerLicenceApplicationsAnonymousKeyCodePost$Response(params,context).pipe(
      map((r: StrictHttpResponse<IActionResult>) => r.body as IActionResult)
    );
  }

  /**
   * Path part for operation apiWorkerLicenceApplicationsAnonymousFilesPost
   */
  static readonly ApiWorkerLicenceApplicationsAnonymousFilesPostPath = '/api/worker-licence-applications/anonymous/files';

  /**
   * Upload licence application files: frontend use the keyCode (in cookies) to upload following files.
   * Uploading file only save files in cache, the files are not connected to the application yet.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiWorkerLicenceApplicationsAnonymousFilesPost()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiWorkerLicenceApplicationsAnonymousFilesPost$Response(params?: {
    body?: {
'Documents'?: Array<Blob>;
'LicenceDocumentTypeCode'?: LicenceDocumentTypeCode;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<string>> {

    const rb = new RequestBuilder(this.rootUrl, SecurityWorkerLicensingService.ApiWorkerLicenceApplicationsAnonymousFilesPostPath, 'post');
    if (params) {
      rb.body(params.body, 'multipart/form-data');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<string>;
      })
    );
  }

  /**
   * Upload licence application files: frontend use the keyCode (in cookies) to upload following files.
   * Uploading file only save files in cache, the files are not connected to the application yet.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiWorkerLicenceApplicationsAnonymousFilesPost$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiWorkerLicenceApplicationsAnonymousFilesPost(params?: {
    body?: {
'Documents'?: Array<Blob>;
'LicenceDocumentTypeCode'?: LicenceDocumentTypeCode;
}
  },
  context?: HttpContext

): Observable<string> {

    return this.apiWorkerLicenceApplicationsAnonymousFilesPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<string>) => r.body as string)
    );
  }

  /**
   * Path part for operation apiWorkerLicenceApplicationsAnonymousSubmitPost
   */
  static readonly ApiWorkerLicenceApplicationsAnonymousSubmitPostPath = '/api/worker-licence-applications/anonymous/submit';

  /**
   * Submit Security Worker Licence Application Json part Anonymously
   * After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiWorkerLicenceApplicationsAnonymousSubmitPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiWorkerLicenceApplicationsAnonymousSubmitPost$Response(params?: {

    /**
     * WorkerLicenceAppAnonymousSubmitRequestJson data
     */
    body?: WorkerLicenceAppSubmitRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<WorkerLicenceCommandResponse>> {

    const rb = new RequestBuilder(this.rootUrl, SecurityWorkerLicensingService.ApiWorkerLicenceApplicationsAnonymousSubmitPostPath, 'post');
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
        return r as StrictHttpResponse<WorkerLicenceCommandResponse>;
      })
    );
  }

  /**
   * Submit Security Worker Licence Application Json part Anonymously
   * After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiWorkerLicenceApplicationsAnonymousSubmitPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiWorkerLicenceApplicationsAnonymousSubmitPost(params?: {

    /**
     * WorkerLicenceAppAnonymousSubmitRequestJson data
     */
    body?: WorkerLicenceAppSubmitRequest
  },
  context?: HttpContext

): Observable<WorkerLicenceCommandResponse> {

    return this.apiWorkerLicenceApplicationsAnonymousSubmitPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<WorkerLicenceCommandResponse>) => r.body as WorkerLicenceCommandResponse)
    );
  }

}
