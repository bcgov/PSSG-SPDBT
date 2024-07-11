/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { apiApplicantsApplicantIdScreeningsApplicationIdGet } from '../fn/applicant/api-applicants-applicant-id-screenings-application-id-get';
import { ApiApplicantsApplicantIdScreeningsApplicationIdGet$Params } from '../fn/applicant/api-applicants-applicant-id-screenings-application-id-get';
import { apiApplicantsApplicantIdScreeningsGet } from '../fn/applicant/api-applicants-applicant-id-screenings-get';
import { ApiApplicantsApplicantIdScreeningsGet$Params } from '../fn/applicant/api-applicants-applicant-id-screenings-get';
import { apiApplicantsClearancesShareableGet } from '../fn/applicant/api-applicants-clearances-shareable-get';
import { ApiApplicantsClearancesShareableGet$Params } from '../fn/applicant/api-applicants-clearances-shareable-get';
import { apiApplicantsInvitesPost } from '../fn/applicant/api-applicants-invites-post';
import { ApiApplicantsInvitesPost$Params } from '../fn/applicant/api-applicants-invites-post';
import { apiApplicantsScreeningsAnonymousPost } from '../fn/applicant/api-applicants-screenings-anonymous-post';
import { ApiApplicantsScreeningsAnonymousPost$Params } from '../fn/applicant/api-applicants-screenings-anonymous-post';
import { apiApplicantsScreeningsApplicationIdFilesGet } from '../fn/applicant/api-applicants-screenings-application-id-files-get';
import { ApiApplicantsScreeningsApplicationIdFilesGet$Params } from '../fn/applicant/api-applicants-screenings-application-id-files-get';
import { apiApplicantsScreeningsApplicationIdFilesPost } from '../fn/applicant/api-applicants-screenings-application-id-files-post';
import { ApiApplicantsScreeningsApplicationIdFilesPost$Params } from '../fn/applicant/api-applicants-screenings-application-id-files-post';
import { apiApplicantsScreeningsApplicationIdFileTemplatesGet } from '../fn/applicant/api-applicants-screenings-application-id-file-templates-get';
import { ApiApplicantsScreeningsApplicationIdFileTemplatesGet$Params } from '../fn/applicant/api-applicants-screenings-application-id-file-templates-get';
import { apiApplicantsScreeningsPost } from '../fn/applicant/api-applicants-screenings-post';
import { ApiApplicantsScreeningsPost$Params } from '../fn/applicant/api-applicants-screenings-post';
import { apiApplicantsUserinfoGet } from '../fn/applicant/api-applicants-userinfo-get';
import { ApiApplicantsUserinfoGet$Params } from '../fn/applicant/api-applicants-userinfo-get';
import { ApplicantAppFileCreateResponse } from '../models/applicant-app-file-create-response';
import { ApplicantApplicationFileListResponse } from '../models/applicant-application-file-list-response';
import { ApplicantApplicationListResponse } from '../models/applicant-application-list-response';
import { ApplicantApplicationResponse } from '../models/applicant-application-response';
import { ApplicantUserInfo } from '../models/applicant-user-info';
import { ApplicationCreateResponse } from '../models/application-create-response';
import { AppOrgResponse } from '../models/app-org-response';
import { ShareableClearanceResponse } from '../models/shareable-clearance-response';

@Injectable({ providedIn: 'root' })
export class ApplicantService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `apiApplicantsInvitesPost()` */
  static readonly ApiApplicantsInvitesPostPath = '/api/applicants/invites';

  /**
   * Verify if the current application invite is correct, and return needed info.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiApplicantsInvitesPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiApplicantsInvitesPost$Response(params: ApiApplicantsInvitesPost$Params, context?: HttpContext): Observable<StrictHttpResponse<AppOrgResponse>> {
    return apiApplicantsInvitesPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Verify if the current application invite is correct, and return needed info.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiApplicantsInvitesPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiApplicantsInvitesPost(params: ApiApplicantsInvitesPost$Params, context?: HttpContext): Observable<AppOrgResponse> {
    return this.apiApplicantsInvitesPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<AppOrgResponse>): AppOrgResponse => r.body)
    );
  }

  /** Path part for operation `apiApplicantsScreeningsPost()` */
  static readonly ApiApplicantsScreeningsPostPath = '/api/applicants/screenings';

  /**
   * create application.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiApplicantsScreeningsPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiApplicantsScreeningsPost$Response(params?: ApiApplicantsScreeningsPost$Params, context?: HttpContext): Observable<StrictHttpResponse<ApplicationCreateResponse>> {
    return apiApplicantsScreeningsPost(this.http, this.rootUrl, params, context);
  }

  /**
   * create application.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiApplicantsScreeningsPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiApplicantsScreeningsPost(params?: ApiApplicantsScreeningsPost$Params, context?: HttpContext): Observable<ApplicationCreateResponse> {
    return this.apiApplicantsScreeningsPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<ApplicationCreateResponse>): ApplicationCreateResponse => r.body)
    );
  }

  /** Path part for operation `apiApplicantsScreeningsAnonymousPost()` */
  static readonly ApiApplicantsScreeningsAnonymousPostPath = '/api/applicants/screenings/anonymous';

  /**
   * anonymous applicant create application.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiApplicantsScreeningsAnonymousPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiApplicantsScreeningsAnonymousPost$Response(params?: ApiApplicantsScreeningsAnonymousPost$Params, context?: HttpContext): Observable<StrictHttpResponse<ApplicationCreateResponse>> {
    return apiApplicantsScreeningsAnonymousPost(this.http, this.rootUrl, params, context);
  }

  /**
   * anonymous applicant create application.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiApplicantsScreeningsAnonymousPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiApplicantsScreeningsAnonymousPost(params?: ApiApplicantsScreeningsAnonymousPost$Params, context?: HttpContext): Observable<ApplicationCreateResponse> {
    return this.apiApplicantsScreeningsAnonymousPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<ApplicationCreateResponse>): ApplicationCreateResponse => r.body)
    );
  }

  /** Path part for operation `apiApplicantsClearancesShareableGet()` */
  static readonly ApiApplicantsClearancesShareableGetPath = '/api/applicants/clearances/shareable';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiApplicantsClearancesShareableGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsClearancesShareableGet$Response(params?: ApiApplicantsClearancesShareableGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ShareableClearanceResponse>> {
    return apiApplicantsClearancesShareableGet(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiApplicantsClearancesShareableGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsClearancesShareableGet(params?: ApiApplicantsClearancesShareableGet$Params, context?: HttpContext): Observable<ShareableClearanceResponse> {
    return this.apiApplicantsClearancesShareableGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<ShareableClearanceResponse>): ShareableClearanceResponse => r.body)
    );
  }

  /** Path part for operation `apiApplicantsApplicantIdScreeningsGet()` */
  static readonly ApiApplicantsApplicantIdScreeningsGetPath = '/api/applicants/{applicantId}/screenings';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiApplicantsApplicantIdScreeningsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsApplicantIdScreeningsGet$Response(params: ApiApplicantsApplicantIdScreeningsGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ApplicantApplicationListResponse>> {
    return apiApplicantsApplicantIdScreeningsGet(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiApplicantsApplicantIdScreeningsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsApplicantIdScreeningsGet(params: ApiApplicantsApplicantIdScreeningsGet$Params, context?: HttpContext): Observable<ApplicantApplicationListResponse> {
    return this.apiApplicantsApplicantIdScreeningsGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<ApplicantApplicationListResponse>): ApplicantApplicationListResponse => r.body)
    );
  }

  /** Path part for operation `apiApplicantsApplicantIdScreeningsApplicationIdGet()` */
  static readonly ApiApplicantsApplicantIdScreeningsApplicationIdGetPath = '/api/applicants/{applicantId}/screenings/{applicationId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiApplicantsApplicantIdScreeningsApplicationIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsApplicantIdScreeningsApplicationIdGet$Response(params: ApiApplicantsApplicantIdScreeningsApplicationIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ApplicantApplicationResponse>> {
    return apiApplicantsApplicantIdScreeningsApplicationIdGet(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiApplicantsApplicantIdScreeningsApplicationIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsApplicantIdScreeningsApplicationIdGet(params: ApiApplicantsApplicantIdScreeningsApplicationIdGet$Params, context?: HttpContext): Observable<ApplicantApplicationResponse> {
    return this.apiApplicantsApplicantIdScreeningsApplicationIdGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<ApplicantApplicationResponse>): ApplicantApplicationResponse => r.body)
    );
  }

  /** Path part for operation `apiApplicantsUserinfoGet()` */
  static readonly ApiApplicantsUserinfoGetPath = '/api/applicants/userinfo';

  /**
   * used for Applicants logs in with BCSC to submit an application.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiApplicantsUserinfoGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsUserinfoGet$Response(params?: ApiApplicantsUserinfoGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ApplicantUserInfo>> {
    return apiApplicantsUserinfoGet(this.http, this.rootUrl, params, context);
  }

  /**
   * used for Applicants logs in with BCSC to submit an application.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiApplicantsUserinfoGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsUserinfoGet(params?: ApiApplicantsUserinfoGet$Params, context?: HttpContext): Observable<ApplicantUserInfo> {
    return this.apiApplicantsUserinfoGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<ApplicantUserInfo>): ApplicantUserInfo => r.body)
    );
  }

  /** Path part for operation `apiApplicantsScreeningsApplicationIdFilesGet()` */
  static readonly ApiApplicantsScreeningsApplicationIdFilesGetPath = '/api/applicants/screenings/{applicationId}/files';

  /**
   * Get the list of all files the applicant has uploaded for the application.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiApplicantsScreeningsApplicationIdFilesGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsScreeningsApplicationIdFilesGet$Response(params: ApiApplicantsScreeningsApplicationIdFilesGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ApplicantApplicationFileListResponse>> {
    return apiApplicantsScreeningsApplicationIdFilesGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Get the list of all files the applicant has uploaded for the application.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiApplicantsScreeningsApplicationIdFilesGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsScreeningsApplicationIdFilesGet(params: ApiApplicantsScreeningsApplicationIdFilesGet$Params, context?: HttpContext): Observable<ApplicantApplicationFileListResponse> {
    return this.apiApplicantsScreeningsApplicationIdFilesGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<ApplicantApplicationFileListResponse>): ApplicantApplicationFileListResponse => r.body)
    );
  }

  /** Path part for operation `apiApplicantsScreeningsApplicationIdFilesPost()` */
  static readonly ApiApplicantsScreeningsApplicationIdFilesPostPath = '/api/applicants/screenings/{applicationId}/files';

  /**
   * Upload applicant app files.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiApplicantsScreeningsApplicationIdFilesPost()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiApplicantsScreeningsApplicationIdFilesPost$Response(params: ApiApplicantsScreeningsApplicationIdFilesPost$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<ApplicantAppFileCreateResponse>>> {
    return apiApplicantsScreeningsApplicationIdFilesPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Upload applicant app files.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiApplicantsScreeningsApplicationIdFilesPost$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiApplicantsScreeningsApplicationIdFilesPost(params: ApiApplicantsScreeningsApplicationIdFilesPost$Params, context?: HttpContext): Observable<Array<ApplicantAppFileCreateResponse>> {
    return this.apiApplicantsScreeningsApplicationIdFilesPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<ApplicantAppFileCreateResponse>>): Array<ApplicantAppFileCreateResponse> => r.body)
    );
  }

  /** Path part for operation `apiApplicantsScreeningsApplicationIdFileTemplatesGet()` */
  static readonly ApiApplicantsScreeningsApplicationIdFileTemplatesGetPath = '/api/applicants/screenings/{applicationId}/file-templates';

  /**
   * download the template document.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiApplicantsScreeningsApplicationIdFileTemplatesGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsScreeningsApplicationIdFileTemplatesGet$Response(params: ApiApplicantsScreeningsApplicationIdFileTemplatesGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Blob>> {
    return apiApplicantsScreeningsApplicationIdFileTemplatesGet(this.http, this.rootUrl, params, context);
  }

  /**
   * download the template document.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiApplicantsScreeningsApplicationIdFileTemplatesGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsScreeningsApplicationIdFileTemplatesGet(params: ApiApplicantsScreeningsApplicationIdFileTemplatesGet$Params, context?: HttpContext): Observable<Blob> {
    return this.apiApplicantsScreeningsApplicationIdFileTemplatesGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Blob>): Blob => r.body)
    );
  }

}
