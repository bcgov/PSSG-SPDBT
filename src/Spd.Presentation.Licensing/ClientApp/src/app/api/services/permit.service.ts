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
import { LicenceDocumentTypeCode } from '../models/licence-document-type-code';
import { PermitAppCommandResponse } from '../models/permit-app-command-response';
import { PermitAppSubmitRequest } from '../models/permit-app-submit-request';
import { PermitAppUpsertRequest } from '../models/permit-app-upsert-request';
import { PermitCommandResponse } from '../models/permit-command-response';
import { PermitLicenceAppResponse } from '../models/permit-licence-app-response';

@Injectable({
  providedIn: 'root',
})
export class PermitService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation apiPermitApplicationsPost
   */
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
  apiPermitApplicationsPost$Response(params: {
    body: PermitAppUpsertRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<PermitCommandResponse>> {

    const rb = new RequestBuilder(this.rootUrl, PermitService.ApiPermitApplicationsPostPath, 'post');
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
        return r as StrictHttpResponse<PermitCommandResponse>;
      })
    );
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
  apiPermitApplicationsPost(params: {
    body: PermitAppUpsertRequest
  },
  context?: HttpContext

): Observable<PermitCommandResponse> {

    return this.apiPermitApplicationsPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<PermitCommandResponse>) => r.body as PermitCommandResponse)
    );
  }

  /**
   * Path part for operation apiPermitApplicationsLicenceAppIdGet
   */
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
  apiPermitApplicationsLicenceAppIdGet$Response(params: {
    licenceAppId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<PermitLicenceAppResponse>> {

    const rb = new RequestBuilder(this.rootUrl, PermitService.ApiPermitApplicationsLicenceAppIdGetPath, 'get');
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
        return r as StrictHttpResponse<PermitLicenceAppResponse>;
      })
    );
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
  apiPermitApplicationsLicenceAppIdGet(params: {
    licenceAppId: string;
  },
  context?: HttpContext

): Observable<PermitLicenceAppResponse> {

    return this.apiPermitApplicationsLicenceAppIdGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<PermitLicenceAppResponse>) => r.body as PermitLicenceAppResponse)
    );
  }

  /**
   * Path part for operation apiPermitApplicationsFilesPost
   */
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
  apiPermitApplicationsFilesPost$Response(params?: {
    body?: {
'Documents'?: Array<Blob>;
'LicenceDocumentTypeCode'?: LicenceDocumentTypeCode;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<string>> {

    const rb = new RequestBuilder(this.rootUrl, PermitService.ApiPermitApplicationsFilesPostPath, 'post');
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
   * Uploading file only save files in cache, the files are not connected to the application yet.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiPermitApplicationsFilesPost$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiPermitApplicationsFilesPost(params?: {
    body?: {
'Documents'?: Array<Blob>;
'LicenceDocumentTypeCode'?: LicenceDocumentTypeCode;
}
  },
  context?: HttpContext

): Observable<string> {

    return this.apiPermitApplicationsFilesPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<string>) => r.body as string)
    );
  }

  /**
   * Path part for operation apiPermitApplicationGet
   */
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
  apiPermitApplicationGet$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<PermitLicenceAppResponse>> {

    const rb = new RequestBuilder(this.rootUrl, PermitService.ApiPermitApplicationGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<PermitLicenceAppResponse>;
      })
    );
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
  apiPermitApplicationGet(params?: {
  },
  context?: HttpContext

): Observable<PermitLicenceAppResponse> {

    return this.apiPermitApplicationGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<PermitLicenceAppResponse>) => r.body as PermitLicenceAppResponse)
    );
  }

  /**
   * Path part for operation apiPermitApplicationsAnonymousKeyCodePost
   */
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
  apiPermitApplicationsAnonymousKeyCodePost$Response(params?: {
    body?: GoogleRecaptcha
  },
  context?: HttpContext

): Observable<StrictHttpResponse<IActionResult>> {

    const rb = new RequestBuilder(this.rootUrl, PermitService.ApiPermitApplicationsAnonymousKeyCodePostPath, 'post');
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
   * Upload Body Armour or Armour Vehicle permit application first step: frontend needs to make this first request to get a Guid code.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiPermitApplicationsAnonymousKeyCodePost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiPermitApplicationsAnonymousKeyCodePost(params?: {
    body?: GoogleRecaptcha
  },
  context?: HttpContext

): Observable<IActionResult> {

    return this.apiPermitApplicationsAnonymousKeyCodePost$Response(params,context).pipe(
      map((r: StrictHttpResponse<IActionResult>) => r.body as IActionResult)
    );
  }

  /**
   * Path part for operation apiPermitApplicationsAnonymousFilesPost
   */
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
  apiPermitApplicationsAnonymousFilesPost$Response(params?: {
    body?: {
'Documents'?: Array<Blob>;
'LicenceDocumentTypeCode'?: LicenceDocumentTypeCode;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<string>> {

    const rb = new RequestBuilder(this.rootUrl, PermitService.ApiPermitApplicationsAnonymousFilesPostPath, 'post');
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
  apiPermitApplicationsAnonymousFilesPost(params?: {
    body?: {
'Documents'?: Array<Blob>;
'LicenceDocumentTypeCode'?: LicenceDocumentTypeCode;
}
  },
  context?: HttpContext

): Observable<string> {

    return this.apiPermitApplicationsAnonymousFilesPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<string>) => r.body as string)
    );
  }

  /**
   * Path part for operation apiPermitApplicationsAnonymousSubmitPost
   */
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
  apiPermitApplicationsAnonymousSubmitPost$Response(params?: {

    /**
     * PermitAppAnonymousSubmitRequest data
     */
    body?: PermitAppSubmitRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<PermitAppCommandResponse>> {

    const rb = new RequestBuilder(this.rootUrl, PermitService.ApiPermitApplicationsAnonymousSubmitPostPath, 'post');
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
        return r as StrictHttpResponse<PermitAppCommandResponse>;
      })
    );
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
  apiPermitApplicationsAnonymousSubmitPost(params?: {

    /**
     * PermitAppAnonymousSubmitRequest data
     */
    body?: PermitAppSubmitRequest
  },
  context?: HttpContext

): Observable<PermitAppCommandResponse> {

    return this.apiPermitApplicationsAnonymousSubmitPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<PermitAppCommandResponse>) => r.body as PermitAppCommandResponse)
    );
  }

}
