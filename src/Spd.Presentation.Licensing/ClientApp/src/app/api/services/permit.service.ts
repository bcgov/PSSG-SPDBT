/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { apiApplicantsApplicantIdPermitLatestGet } from '../fn/permit/api-applicants-applicant-id-permit-latest-get';
import { ApiApplicantsApplicantIdPermitLatestGet$Params } from '../fn/permit/api-applicants-applicant-id-permit-latest-get';
import { apiPermitApplicationGet } from '../fn/permit/api-permit-application-get';
import { ApiPermitApplicationGet$Params } from '../fn/permit/api-permit-application-get';
import { apiPermitApplicationsAnonymousFilesPost } from '../fn/permit/api-permit-applications-anonymous-files-post';
import { ApiPermitApplicationsAnonymousFilesPost$Params } from '../fn/permit/api-permit-applications-anonymous-files-post';
import { apiPermitApplicationsAnonymousKeyCodePost } from '../fn/permit/api-permit-applications-anonymous-key-code-post';
import { ApiPermitApplicationsAnonymousKeyCodePost$Params } from '../fn/permit/api-permit-applications-anonymous-key-code-post';
import { apiPermitApplicationsAnonymousSubmitPost } from '../fn/permit/api-permit-applications-anonymous-submit-post';
import { ApiPermitApplicationsAnonymousSubmitPost$Params } from '../fn/permit/api-permit-applications-anonymous-submit-post';
import { apiPermitApplicationsAuthenticatedSubmitPost } from '../fn/permit/api-permit-applications-authenticated-submit-post';
import { ApiPermitApplicationsAuthenticatedSubmitPost$Params } from '../fn/permit/api-permit-applications-authenticated-submit-post';
import { apiPermitApplicationsFilesPost } from '../fn/permit/api-permit-applications-files-post';
import { ApiPermitApplicationsFilesPost$Params } from '../fn/permit/api-permit-applications-files-post';
import { apiPermitApplicationsLicenceAppIdFilesPost } from '../fn/permit/api-permit-applications-licence-app-id-files-post';
import { ApiPermitApplicationsLicenceAppIdFilesPost$Params } from '../fn/permit/api-permit-applications-licence-app-id-files-post';
import { apiPermitApplicationsLicenceAppIdGet } from '../fn/permit/api-permit-applications-licence-app-id-get';
import { ApiPermitApplicationsLicenceAppIdGet$Params } from '../fn/permit/api-permit-applications-licence-app-id-get';
import { apiPermitApplicationsPost } from '../fn/permit/api-permit-applications-post';
import { ApiPermitApplicationsPost$Params } from '../fn/permit/api-permit-applications-post';
import { apiPermitApplicationsSubmitPost } from '../fn/permit/api-permit-applications-submit-post';
import { ApiPermitApplicationsSubmitPost$Params } from '../fn/permit/api-permit-applications-submit-post';
import { IActionResult } from '../models/i-action-result';
import { LicenceAppDocumentResponse } from '../models/licence-app-document-response';
import { PermitAppCommandResponse } from '../models/permit-app-command-response';
import { PermitLicenceAppResponse } from '../models/permit-licence-app-response';

@Injectable({ providedIn: 'root' })
export class PermitService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `apiPermitApplicationsPost()` */
  static readonly ApiPermitApplicationsPostPath = '/api/permit-applications';

  /**
   * Create Permit Application.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiPermitApplicationsPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiPermitApplicationsPost$Response(params: ApiPermitApplicationsPost$Params, context?: HttpContext): Observable<StrictHttpResponse<PermitAppCommandResponse>> {
    return apiPermitApplicationsPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Create Permit Application.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiPermitApplicationsPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiPermitApplicationsPost(params: ApiPermitApplicationsPost$Params, context?: HttpContext): Observable<PermitAppCommandResponse> {
    return this.apiPermitApplicationsPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<PermitAppCommandResponse>): PermitAppCommandResponse => r.body)
    );
  }

  /** Path part for operation `apiPermitApplicationsLicenceAppIdGet()` */
  static readonly ApiPermitApplicationsLicenceAppIdGetPath = '/api/permit-applications/{licenceAppId}';

  /**
   * Get Security Worker Licence Application.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiPermitApplicationsLicenceAppIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiPermitApplicationsLicenceAppIdGet$Response(params: ApiPermitApplicationsLicenceAppIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<PermitLicenceAppResponse>> {
    return apiPermitApplicationsLicenceAppIdGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Get Security Worker Licence Application.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiPermitApplicationsLicenceAppIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiPermitApplicationsLicenceAppIdGet(params: ApiPermitApplicationsLicenceAppIdGet$Params, context?: HttpContext): Observable<PermitLicenceAppResponse> {
    return this.apiPermitApplicationsLicenceAppIdGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<PermitLicenceAppResponse>): PermitLicenceAppResponse => r.body)
    );
  }

  /** Path part for operation `apiApplicantsApplicantIdPermitLatestGet()` */
  static readonly ApiApplicantsApplicantIdPermitLatestGetPath = '/api/applicants/{applicantId}/permit-latest';

  /**
   * Get Lastest Permit Application
   * Example: api/applicants/{applicantId}/permit-latest?typeCode=BodyArmourPermit.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiApplicantsApplicantIdPermitLatestGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsApplicantIdPermitLatestGet$Response(params: ApiApplicantsApplicantIdPermitLatestGet$Params, context?: HttpContext): Observable<StrictHttpResponse<PermitLicenceAppResponse>> {
    return apiApplicantsApplicantIdPermitLatestGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Get Lastest Permit Application
   * Example: api/applicants/{applicantId}/permit-latest?typeCode=BodyArmourPermit.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiApplicantsApplicantIdPermitLatestGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsApplicantIdPermitLatestGet(params: ApiApplicantsApplicantIdPermitLatestGet$Params, context?: HttpContext): Observable<PermitLicenceAppResponse> {
    return this.apiApplicantsApplicantIdPermitLatestGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<PermitLicenceAppResponse>): PermitLicenceAppResponse => r.body)
    );
  }

  /** Path part for operation `apiPermitApplicationsLicenceAppIdFilesPost()` */
  static readonly ApiPermitApplicationsLicenceAppIdFilesPostPath = '/api/permit-applications/{licenceAppId}/files';

  /**
   * Upload permit application files to transient storage.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiPermitApplicationsLicenceAppIdFilesPost()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiPermitApplicationsLicenceAppIdFilesPost$Response(params: ApiPermitApplicationsLicenceAppIdFilesPost$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<LicenceAppDocumentResponse>>> {
    return apiPermitApplicationsLicenceAppIdFilesPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Upload permit application files to transient storage.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiPermitApplicationsLicenceAppIdFilesPost$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiPermitApplicationsLicenceAppIdFilesPost(params: ApiPermitApplicationsLicenceAppIdFilesPost$Params, context?: HttpContext): Observable<Array<LicenceAppDocumentResponse>> {
    return this.apiPermitApplicationsLicenceAppIdFilesPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<LicenceAppDocumentResponse>>): Array<LicenceAppDocumentResponse> => r.body)
    );
  }

  /** Path part for operation `apiPermitApplicationsFilesPost()` */
  static readonly ApiPermitApplicationsFilesPostPath = '/api/permit-applications/files';

  /**
   * Uploading file only save files in cache, the files are not connected to the application yet.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiPermitApplicationsFilesPost()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiPermitApplicationsFilesPost$Response(params?: ApiPermitApplicationsFilesPost$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
    return apiPermitApplicationsFilesPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Uploading file only save files in cache, the files are not connected to the application yet.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiPermitApplicationsFilesPost$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiPermitApplicationsFilesPost(params?: ApiPermitApplicationsFilesPost$Params, context?: HttpContext): Observable<string> {
    return this.apiPermitApplicationsFilesPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<string>): string => r.body)
    );
  }

  /** Path part for operation `apiPermitApplicationsSubmitPost()` */
  static readonly ApiPermitApplicationsSubmitPostPath = '/api/permit-applications/submit';

  /**
   * Submit Permit Application.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiPermitApplicationsSubmitPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiPermitApplicationsSubmitPost$Response(params: ApiPermitApplicationsSubmitPost$Params, context?: HttpContext): Observable<StrictHttpResponse<PermitAppCommandResponse>> {
    return apiPermitApplicationsSubmitPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Submit Permit Application.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiPermitApplicationsSubmitPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiPermitApplicationsSubmitPost(params: ApiPermitApplicationsSubmitPost$Params, context?: HttpContext): Observable<PermitAppCommandResponse> {
    return this.apiPermitApplicationsSubmitPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<PermitAppCommandResponse>): PermitAppCommandResponse => r.body)
    );
  }

  /** Path part for operation `apiPermitApplicationsAuthenticatedSubmitPost()` */
  static readonly ApiPermitApplicationsAuthenticatedSubmitPostPath = '/api/permit-applications/authenticated/submit';

  /**
   * Submit Permit Application Json part for authenticated users, supports only: renewal, update and replace
   * After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiPermitApplicationsAuthenticatedSubmitPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiPermitApplicationsAuthenticatedSubmitPost$Response(params?: ApiPermitApplicationsAuthenticatedSubmitPost$Params, context?: HttpContext): Observable<StrictHttpResponse<PermitAppCommandResponse>> {
    return apiPermitApplicationsAuthenticatedSubmitPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Submit Permit Application Json part for authenticated users, supports only: renewal, update and replace
   * After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiPermitApplicationsAuthenticatedSubmitPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiPermitApplicationsAuthenticatedSubmitPost(params?: ApiPermitApplicationsAuthenticatedSubmitPost$Params, context?: HttpContext): Observable<PermitAppCommandResponse> {
    return this.apiPermitApplicationsAuthenticatedSubmitPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<PermitAppCommandResponse>): PermitAppCommandResponse => r.body)
    );
  }

  /** Path part for operation `apiPermitApplicationGet()` */
  static readonly ApiPermitApplicationGetPath = '/api/permit-application';

  /**
   * Get anonymous Permit Application, thus the licenceAppId is retrieved from cookies.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiPermitApplicationGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiPermitApplicationGet$Response(params?: ApiPermitApplicationGet$Params, context?: HttpContext): Observable<StrictHttpResponse<PermitLicenceAppResponse>> {
    return apiPermitApplicationGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Get anonymous Permit Application, thus the licenceAppId is retrieved from cookies.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiPermitApplicationGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiPermitApplicationGet(params?: ApiPermitApplicationGet$Params, context?: HttpContext): Observable<PermitLicenceAppResponse> {
    return this.apiPermitApplicationGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<PermitLicenceAppResponse>): PermitLicenceAppResponse => r.body)
    );
  }

  /** Path part for operation `apiPermitApplicationsAnonymousKeyCodePost()` */
  static readonly ApiPermitApplicationsAnonymousKeyCodePostPath = '/api/permit-applications/anonymous/keyCode';

  /**
   * Upload Body Armour or Armour Vehicle permit application first step: frontend needs to make this first request to get a Guid code.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiPermitApplicationsAnonymousKeyCodePost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiPermitApplicationsAnonymousKeyCodePost$Response(params?: ApiPermitApplicationsAnonymousKeyCodePost$Params, context?: HttpContext): Observable<StrictHttpResponse<IActionResult>> {
    return apiPermitApplicationsAnonymousKeyCodePost(this.http, this.rootUrl, params, context);
  }

  /**
   * Upload Body Armour or Armour Vehicle permit application first step: frontend needs to make this first request to get a Guid code.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiPermitApplicationsAnonymousKeyCodePost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiPermitApplicationsAnonymousKeyCodePost(params?: ApiPermitApplicationsAnonymousKeyCodePost$Params, context?: HttpContext): Observable<IActionResult> {
    return this.apiPermitApplicationsAnonymousKeyCodePost$Response(params, context).pipe(
      map((r: StrictHttpResponse<IActionResult>): IActionResult => r.body)
    );
  }

  /** Path part for operation `apiPermitApplicationsAnonymousFilesPost()` */
  static readonly ApiPermitApplicationsAnonymousFilesPostPath = '/api/permit-applications/anonymous/files';

  /**
   * Upload Body Armour or Armour Vehicle permit application files: frontend use the keyCode (which is in cookies) to upload following files.
   * Uploading file only save files in cache, the files are not connected to the application yet.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiPermitApplicationsAnonymousFilesPost()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiPermitApplicationsAnonymousFilesPost$Response(params?: ApiPermitApplicationsAnonymousFilesPost$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
    return apiPermitApplicationsAnonymousFilesPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Upload Body Armour or Armour Vehicle permit application files: frontend use the keyCode (which is in cookies) to upload following files.
   * Uploading file only save files in cache, the files are not connected to the application yet.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiPermitApplicationsAnonymousFilesPost$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiPermitApplicationsAnonymousFilesPost(params?: ApiPermitApplicationsAnonymousFilesPost$Params, context?: HttpContext): Observable<string> {
    return this.apiPermitApplicationsAnonymousFilesPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<string>): string => r.body)
    );
  }

  /** Path part for operation `apiPermitApplicationsAnonymousSubmitPost()` */
  static readonly ApiPermitApplicationsAnonymousSubmitPostPath = '/api/permit-applications/anonymous/submit';

  /**
   * Submit Body Armour or Armour Vehicle permit application Anonymously
   * After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
   * The session keycode is stored in the cookies.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiPermitApplicationsAnonymousSubmitPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiPermitApplicationsAnonymousSubmitPost$Response(params?: ApiPermitApplicationsAnonymousSubmitPost$Params, context?: HttpContext): Observable<StrictHttpResponse<PermitAppCommandResponse>> {
    return apiPermitApplicationsAnonymousSubmitPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Submit Body Armour or Armour Vehicle permit application Anonymously
   * After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
   * The session keycode is stored in the cookies.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiPermitApplicationsAnonymousSubmitPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiPermitApplicationsAnonymousSubmitPost(params?: ApiPermitApplicationsAnonymousSubmitPost$Params, context?: HttpContext): Observable<PermitAppCommandResponse> {
    return this.apiPermitApplicationsAnonymousSubmitPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<PermitAppCommandResponse>): PermitAppCommandResponse => r.body)
    );
  }

}
