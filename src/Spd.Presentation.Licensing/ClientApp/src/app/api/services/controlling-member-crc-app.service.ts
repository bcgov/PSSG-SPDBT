/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { apiControllingMemberCrcApplicationsAnonymousFilesPost } from '../fn/controlling-member-crc-app/api-controlling-member-crc-applications-anonymous-files-post';
import { ApiControllingMemberCrcApplicationsAnonymousFilesPost$Params } from '../fn/controlling-member-crc-app/api-controlling-member-crc-applications-anonymous-files-post';
import { apiControllingMemberCrcApplicationsAnonymousKeyCodePost } from '../fn/controlling-member-crc-app/api-controlling-member-crc-applications-anonymous-key-code-post';
import { ApiControllingMemberCrcApplicationsAnonymousKeyCodePost$Params } from '../fn/controlling-member-crc-app/api-controlling-member-crc-applications-anonymous-key-code-post';
import { apiControllingMemberCrcApplicationsAnonymousSubmitPost } from '../fn/controlling-member-crc-app/api-controlling-member-crc-applications-anonymous-submit-post';
import { ApiControllingMemberCrcApplicationsAnonymousSubmitPost$Params } from '../fn/controlling-member-crc-app/api-controlling-member-crc-applications-anonymous-submit-post';
import { apiControllingMemberCrcApplicationsAnonymousUpdatePost } from '../fn/controlling-member-crc-app/api-controlling-member-crc-applications-anonymous-update-post';
import { ApiControllingMemberCrcApplicationsAnonymousUpdatePost$Params } from '../fn/controlling-member-crc-app/api-controlling-member-crc-applications-anonymous-update-post';
import { apiControllingMemberCrcApplicationsAuthenticatedFilesPost } from '../fn/controlling-member-crc-app/api-controlling-member-crc-applications-authenticated-files-post';
import { ApiControllingMemberCrcApplicationsAuthenticatedFilesPost$Params } from '../fn/controlling-member-crc-app/api-controlling-member-crc-applications-authenticated-files-post';
import { apiControllingMemberCrcApplicationsOriginalAppIdFilesPost } from '../fn/controlling-member-crc-app/api-controlling-member-crc-applications-original-app-id-files-post';
import { ApiControllingMemberCrcApplicationsOriginalAppIdFilesPost$Params } from '../fn/controlling-member-crc-app/api-controlling-member-crc-applications-original-app-id-files-post';
import { apiControllingMemberCrcApplicationsOriginalAppIdGet } from '../fn/controlling-member-crc-app/api-controlling-member-crc-applications-original-app-id-get';
import { ApiControllingMemberCrcApplicationsOriginalAppIdGet$Params } from '../fn/controlling-member-crc-app/api-controlling-member-crc-applications-original-app-id-get';
import { apiControllingMemberCrcApplicationsPost } from '../fn/controlling-member-crc-app/api-controlling-member-crc-applications-post';
import { ApiControllingMemberCrcApplicationsPost$Params } from '../fn/controlling-member-crc-app/api-controlling-member-crc-applications-post';
import { apiControllingMemberCrcApplicationsSubmitPost } from '../fn/controlling-member-crc-app/api-controlling-member-crc-applications-submit-post';
import { ApiControllingMemberCrcApplicationsSubmitPost$Params } from '../fn/controlling-member-crc-app/api-controlling-member-crc-applications-submit-post';
import { apiControllingMemberCrcApplicationsUpdatePost } from '../fn/controlling-member-crc-app/api-controlling-member-crc-applications-update-post';
import { ApiControllingMemberCrcApplicationsUpdatePost$Params } from '../fn/controlling-member-crc-app/api-controlling-member-crc-applications-update-post';
import { ControllingMemberCrcAppCommandResponse } from '../models/controlling-member-crc-app-command-response';
import { ControllingMemberCrcAppResponse } from '../models/controlling-member-crc-app-response';
import { IActionResult } from '../models/i-action-result';
import { LicenceAppDocumentResponse } from '../models/licence-app-document-response';

@Injectable({ providedIn: 'root' })
export class ControllingMemberCrcAppService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `apiControllingMemberCrcApplicationsOriginalAppIdGet()` */
  static readonly ApiControllingMemberCrcApplicationsOriginalAppIdGetPath = '/api/controlling-member-crc-applications/{originalAppId}';

  /**
   * Get Controlling member CRC Application.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiControllingMemberCrcApplicationsOriginalAppIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiControllingMemberCrcApplicationsOriginalAppIdGet$Response(params: ApiControllingMemberCrcApplicationsOriginalAppIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ControllingMemberCrcAppResponse>> {
    return apiControllingMemberCrcApplicationsOriginalAppIdGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Get Controlling member CRC Application.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiControllingMemberCrcApplicationsOriginalAppIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiControllingMemberCrcApplicationsOriginalAppIdGet(params: ApiControllingMemberCrcApplicationsOriginalAppIdGet$Params, context?: HttpContext): Observable<ControllingMemberCrcAppResponse> {
    return this.apiControllingMemberCrcApplicationsOriginalAppIdGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<ControllingMemberCrcAppResponse>): ControllingMemberCrcAppResponse => r.body)
    );
  }

  /** Path part for operation `apiControllingMemberCrcApplicationsPost()` */
  static readonly ApiControllingMemberCrcApplicationsPostPath = '/api/controlling-member-crc-applications';

  /**
   * Create or save Controlling member CRC Application.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiControllingMemberCrcApplicationsPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiControllingMemberCrcApplicationsPost$Response(params: ApiControllingMemberCrcApplicationsPost$Params, context?: HttpContext): Observable<StrictHttpResponse<ControllingMemberCrcAppCommandResponse>> {
    return apiControllingMemberCrcApplicationsPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Create or save Controlling member CRC Application.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiControllingMemberCrcApplicationsPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiControllingMemberCrcApplicationsPost(params: ApiControllingMemberCrcApplicationsPost$Params, context?: HttpContext): Observable<ControllingMemberCrcAppCommandResponse> {
    return this.apiControllingMemberCrcApplicationsPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<ControllingMemberCrcAppCommandResponse>): ControllingMemberCrcAppCommandResponse => r.body)
    );
  }

  /** Path part for operation `apiControllingMemberCrcApplicationsOriginalAppIdFilesPost()` */
  static readonly ApiControllingMemberCrcApplicationsOriginalAppIdFilesPostPath = '/api/controlling-member-crc-applications/{originalAppId}/files';

  /**
   * Upload Controlling Member application files to transient storage.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiControllingMemberCrcApplicationsOriginalAppIdFilesPost()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiControllingMemberCrcApplicationsOriginalAppIdFilesPost$Response(params: ApiControllingMemberCrcApplicationsOriginalAppIdFilesPost$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<LicenceAppDocumentResponse>>> {
    return apiControllingMemberCrcApplicationsOriginalAppIdFilesPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Upload Controlling Member application files to transient storage.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiControllingMemberCrcApplicationsOriginalAppIdFilesPost$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiControllingMemberCrcApplicationsOriginalAppIdFilesPost(params: ApiControllingMemberCrcApplicationsOriginalAppIdFilesPost$Params, context?: HttpContext): Observable<Array<LicenceAppDocumentResponse>> {
    return this.apiControllingMemberCrcApplicationsOriginalAppIdFilesPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<LicenceAppDocumentResponse>>): Array<LicenceAppDocumentResponse> => r.body)
    );
  }

  /** Path part for operation `apiControllingMemberCrcApplicationsSubmitPost()` */
  static readonly ApiControllingMemberCrcApplicationsSubmitPostPath = '/api/controlling-member-crc-applications/submit';

  /**
   * Submit Controlling Member Crc New Application
   * authenticated.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiControllingMemberCrcApplicationsSubmitPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiControllingMemberCrcApplicationsSubmitPost$Response(params: ApiControllingMemberCrcApplicationsSubmitPost$Params, context?: HttpContext): Observable<StrictHttpResponse<ControllingMemberCrcAppCommandResponse>> {
    return apiControllingMemberCrcApplicationsSubmitPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Submit Controlling Member Crc New Application
   * authenticated.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiControllingMemberCrcApplicationsSubmitPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiControllingMemberCrcApplicationsSubmitPost(params: ApiControllingMemberCrcApplicationsSubmitPost$Params, context?: HttpContext): Observable<ControllingMemberCrcAppCommandResponse> {
    return this.apiControllingMemberCrcApplicationsSubmitPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<ControllingMemberCrcAppCommandResponse>): ControllingMemberCrcAppCommandResponse => r.body)
    );
  }

  /** Path part for operation `apiControllingMemberCrcApplicationsAuthenticatedFilesPost()` */
  static readonly ApiControllingMemberCrcApplicationsAuthenticatedFilesPostPath = '/api/controlling-member-crc-applications/authenticated/files';

  /**
   * Upload Controlling member crc application files for authenticated users.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiControllingMemberCrcApplicationsAuthenticatedFilesPost()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiControllingMemberCrcApplicationsAuthenticatedFilesPost$Response(params?: ApiControllingMemberCrcApplicationsAuthenticatedFilesPost$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
    return apiControllingMemberCrcApplicationsAuthenticatedFilesPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Upload Controlling member crc application files for authenticated users.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiControllingMemberCrcApplicationsAuthenticatedFilesPost$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiControllingMemberCrcApplicationsAuthenticatedFilesPost(params?: ApiControllingMemberCrcApplicationsAuthenticatedFilesPost$Params, context?: HttpContext): Observable<string> {
    return this.apiControllingMemberCrcApplicationsAuthenticatedFilesPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<string>): string => r.body)
    );
  }

  /** Path part for operation `apiControllingMemberCrcApplicationsUpdatePost()` */
  static readonly ApiControllingMemberCrcApplicationsUpdatePostPath = '/api/controlling-member-crc-applications/update';

  /**
   * Submit an update for Controlling member crc application for authenticated users,
   * After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiControllingMemberCrcApplicationsUpdatePost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiControllingMemberCrcApplicationsUpdatePost$Response(params?: ApiControllingMemberCrcApplicationsUpdatePost$Params, context?: HttpContext): Observable<StrictHttpResponse<ControllingMemberCrcAppCommandResponse>> {
    return apiControllingMemberCrcApplicationsUpdatePost(this.http, this.rootUrl, params, context);
  }

  /**
   * Submit an update for Controlling member crc application for authenticated users,
   * After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiControllingMemberCrcApplicationsUpdatePost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiControllingMemberCrcApplicationsUpdatePost(params?: ApiControllingMemberCrcApplicationsUpdatePost$Params, context?: HttpContext): Observable<ControllingMemberCrcAppCommandResponse> {
    return this.apiControllingMemberCrcApplicationsUpdatePost$Response(params, context).pipe(
      map((r: StrictHttpResponse<ControllingMemberCrcAppCommandResponse>): ControllingMemberCrcAppCommandResponse => r.body)
    );
  }

  /** Path part for operation `apiControllingMemberCrcApplicationsAnonymousKeyCodePost()` */
  static readonly ApiControllingMemberCrcApplicationsAnonymousKeyCodePostPath = '/api/controlling-member-crc-applications/anonymous/keyCode';

  /**
   * Upload Controlling Member Crc application first step: frontend needs to make this first request to get a Guid code.
   * the keycode will be set in the cookies.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiControllingMemberCrcApplicationsAnonymousKeyCodePost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiControllingMemberCrcApplicationsAnonymousKeyCodePost$Response(params?: ApiControllingMemberCrcApplicationsAnonymousKeyCodePost$Params, context?: HttpContext): Observable<StrictHttpResponse<IActionResult>> {
    return apiControllingMemberCrcApplicationsAnonymousKeyCodePost(this.http, this.rootUrl, params, context);
  }

  /**
   * Upload Controlling Member Crc application first step: frontend needs to make this first request to get a Guid code.
   * the keycode will be set in the cookies.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiControllingMemberCrcApplicationsAnonymousKeyCodePost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiControllingMemberCrcApplicationsAnonymousKeyCodePost(params?: ApiControllingMemberCrcApplicationsAnonymousKeyCodePost$Params, context?: HttpContext): Observable<IActionResult> {
    return this.apiControllingMemberCrcApplicationsAnonymousKeyCodePost$Response(params, context).pipe(
      map((r: StrictHttpResponse<IActionResult>): IActionResult => r.body)
    );
  }

  /** Path part for operation `apiControllingMemberCrcApplicationsAnonymousFilesPost()` */
  static readonly ApiControllingMemberCrcApplicationsAnonymousFilesPostPath = '/api/controlling-member-crc-applications/anonymous/files';

  /**
   * Upload Controlling Member Crc application files: frontend use the keyCode (in cookies) to upload following files.
   * Uploading file only save files in cache, the files are not connected to the application yet.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiControllingMemberCrcApplicationsAnonymousFilesPost()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiControllingMemberCrcApplicationsAnonymousFilesPost$Response(params?: ApiControllingMemberCrcApplicationsAnonymousFilesPost$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
    return apiControllingMemberCrcApplicationsAnonymousFilesPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Upload Controlling Member Crc application files: frontend use the keyCode (in cookies) to upload following files.
   * Uploading file only save files in cache, the files are not connected to the application yet.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiControllingMemberCrcApplicationsAnonymousFilesPost$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiControllingMemberCrcApplicationsAnonymousFilesPost(params?: ApiControllingMemberCrcApplicationsAnonymousFilesPost$Params, context?: HttpContext): Observable<string> {
    return this.apiControllingMemberCrcApplicationsAnonymousFilesPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<string>): string => r.body)
    );
  }

  /** Path part for operation `apiControllingMemberCrcApplicationsAnonymousSubmitPost()` */
  static readonly ApiControllingMemberCrcApplicationsAnonymousSubmitPostPath = '/api/controlling-member-crc-applications/anonymous/submit';

  /**
   * Submit Controlling Member Crc New Application Anonymously.
   * After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
   * anonymous.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiControllingMemberCrcApplicationsAnonymousSubmitPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiControllingMemberCrcApplicationsAnonymousSubmitPost$Response(params: ApiControllingMemberCrcApplicationsAnonymousSubmitPost$Params, context?: HttpContext): Observable<StrictHttpResponse<ControllingMemberCrcAppCommandResponse>> {
    return apiControllingMemberCrcApplicationsAnonymousSubmitPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Submit Controlling Member Crc New Application Anonymously.
   * After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
   * anonymous.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiControllingMemberCrcApplicationsAnonymousSubmitPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiControllingMemberCrcApplicationsAnonymousSubmitPost(params: ApiControllingMemberCrcApplicationsAnonymousSubmitPost$Params, context?: HttpContext): Observable<ControllingMemberCrcAppCommandResponse> {
    return this.apiControllingMemberCrcApplicationsAnonymousSubmitPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<ControllingMemberCrcAppCommandResponse>): ControllingMemberCrcAppCommandResponse => r.body)
    );
  }

  /** Path part for operation `apiControllingMemberCrcApplicationsAnonymousUpdatePost()` */
  static readonly ApiControllingMemberCrcApplicationsAnonymousUpdatePostPath = '/api/controlling-member-crc-applications/anonymous/update';

  /**
   * Submit an update for Controlling Member Crc Application Anonymously
   * After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiControllingMemberCrcApplicationsAnonymousUpdatePost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiControllingMemberCrcApplicationsAnonymousUpdatePost$Response(params: ApiControllingMemberCrcApplicationsAnonymousUpdatePost$Params, context?: HttpContext): Observable<StrictHttpResponse<ControllingMemberCrcAppCommandResponse>> {
    return apiControllingMemberCrcApplicationsAnonymousUpdatePost(this.http, this.rootUrl, params, context);
  }

  /**
   * Submit an update for Controlling Member Crc Application Anonymously
   * After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiControllingMemberCrcApplicationsAnonymousUpdatePost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiControllingMemberCrcApplicationsAnonymousUpdatePost(params: ApiControllingMemberCrcApplicationsAnonymousUpdatePost$Params, context?: HttpContext): Observable<ControllingMemberCrcAppCommandResponse> {
    return this.apiControllingMemberCrcApplicationsAnonymousUpdatePost$Response(params, context).pipe(
      map((r: StrictHttpResponse<ControllingMemberCrcAppCommandResponse>): ControllingMemberCrcAppCommandResponse => r.body)
    );
  }

}
