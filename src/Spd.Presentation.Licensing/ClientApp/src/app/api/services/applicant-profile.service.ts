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

import { ApplicantListResponse } from '../models/applicant-list-response';
import { ApplicantProfileResponse } from '../models/applicant-profile-response';
import { ApplicantUpdateRequest } from '../models/applicant-update-request';
import { IActionResult } from '../models/i-action-result';
import { LicenceDocumentTypeCode } from '../models/licence-document-type-code';

@Injectable({
  providedIn: 'root',
})
export class ApplicantProfileService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation apiApplicantIdGet
   */
  static readonly ApiApplicantIdGetPath = '/api/applicant/{id}';

  /**
   * Get applicant profile.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiApplicantIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantIdGet$Response(params: {
    id: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ApplicantProfileResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicantProfileService.ApiApplicantIdGetPath, 'get');
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
        return r as StrictHttpResponse<ApplicantProfileResponse>;
      })
    );
  }

  /**
   * Get applicant profile.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiApplicantIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantIdGet(params: {
    id: string;
  },
  context?: HttpContext

): Observable<ApplicantProfileResponse> {

    return this.apiApplicantIdGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<ApplicantProfileResponse>) => r.body as ApplicantProfileResponse)
    );
  }

  /**
   * Path part for operation apiApplicantFilesPost
   */
  static readonly ApiApplicantFilesPostPath = '/api/applicant/files';

  /**
   * Uploading file only save files in cache, the files are not connected to the application yet.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiApplicantFilesPost()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiApplicantFilesPost$Response(params?: {
    body?: {
'Documents'?: Array<Blob>;
'LicenceDocumentTypeCode'?: LicenceDocumentTypeCode;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<string>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicantProfileService.ApiApplicantFilesPostPath, 'post');
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
   * To access the full response (for headers, for example), `apiApplicantFilesPost$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiApplicantFilesPost(params?: {
    body?: {
'Documents'?: Array<Blob>;
'LicenceDocumentTypeCode'?: LicenceDocumentTypeCode;
}
  },
  context?: HttpContext

): Observable<string> {

    return this.apiApplicantFilesPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<string>) => r.body as string)
    );
  }

  /**
   * Path part for operation apiApplicantApplicantIdPut
   */
  static readonly ApiApplicantApplicantIdPutPath = '/api/applicant/{applicantId}';

  /**
   * Submit applicant update.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiApplicantApplicantIdPut()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiApplicantApplicantIdPut$Response(params: {
    applicantId: string;

    /**
     * ApplicantUpdateRequest request
     */
    body?: ApplicantUpdateRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<string>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicantProfileService.ApiApplicantApplicantIdPutPath, 'put');
    if (params) {
      rb.path('applicantId', params.applicantId, {"style":"simple"});
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
   * Submit applicant update.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiApplicantApplicantIdPut$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiApplicantApplicantIdPut(params: {
    applicantId: string;

    /**
     * ApplicantUpdateRequest request
     */
    body?: ApplicantUpdateRequest
  },
  context?: HttpContext

): Observable<string> {

    return this.apiApplicantApplicantIdPut$Response(params,context).pipe(
      map((r: StrictHttpResponse<string>) => r.body as string)
    );
  }

  /**
   * Path part for operation apiApplicantSearchGet
   */
  static readonly ApiApplicantSearchGetPath = '/api/applicant/search';

  /**
   * Get applicants who has the same name and birthday as login person.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiApplicantSearchGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantSearchGet$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Array<ApplicantListResponse>>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicantProfileService.ApiApplicantSearchGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<ApplicantListResponse>>;
      })
    );
  }

  /**
   * Get applicants who has the same name and birthday as login person.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiApplicantSearchGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantSearchGet(params?: {
  },
  context?: HttpContext

): Observable<Array<ApplicantListResponse>> {

    return this.apiApplicantSearchGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<Array<ApplicantListResponse>>) => r.body as Array<ApplicantListResponse>)
    );
  }

  /**
   * Path part for operation apiApplicantMergeOldApplicantIdNewApplicantIdGet
   */
  static readonly ApiApplicantMergeOldApplicantIdNewApplicantIdGetPath = '/api/applicant/merge/{oldApplicantId}/{newApplicantId}';

  /**
   * Merge the old applicant to the new applicant, old applicant will be marked as inactive. All the entities reference to old applicant will be changed to refer to new applicant.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiApplicantMergeOldApplicantIdNewApplicantIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantMergeOldApplicantIdNewApplicantIdGet$Response(params: {
    oldApplicantId: string;
    newApplicantId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<IActionResult>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicantProfileService.ApiApplicantMergeOldApplicantIdNewApplicantIdGetPath, 'get');
    if (params) {
      rb.path('oldApplicantId', params.oldApplicantId, {"style":"simple"});
      rb.path('newApplicantId', params.newApplicantId, {"style":"simple"});
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
   * Merge the old applicant to the new applicant, old applicant will be marked as inactive. All the entities reference to old applicant will be changed to refer to new applicant.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiApplicantMergeOldApplicantIdNewApplicantIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantMergeOldApplicantIdNewApplicantIdGet(params: {
    oldApplicantId: string;
    newApplicantId: string;
  },
  context?: HttpContext

): Observable<IActionResult> {

    return this.apiApplicantMergeOldApplicantIdNewApplicantIdGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<IActionResult>) => r.body as IActionResult)
    );
  }

}
