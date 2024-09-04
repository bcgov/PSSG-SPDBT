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
import { apiControllingMemberCrcApplicationsCrcAppIdFilesPost } from '../fn/controlling-member-crc-app/api-controlling-member-crc-applications-crc-app-id-files-post';
import { ApiControllingMemberCrcApplicationsCrcAppIdFilesPost$Params } from '../fn/controlling-member-crc-app/api-controlling-member-crc-applications-crc-app-id-files-post';
import { apiControllingMemberCrcApplicationsPost } from '../fn/controlling-member-crc-app/api-controlling-member-crc-applications-post';
import { ApiControllingMemberCrcApplicationsPost$Params } from '../fn/controlling-member-crc-app/api-controlling-member-crc-applications-post';
import { apiControllingMemberCrcApplicationsSubmitPost } from '../fn/controlling-member-crc-app/api-controlling-member-crc-applications-submit-post';
import { ApiControllingMemberCrcApplicationsSubmitPost$Params } from '../fn/controlling-member-crc-app/api-controlling-member-crc-applications-submit-post';
import { ControllingMemberCrcAppCommandResponse } from '../models/controlling-member-crc-app-command-response';
import { IActionResult } from '../models/i-action-result';
import { LicenceAppDocumentResponse } from '../models/licence-app-document-response';

@Injectable({ providedIn: 'root' })
export class ControllingMemberCrcAppService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `apiControllingMemberCrcApplicationsPost()` */
  static readonly ApiControllingMemberCrcApplicationsPostPath = '/api/controlling-member-crc-applications';

  /**
   * Create Controlling member CRC Application.
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
   * Create Controlling member CRC Application.
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

  /** Path part for operation `apiControllingMemberCrcApplicationsCrcAppIdFilesPost()` */
  static readonly ApiControllingMemberCrcApplicationsCrcAppIdFilesPostPath = '/api/controlling-member-crc-applications/{CrcAppId}/files';

  /**
   * Upload Controlling Member application files to transient storage.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiControllingMemberCrcApplicationsCrcAppIdFilesPost()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiControllingMemberCrcApplicationsCrcAppIdFilesPost$Response(params: ApiControllingMemberCrcApplicationsCrcAppIdFilesPost$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<LicenceAppDocumentResponse>>> {
    return apiControllingMemberCrcApplicationsCrcAppIdFilesPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Upload Controlling Member application files to transient storage.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiControllingMemberCrcApplicationsCrcAppIdFilesPost$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiControllingMemberCrcApplicationsCrcAppIdFilesPost(params: ApiControllingMemberCrcApplicationsCrcAppIdFilesPost$Params, context?: HttpContext): Observable<Array<LicenceAppDocumentResponse>> {
    return this.apiControllingMemberCrcApplicationsCrcAppIdFilesPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<LicenceAppDocumentResponse>>): Array<LicenceAppDocumentResponse> => r.body)
    );
  }

  /** Path part for operation `apiControllingMemberCrcApplicationsSubmitPost()` */
  static readonly ApiControllingMemberCrcApplicationsSubmitPostPath = '/api/controlling-member-crc-applications/submit';

  /**
   * Submit Controlling Member Crc Application
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
   * Submit Controlling Member Crc Application
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

  /** Path part for operation `apiControllingMemberCrcApplicationsAnonymousKeyCodePost()` */
  static readonly ApiControllingMemberCrcApplicationsAnonymousKeyCodePostPath = '/api/controlling-member-crc-applications/anonymous/keyCode';

  /**
   * Upload licence application first step: frontend needs to make this first request to get a Guid code.
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
   * Upload licence application first step: frontend needs to make this first request to get a Guid code.
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
   * Upload licence application files: frontend use the keyCode (in cookies) to upload following files.
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
   * Upload licence application files: frontend use the keyCode (in cookies) to upload following files.
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
   * Submit Controlling Member Crc Application
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
   * Submit Controlling Member Crc Application
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

}
