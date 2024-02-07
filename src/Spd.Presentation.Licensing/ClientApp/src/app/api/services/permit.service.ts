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
import { LicenceDocumentTypeCode } from '../models/licence-document-type-code';
import { PermitAppAnonymousSubmitRequest } from '../models/permit-app-anonymous-submit-request';
import { PermitAppCommandResponse } from '../models/permit-app-command-response';

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
   * Path part for operation apiPermitApplicationsAnonymousKeyCodePost
   */
  static readonly ApiPermitApplicationsAnonymousKeyCodePostPath = '/api/permit-applications/anonymous/keyCode';

  /**
   * Upload  Body Armor or Armor Vehicle permit application first step: frontend needs to make this first request to get a Guid code.
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

): Observable<StrictHttpResponse<string>> {

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
        return r as StrictHttpResponse<string>;
      })
    );
  }

  /**
   * Upload  Body Armor or Armor Vehicle permit application first step: frontend needs to make this first request to get a Guid code.
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

): Observable<string> {

    return this.apiPermitApplicationsAnonymousKeyCodePost$Response(params,context).pipe(
      map((r: StrictHttpResponse<string>) => r.body as string)
    );
  }

  /**
   * Path part for operation apiPermitApplicationsAnonymousKeyCodeFilesPost
   */
  static readonly ApiPermitApplicationsAnonymousKeyCodeFilesPostPath = '/api/permit-applications/anonymous/{keyCode}/files';

  /**
   * Upload Body Armor or Armor Vehicle permit application files: frontend use the keyCode to upload following files.
   * Uploading file only save files in cache, the files are not connected to the appliation yet.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiPermitApplicationsAnonymousKeyCodeFilesPost()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiPermitApplicationsAnonymousKeyCodeFilesPost$Response(params: {
    keyCode: string;
    body?: {
'Documents'?: Array<Blob>;
'LicenceDocumentTypeCode'?: LicenceDocumentTypeCode;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<string>> {

    const rb = new RequestBuilder(this.rootUrl, PermitService.ApiPermitApplicationsAnonymousKeyCodeFilesPostPath, 'post');
    if (params) {
      rb.path('keyCode', params.keyCode, {"style":"simple"});
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
   * Upload Body Armor or Armor Vehicle permit application files: frontend use the keyCode to upload following files.
   * Uploading file only save files in cache, the files are not connected to the appliation yet.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiPermitApplicationsAnonymousKeyCodeFilesPost$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiPermitApplicationsAnonymousKeyCodeFilesPost(params: {
    keyCode: string;
    body?: {
'Documents'?: Array<Blob>;
'LicenceDocumentTypeCode'?: LicenceDocumentTypeCode;
}
  },
  context?: HttpContext

): Observable<string> {

    return this.apiPermitApplicationsAnonymousKeyCodeFilesPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<string>) => r.body as string)
    );
  }

  /**
   * Path part for operation apiPermitApplicationsAnonymousKeyCodeSubmitPost
   */
  static readonly ApiPermitApplicationsAnonymousKeyCodeSubmitPostPath = '/api/permit-applications/anonymous/{keyCode}/submit';

  /**
   * Submit Body Armor or Armor Vehicle permit application Anonymously
   * After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiPermitApplicationsAnonymousKeyCodeSubmitPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiPermitApplicationsAnonymousKeyCodeSubmitPost$Response(params: {
    keyCode: string;

    /**
     * PermitAppAnonymousSubmitRequest data
     */
    body?: PermitAppAnonymousSubmitRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<PermitAppCommandResponse>> {

    const rb = new RequestBuilder(this.rootUrl, PermitService.ApiPermitApplicationsAnonymousKeyCodeSubmitPostPath, 'post');
    if (params) {
      rb.path('keyCode', params.keyCode, {"style":"simple"});
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
   * Submit Body Armor or Armor Vehicle permit application Anonymously
   * After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiPermitApplicationsAnonymousKeyCodeSubmitPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiPermitApplicationsAnonymousKeyCodeSubmitPost(params: {
    keyCode: string;

    /**
     * PermitAppAnonymousSubmitRequest data
     */
    body?: PermitAppAnonymousSubmitRequest
  },
  context?: HttpContext

): Observable<PermitAppCommandResponse> {

    return this.apiPermitApplicationsAnonymousKeyCodeSubmitPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<PermitAppCommandResponse>) => r.body as PermitAppCommandResponse)
    );
  }

}
