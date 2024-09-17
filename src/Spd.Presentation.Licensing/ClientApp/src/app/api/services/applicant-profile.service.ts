/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { apiApplicantApplicantIdPut } from '../fn/applicant-profile/api-applicant-applicant-id-put';
import { ApiApplicantApplicantIdPut$Params } from '../fn/applicant-profile/api-applicant-applicant-id-put';
import { apiApplicantFilesPost } from '../fn/applicant-profile/api-applicant-files-post';
import { ApiApplicantFilesPost$Params } from '../fn/applicant-profile/api-applicant-files-post';
import { apiApplicantGet } from '../fn/applicant-profile/api-applicant-get';
import { ApiApplicantGet$Params } from '../fn/applicant-profile/api-applicant-get';
import { apiApplicantIdGet } from '../fn/applicant-profile/api-applicant-id-get';
import { ApiApplicantIdGet$Params } from '../fn/applicant-profile/api-applicant-id-get';
import { apiApplicantMergeOldApplicantIdNewApplicantIdGet } from '../fn/applicant-profile/api-applicant-merge-old-applicant-id-new-applicant-id-get';
import { ApiApplicantMergeOldApplicantIdNewApplicantIdGet$Params } from '../fn/applicant-profile/api-applicant-merge-old-applicant-id-new-applicant-id-get';
import { apiApplicantSearchGet } from '../fn/applicant-profile/api-applicant-search-get';
import { ApiApplicantSearchGet$Params } from '../fn/applicant-profile/api-applicant-search-get';
import { ApplicantListResponse } from '../models/applicant-list-response';
import { ApplicantProfileResponse } from '../models/applicant-profile-response';
import { IActionResult } from '../models/i-action-result';

@Injectable({ providedIn: 'root' })
export class ApplicantProfileService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `apiApplicantIdGet()` */
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
  apiApplicantIdGet$Response(params: ApiApplicantIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ApplicantProfileResponse>> {
    return apiApplicantIdGet(this.http, this.rootUrl, params, context);
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
  apiApplicantIdGet(params: ApiApplicantIdGet$Params, context?: HttpContext): Observable<ApplicantProfileResponse> {
    return this.apiApplicantIdGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<ApplicantProfileResponse>): ApplicantProfileResponse => r.body)
    );
  }

  /** Path part for operation `apiApplicantFilesPost()` */
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
  apiApplicantFilesPost$Response(params?: ApiApplicantFilesPost$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
    return apiApplicantFilesPost(this.http, this.rootUrl, params, context);
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
  apiApplicantFilesPost(params?: ApiApplicantFilesPost$Params, context?: HttpContext): Observable<string> {
    return this.apiApplicantFilesPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<string>): string => r.body)
    );
  }

  /** Path part for operation `apiApplicantApplicantIdPut()` */
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
  apiApplicantApplicantIdPut$Response(params: ApiApplicantApplicantIdPut$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
    return apiApplicantApplicantIdPut(this.http, this.rootUrl, params, context);
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
  apiApplicantApplicantIdPut(params: ApiApplicantApplicantIdPut$Params, context?: HttpContext): Observable<string> {
    return this.apiApplicantApplicantIdPut$Response(params, context).pipe(
      map((r: StrictHttpResponse<string>): string => r.body)
    );
  }

  /** Path part for operation `apiApplicantSearchGet()` */
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
  apiApplicantSearchGet$Response(params?: ApiApplicantSearchGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<ApplicantListResponse>>> {
    return apiApplicantSearchGet(this.http, this.rootUrl, params, context);
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
  apiApplicantSearchGet(params?: ApiApplicantSearchGet$Params, context?: HttpContext): Observable<Array<ApplicantListResponse>> {
    return this.apiApplicantSearchGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<ApplicantListResponse>>): Array<ApplicantListResponse> => r.body)
    );
  }

  /** Path part for operation `apiApplicantMergeOldApplicantIdNewApplicantIdGet()` */
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
  apiApplicantMergeOldApplicantIdNewApplicantIdGet$Response(params: ApiApplicantMergeOldApplicantIdNewApplicantIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<IActionResult>> {
    return apiApplicantMergeOldApplicantIdNewApplicantIdGet(this.http, this.rootUrl, params, context);
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
  apiApplicantMergeOldApplicantIdNewApplicantIdGet(params: ApiApplicantMergeOldApplicantIdNewApplicantIdGet$Params, context?: HttpContext): Observable<IActionResult> {
    return this.apiApplicantMergeOldApplicantIdNewApplicantIdGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<IActionResult>): IActionResult => r.body)
    );
  }

  /** Path part for operation `apiApplicantGet()` */
  static readonly ApiApplicantGetPath = '/api/applicant';

  /**
   * Get applicant profile anonymously, the applicantId is retrieved from cookies.
   * For controlling member, The cookie is set when the user click the update cm email link, verify the invitation.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiApplicantGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantGet$Response(params?: ApiApplicantGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ApplicantProfileResponse>> {
    return apiApplicantGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Get applicant profile anonymously, the applicantId is retrieved from cookies.
   * For controlling member, The cookie is set when the user click the update cm email link, verify the invitation.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiApplicantGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantGet(params?: ApiApplicantGet$Params, context?: HttpContext): Observable<ApplicantProfileResponse> {
    return this.apiApplicantGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<ApplicantProfileResponse>): ApplicantProfileResponse => r.body)
    );
  }

}
