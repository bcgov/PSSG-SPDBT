/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { apiApplicantsApplicantIdSwlLatestGet } from '../fn/security-worker-licensing/api-applicants-applicant-id-swl-latest-get';
import { ApiApplicantsApplicantIdSwlLatestGet$Params } from '../fn/security-worker-licensing/api-applicants-applicant-id-swl-latest-get';
import { apiWorkerLicenceApplicationGet } from '../fn/security-worker-licensing/api-worker-licence-application-get';
import { ApiWorkerLicenceApplicationGet$Params } from '../fn/security-worker-licensing/api-worker-licence-application-get';
import { apiWorkerLicenceApplicationsAnonymousFilesPost } from '../fn/security-worker-licensing/api-worker-licence-applications-anonymous-files-post';
import { ApiWorkerLicenceApplicationsAnonymousFilesPost$Params } from '../fn/security-worker-licensing/api-worker-licence-applications-anonymous-files-post';
import { apiWorkerLicenceApplicationsAnonymousKeyCodePost } from '../fn/security-worker-licensing/api-worker-licence-applications-anonymous-key-code-post';
import { ApiWorkerLicenceApplicationsAnonymousKeyCodePost$Params } from '../fn/security-worker-licensing/api-worker-licence-applications-anonymous-key-code-post';
import { apiWorkerLicenceApplicationsAnonymousSubmitPost } from '../fn/security-worker-licensing/api-worker-licence-applications-anonymous-submit-post';
import { ApiWorkerLicenceApplicationsAnonymousSubmitPost$Params } from '../fn/security-worker-licensing/api-worker-licence-applications-anonymous-submit-post';
import { apiWorkerLicenceApplicationsAuthenticatedFilesPost } from '../fn/security-worker-licensing/api-worker-licence-applications-authenticated-files-post';
import { ApiWorkerLicenceApplicationsAuthenticatedFilesPost$Params } from '../fn/security-worker-licensing/api-worker-licence-applications-authenticated-files-post';
import { apiWorkerLicenceApplicationsAuthenticatedSubmitPost } from '../fn/security-worker-licensing/api-worker-licence-applications-authenticated-submit-post';
import { ApiWorkerLicenceApplicationsAuthenticatedSubmitPost$Params } from '../fn/security-worker-licensing/api-worker-licence-applications-authenticated-submit-post';
import { apiWorkerLicenceApplicationsLicenceAppIdFilesPost } from '../fn/security-worker-licensing/api-worker-licence-applications-licence-app-id-files-post';
import { ApiWorkerLicenceApplicationsLicenceAppIdFilesPost$Params } from '../fn/security-worker-licensing/api-worker-licence-applications-licence-app-id-files-post';
import { apiWorkerLicenceApplicationsLicenceAppIdGet } from '../fn/security-worker-licensing/api-worker-licence-applications-licence-app-id-get';
import { ApiWorkerLicenceApplicationsLicenceAppIdGet$Params } from '../fn/security-worker-licensing/api-worker-licence-applications-licence-app-id-get';
import { apiWorkerLicenceApplicationsPost } from '../fn/security-worker-licensing/api-worker-licence-applications-post';
import { ApiWorkerLicenceApplicationsPost$Params } from '../fn/security-worker-licensing/api-worker-licence-applications-post';
import { apiWorkerLicenceApplicationsSubmitPost } from '../fn/security-worker-licensing/api-worker-licence-applications-submit-post';
import { ApiWorkerLicenceApplicationsSubmitPost$Params } from '../fn/security-worker-licensing/api-worker-licence-applications-submit-post';
import { IActionResult } from '../models/i-action-result';
import { LicenceAppDocumentResponse } from '../models/licence-app-document-response';
import { WorkerLicenceAppResponse } from '../models/worker-licence-app-response';
import { WorkerLicenceCommandResponse } from '../models/worker-licence-command-response';

@Injectable({ providedIn: 'root' })
export class SecurityWorkerLicensingService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `apiWorkerLicenceApplicationsPost()` */
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
  apiWorkerLicenceApplicationsPost$Response(params: ApiWorkerLicenceApplicationsPost$Params, context?: HttpContext): Observable<StrictHttpResponse<WorkerLicenceCommandResponse>> {
    return apiWorkerLicenceApplicationsPost(this.http, this.rootUrl, params, context);
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
  apiWorkerLicenceApplicationsPost(params: ApiWorkerLicenceApplicationsPost$Params, context?: HttpContext): Observable<WorkerLicenceCommandResponse> {
    return this.apiWorkerLicenceApplicationsPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<WorkerLicenceCommandResponse>): WorkerLicenceCommandResponse => r.body)
    );
  }

  /** Path part for operation `apiWorkerLicenceApplicationsLicenceAppIdGet()` */
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
  apiWorkerLicenceApplicationsLicenceAppIdGet$Response(params: ApiWorkerLicenceApplicationsLicenceAppIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<WorkerLicenceAppResponse>> {
    return apiWorkerLicenceApplicationsLicenceAppIdGet(this.http, this.rootUrl, params, context);
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
  apiWorkerLicenceApplicationsLicenceAppIdGet(params: ApiWorkerLicenceApplicationsLicenceAppIdGet$Params, context?: HttpContext): Observable<WorkerLicenceAppResponse> {
    return this.apiWorkerLicenceApplicationsLicenceAppIdGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<WorkerLicenceAppResponse>): WorkerLicenceAppResponse => r.body)
    );
  }

  /** Path part for operation `apiApplicantsApplicantIdSwlLatestGet()` */
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
  apiApplicantsApplicantIdSwlLatestGet$Response(params: ApiApplicantsApplicantIdSwlLatestGet$Params, context?: HttpContext): Observable<StrictHttpResponse<WorkerLicenceAppResponse>> {
    return apiApplicantsApplicantIdSwlLatestGet(this.http, this.rootUrl, params, context);
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
  apiApplicantsApplicantIdSwlLatestGet(params: ApiApplicantsApplicantIdSwlLatestGet$Params, context?: HttpContext): Observable<WorkerLicenceAppResponse> {
    return this.apiApplicantsApplicantIdSwlLatestGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<WorkerLicenceAppResponse>): WorkerLicenceAppResponse => r.body)
    );
  }

  /** Path part for operation `apiWorkerLicenceApplicationsLicenceAppIdFilesPost()` */
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
  apiWorkerLicenceApplicationsLicenceAppIdFilesPost$Response(params: ApiWorkerLicenceApplicationsLicenceAppIdFilesPost$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<LicenceAppDocumentResponse>>> {
    return apiWorkerLicenceApplicationsLicenceAppIdFilesPost(this.http, this.rootUrl, params, context);
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
  apiWorkerLicenceApplicationsLicenceAppIdFilesPost(params: ApiWorkerLicenceApplicationsLicenceAppIdFilesPost$Params, context?: HttpContext): Observable<Array<LicenceAppDocumentResponse>> {
    return this.apiWorkerLicenceApplicationsLicenceAppIdFilesPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<LicenceAppDocumentResponse>>): Array<LicenceAppDocumentResponse> => r.body)
    );
  }

  /** Path part for operation `apiWorkerLicenceApplicationsSubmitPost()` */
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
  apiWorkerLicenceApplicationsSubmitPost$Response(params: ApiWorkerLicenceApplicationsSubmitPost$Params, context?: HttpContext): Observable<StrictHttpResponse<WorkerLicenceCommandResponse>> {
    return apiWorkerLicenceApplicationsSubmitPost(this.http, this.rootUrl, params, context);
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
  apiWorkerLicenceApplicationsSubmitPost(params: ApiWorkerLicenceApplicationsSubmitPost$Params, context?: HttpContext): Observable<WorkerLicenceCommandResponse> {
    return this.apiWorkerLicenceApplicationsSubmitPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<WorkerLicenceCommandResponse>): WorkerLicenceCommandResponse => r.body)
    );
  }

  /** Path part for operation `apiWorkerLicenceApplicationsAuthenticatedFilesPost()` */
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
  apiWorkerLicenceApplicationsAuthenticatedFilesPost$Response(params?: ApiWorkerLicenceApplicationsAuthenticatedFilesPost$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
    return apiWorkerLicenceApplicationsAuthenticatedFilesPost(this.http, this.rootUrl, params, context);
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
  apiWorkerLicenceApplicationsAuthenticatedFilesPost(params?: ApiWorkerLicenceApplicationsAuthenticatedFilesPost$Params, context?: HttpContext): Observable<string> {
    return this.apiWorkerLicenceApplicationsAuthenticatedFilesPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<string>): string => r.body)
    );
  }

  /** Path part for operation `apiWorkerLicenceApplicationsAuthenticatedSubmitPost()` */
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
  apiWorkerLicenceApplicationsAuthenticatedSubmitPost$Response(params?: ApiWorkerLicenceApplicationsAuthenticatedSubmitPost$Params, context?: HttpContext): Observable<StrictHttpResponse<WorkerLicenceCommandResponse>> {
    return apiWorkerLicenceApplicationsAuthenticatedSubmitPost(this.http, this.rootUrl, params, context);
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
  apiWorkerLicenceApplicationsAuthenticatedSubmitPost(params?: ApiWorkerLicenceApplicationsAuthenticatedSubmitPost$Params, context?: HttpContext): Observable<WorkerLicenceCommandResponse> {
    return this.apiWorkerLicenceApplicationsAuthenticatedSubmitPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<WorkerLicenceCommandResponse>): WorkerLicenceCommandResponse => r.body)
    );
  }

  /** Path part for operation `apiWorkerLicenceApplicationGet()` */
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
  apiWorkerLicenceApplicationGet$Response(params?: ApiWorkerLicenceApplicationGet$Params, context?: HttpContext): Observable<StrictHttpResponse<WorkerLicenceAppResponse>> {
    return apiWorkerLicenceApplicationGet(this.http, this.rootUrl, params, context);
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
  apiWorkerLicenceApplicationGet(params?: ApiWorkerLicenceApplicationGet$Params, context?: HttpContext): Observable<WorkerLicenceAppResponse> {
    return this.apiWorkerLicenceApplicationGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<WorkerLicenceAppResponse>): WorkerLicenceAppResponse => r.body)
    );
  }

  /** Path part for operation `apiWorkerLicenceApplicationsAnonymousKeyCodePost()` */
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
  apiWorkerLicenceApplicationsAnonymousKeyCodePost$Response(params?: ApiWorkerLicenceApplicationsAnonymousKeyCodePost$Params, context?: HttpContext): Observable<StrictHttpResponse<IActionResult>> {
    return apiWorkerLicenceApplicationsAnonymousKeyCodePost(this.http, this.rootUrl, params, context);
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
  apiWorkerLicenceApplicationsAnonymousKeyCodePost(params?: ApiWorkerLicenceApplicationsAnonymousKeyCodePost$Params, context?: HttpContext): Observable<IActionResult> {
    return this.apiWorkerLicenceApplicationsAnonymousKeyCodePost$Response(params, context).pipe(
      map((r: StrictHttpResponse<IActionResult>): IActionResult => r.body)
    );
  }

  /** Path part for operation `apiWorkerLicenceApplicationsAnonymousFilesPost()` */
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
  apiWorkerLicenceApplicationsAnonymousFilesPost$Response(params?: ApiWorkerLicenceApplicationsAnonymousFilesPost$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
    return apiWorkerLicenceApplicationsAnonymousFilesPost(this.http, this.rootUrl, params, context);
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
  apiWorkerLicenceApplicationsAnonymousFilesPost(params?: ApiWorkerLicenceApplicationsAnonymousFilesPost$Params, context?: HttpContext): Observable<string> {
    return this.apiWorkerLicenceApplicationsAnonymousFilesPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<string>): string => r.body)
    );
  }

  /** Path part for operation `apiWorkerLicenceApplicationsAnonymousSubmitPost()` */
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
  apiWorkerLicenceApplicationsAnonymousSubmitPost$Response(params?: ApiWorkerLicenceApplicationsAnonymousSubmitPost$Params, context?: HttpContext): Observable<StrictHttpResponse<WorkerLicenceCommandResponse>> {
    return apiWorkerLicenceApplicationsAnonymousSubmitPost(this.http, this.rootUrl, params, context);
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
  apiWorkerLicenceApplicationsAnonymousSubmitPost(params?: ApiWorkerLicenceApplicationsAnonymousSubmitPost$Params, context?: HttpContext): Observable<WorkerLicenceCommandResponse> {
    return this.apiWorkerLicenceApplicationsAnonymousSubmitPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<WorkerLicenceCommandResponse>): WorkerLicenceCommandResponse => r.body)
    );
  }

}
