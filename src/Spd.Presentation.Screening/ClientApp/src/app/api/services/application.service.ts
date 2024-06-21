/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { ActionResult } from '../models/action-result';
import { apiOrgsOrgIdApplicationInvitesApplicationInviteIdDelete } from '../fn/application/api-orgs-org-id-application-invites-application-invite-id-delete';
import { ApiOrgsOrgIdApplicationInvitesApplicationInviteIdDelete$Params } from '../fn/application/api-orgs-org-id-application-invites-application-invite-id-delete';
import { apiOrgsOrgIdApplicationInvitesGet } from '../fn/application/api-orgs-org-id-application-invites-get';
import { ApiOrgsOrgIdApplicationInvitesGet$Params } from '../fn/application/api-orgs-org-id-application-invites-get';
import { apiOrgsOrgIdApplicationInvitesPost } from '../fn/application/api-orgs-org-id-application-invites-post';
import { ApiOrgsOrgIdApplicationInvitesPost$Params } from '../fn/application/api-orgs-org-id-application-invites-post';
import { apiOrgsOrgIdApplicationPost } from '../fn/application/api-orgs-org-id-application-post';
import { ApiOrgsOrgIdApplicationPost$Params } from '../fn/application/api-orgs-org-id-application-post';
import { apiOrgsOrgIdApplicationsBulkHistoryGet } from '../fn/application/api-orgs-org-id-applications-bulk-history-get';
import { ApiOrgsOrgIdApplicationsBulkHistoryGet$Params } from '../fn/application/api-orgs-org-id-applications-bulk-history-get';
import { apiOrgsOrgIdApplicationsBulkPost } from '../fn/application/api-orgs-org-id-applications-bulk-post';
import { ApiOrgsOrgIdApplicationsBulkPost$Params } from '../fn/application/api-orgs-org-id-applications-bulk-post';
import { apiOrgsOrgIdApplicationsGet } from '../fn/application/api-orgs-org-id-applications-get';
import { ApiOrgsOrgIdApplicationsGet$Params } from '../fn/application/api-orgs-org-id-applications-get';
import { apiOrgsOrgIdApplicationsPaymentsGet } from '../fn/application/api-orgs-org-id-applications-payments-get';
import { ApiOrgsOrgIdApplicationsPaymentsGet$Params } from '../fn/application/api-orgs-org-id-applications-payments-get';
import { apiOrgsOrgIdApplicationStatisticsGet } from '../fn/application/api-orgs-org-id-application-statistics-get';
import { ApiOrgsOrgIdApplicationStatisticsGet$Params } from '../fn/application/api-orgs-org-id-application-statistics-get';
import { apiOrgsOrgIdClearancesClearanceIdFileGet } from '../fn/application/api-orgs-org-id-clearances-clearance-id-file-get';
import { ApiOrgsOrgIdClearancesClearanceIdFileGet$Params } from '../fn/application/api-orgs-org-id-clearances-clearance-id-file-get';
import { apiOrgsOrgIdClearancesExpiredClearanceAccessIdDelete } from '../fn/application/api-orgs-org-id-clearances-expired-clearance-access-id-delete';
import { ApiOrgsOrgIdClearancesExpiredClearanceAccessIdDelete$Params } from '../fn/application/api-orgs-org-id-clearances-expired-clearance-access-id-delete';
import { apiOrgsOrgIdClearancesExpiredClearanceIdGet } from '../fn/application/api-orgs-org-id-clearances-expired-clearance-id-get';
import { ApiOrgsOrgIdClearancesExpiredClearanceIdGet$Params } from '../fn/application/api-orgs-org-id-clearances-expired-clearance-id-get';
import { apiOrgsOrgIdClearancesExpiredGet } from '../fn/application/api-orgs-org-id-clearances-expired-get';
import { ApiOrgsOrgIdClearancesExpiredGet$Params } from '../fn/application/api-orgs-org-id-clearances-expired-get';
import { apiOrgsOrgIdIdentityApplicationIdPut } from '../fn/application/api-orgs-org-id-identity-application-id-put';
import { ApiOrgsOrgIdIdentityApplicationIdPut$Params } from '../fn/application/api-orgs-org-id-identity-application-id-put';
import { apiUsersDelegateUserIdPssoApplicationStatisticsGet } from '../fn/application/api-users-delegate-user-id-psso-application-statistics-get';
import { ApiUsersDelegateUserIdPssoApplicationStatisticsGet$Params } from '../fn/application/api-users-delegate-user-id-psso-application-statistics-get';
import { ApplicationCreateResponse } from '../models/application-create-response';
import { ApplicationInviteListResponse } from '../models/application-invite-list-response';
import { ApplicationInvitePrepopulateDataResponse } from '../models/application-invite-prepopulate-data-response';
import { ApplicationInvitesCreateResponse } from '../models/application-invites-create-response';
import { ApplicationListResponse } from '../models/application-list-response';
import { ApplicationPaymentListResponse } from '../models/application-payment-list-response';
import { ApplicationStatisticsResponse } from '../models/application-statistics-response';
import { BulkHistoryListResponse } from '../models/bulk-history-list-response';
import { BulkUploadCreateResponse } from '../models/bulk-upload-create-response';
import { ClearanceAccessListResponse } from '../models/clearance-access-list-response';

@Injectable({ providedIn: 'root' })
export class ApplicationService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `apiOrgsOrgIdApplicationInvitesGet()` */
  static readonly ApiOrgsOrgIdApplicationInvitesGetPath = '/api/orgs/{orgId}/application-invites';

  /**
   * get the active application invites list.
   * support wildcard search for email and name, it will search email or name contains str.
   * sample: /application-invites?filters=searchText@=str.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdApplicationInvitesGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdApplicationInvitesGet$Response(params: ApiOrgsOrgIdApplicationInvitesGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ApplicationInviteListResponse>> {
    return apiOrgsOrgIdApplicationInvitesGet(this.http, this.rootUrl, params, context);
  }

  /**
   * get the active application invites list.
   * support wildcard search for email and name, it will search email or name contains str.
   * sample: /application-invites?filters=searchText@=str.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdApplicationInvitesGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdApplicationInvitesGet(params: ApiOrgsOrgIdApplicationInvitesGet$Params, context?: HttpContext): Observable<ApplicationInviteListResponse> {
    return this.apiOrgsOrgIdApplicationInvitesGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<ApplicationInviteListResponse>): ApplicationInviteListResponse => r.body)
    );
  }

  /** Path part for operation `apiOrgsOrgIdApplicationInvitesPost()` */
  static readonly ApiOrgsOrgIdApplicationInvitesPostPath = '/api/orgs/{orgId}/application-invites';

  /**
   * create more than one application invites. if checkDuplicate is true, the implementation will check if there is existing duplicated applicants or invites.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdApplicationInvitesPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgsOrgIdApplicationInvitesPost$Response(params: ApiOrgsOrgIdApplicationInvitesPost$Params, context?: HttpContext): Observable<StrictHttpResponse<ApplicationInvitesCreateResponse>> {
    return apiOrgsOrgIdApplicationInvitesPost(this.http, this.rootUrl, params, context);
  }

  /**
   * create more than one application invites. if checkDuplicate is true, the implementation will check if there is existing duplicated applicants or invites.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdApplicationInvitesPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgsOrgIdApplicationInvitesPost(params: ApiOrgsOrgIdApplicationInvitesPost$Params, context?: HttpContext): Observable<ApplicationInvitesCreateResponse> {
    return this.apiOrgsOrgIdApplicationInvitesPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<ApplicationInvitesCreateResponse>): ApplicationInvitesCreateResponse => r.body)
    );
  }

  /** Path part for operation `apiOrgsOrgIdApplicationInvitesApplicationInviteIdDelete()` */
  static readonly ApiOrgsOrgIdApplicationInvitesApplicationInviteIdDeletePath = '/api/orgs/{orgId}/application-invites/{applicationInviteId}';

  /**
   * remove the invitation for a organization.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdApplicationInvitesApplicationInviteIdDelete()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdApplicationInvitesApplicationInviteIdDelete$Response(params: ApiOrgsOrgIdApplicationInvitesApplicationInviteIdDelete$Params, context?: HttpContext): Observable<StrictHttpResponse<ActionResult>> {
    return apiOrgsOrgIdApplicationInvitesApplicationInviteIdDelete(this.http, this.rootUrl, params, context);
  }

  /**
   * remove the invitation for a organization.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdApplicationInvitesApplicationInviteIdDelete$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdApplicationInvitesApplicationInviteIdDelete(params: ApiOrgsOrgIdApplicationInvitesApplicationInviteIdDelete$Params, context?: HttpContext): Observable<ActionResult> {
    return this.apiOrgsOrgIdApplicationInvitesApplicationInviteIdDelete$Response(params, context).pipe(
      map((r: StrictHttpResponse<ActionResult>): ActionResult => r.body)
    );
  }

  /** Path part for operation `apiOrgsOrgIdApplicationsBulkHistoryGet()` */
  static readonly ApiOrgsOrgIdApplicationsBulkHistoryGetPath = '/api/orgs/{orgId}/applications/bulk/history';

  /**
   * return all bulk upload history belong to the organization.
   * sort: submittedon, default will be desc.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdApplicationsBulkHistoryGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdApplicationsBulkHistoryGet$Response(params: ApiOrgsOrgIdApplicationsBulkHistoryGet$Params, context?: HttpContext): Observable<StrictHttpResponse<BulkHistoryListResponse>> {
    return apiOrgsOrgIdApplicationsBulkHistoryGet(this.http, this.rootUrl, params, context);
  }

  /**
   * return all bulk upload history belong to the organization.
   * sort: submittedon, default will be desc.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdApplicationsBulkHistoryGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdApplicationsBulkHistoryGet(params: ApiOrgsOrgIdApplicationsBulkHistoryGet$Params, context?: HttpContext): Observable<BulkHistoryListResponse> {
    return this.apiOrgsOrgIdApplicationsBulkHistoryGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<BulkHistoryListResponse>): BulkHistoryListResponse => r.body)
    );
  }

  /** Path part for operation `apiOrgsOrgIdApplicationsBulkPost()` */
  static readonly ApiOrgsOrgIdApplicationsBulkPostPath = '/api/orgs/{orgId}/applications/bulk';

  /**
   * create more than one application invites. if checkDuplicate is true, the implementation will check if there is existing duplicated applicants or invites.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdApplicationsBulkPost()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiOrgsOrgIdApplicationsBulkPost$Response(params: ApiOrgsOrgIdApplicationsBulkPost$Params, context?: HttpContext): Observable<StrictHttpResponse<BulkUploadCreateResponse>> {
    return apiOrgsOrgIdApplicationsBulkPost(this.http, this.rootUrl, params, context);
  }

  /**
   * create more than one application invites. if checkDuplicate is true, the implementation will check if there is existing duplicated applicants or invites.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdApplicationsBulkPost$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiOrgsOrgIdApplicationsBulkPost(params: ApiOrgsOrgIdApplicationsBulkPost$Params, context?: HttpContext): Observable<BulkUploadCreateResponse> {
    return this.apiOrgsOrgIdApplicationsBulkPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<BulkUploadCreateResponse>): BulkUploadCreateResponse => r.body)
    );
  }

  /** Path part for operation `apiOrgsOrgIdApplicationStatisticsGet()` */
  static readonly ApiOrgsOrgIdApplicationStatisticsGetPath = '/api/orgs/{orgId}/application-statistics';

  /**
   * return the application statistics for a particular organization.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdApplicationStatisticsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdApplicationStatisticsGet$Response(params: ApiOrgsOrgIdApplicationStatisticsGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ApplicationStatisticsResponse>> {
    return apiOrgsOrgIdApplicationStatisticsGet(this.http, this.rootUrl, params, context);
  }

  /**
   * return the application statistics for a particular organization.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdApplicationStatisticsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdApplicationStatisticsGet(params: ApiOrgsOrgIdApplicationStatisticsGet$Params, context?: HttpContext): Observable<ApplicationStatisticsResponse> {
    return this.apiOrgsOrgIdApplicationStatisticsGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<ApplicationStatisticsResponse>): ApplicationStatisticsResponse => r.body)
    );
  }

  /** Path part for operation `apiUsersDelegateUserIdPssoApplicationStatisticsGet()` */
  static readonly ApiUsersDelegateUserIdPssoApplicationStatisticsGetPath = '/api/users/{delegateUserId}/psso-application-statistics';

  /**
   * return the application statistics for a particular delegate.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiUsersDelegateUserIdPssoApplicationStatisticsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiUsersDelegateUserIdPssoApplicationStatisticsGet$Response(params: ApiUsersDelegateUserIdPssoApplicationStatisticsGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ApplicationStatisticsResponse>> {
    return apiUsersDelegateUserIdPssoApplicationStatisticsGet(this.http, this.rootUrl, params, context);
  }

  /**
   * return the application statistics for a particular delegate.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiUsersDelegateUserIdPssoApplicationStatisticsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiUsersDelegateUserIdPssoApplicationStatisticsGet(params: ApiUsersDelegateUserIdPssoApplicationStatisticsGet$Params, context?: HttpContext): Observable<ApplicationStatisticsResponse> {
    return this.apiUsersDelegateUserIdPssoApplicationStatisticsGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<ApplicationStatisticsResponse>): ApplicationStatisticsResponse => r.body)
    );
  }

  /** Path part for operation `apiOrgsOrgIdIdentityApplicationIdPut()` */
  static readonly ApiOrgsOrgIdIdentityApplicationIdPutPath = '/api/orgs/{orgId}/identity/{applicationId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdIdentityApplicationIdPut()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdIdentityApplicationIdPut$Response(params: ApiOrgsOrgIdIdentityApplicationIdPut$Params, context?: HttpContext): Observable<StrictHttpResponse<ActionResult>> {
    return apiOrgsOrgIdIdentityApplicationIdPut(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdIdentityApplicationIdPut$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdIdentityApplicationIdPut(params: ApiOrgsOrgIdIdentityApplicationIdPut$Params, context?: HttpContext): Observable<ActionResult> {
    return this.apiOrgsOrgIdIdentityApplicationIdPut$Response(params, context).pipe(
      map((r: StrictHttpResponse<ActionResult>): ActionResult => r.body)
    );
  }

  /** Path part for operation `apiOrgsOrgIdApplicationPost()` */
  static readonly ApiOrgsOrgIdApplicationPostPath = '/api/orgs/{orgId}/application';

  /**
   * create application. if checkDuplicate is true, it will check if there is existing duplicated applications.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdApplicationPost()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiOrgsOrgIdApplicationPost$Response(params: ApiOrgsOrgIdApplicationPost$Params, context?: HttpContext): Observable<StrictHttpResponse<ApplicationCreateResponse>> {
    return apiOrgsOrgIdApplicationPost(this.http, this.rootUrl, params, context);
  }

  /**
   * create application. if checkDuplicate is true, it will check if there is existing duplicated applications.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdApplicationPost$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiOrgsOrgIdApplicationPost(params: ApiOrgsOrgIdApplicationPost$Params, context?: HttpContext): Observable<ApplicationCreateResponse> {
    return this.apiOrgsOrgIdApplicationPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<ApplicationCreateResponse>): ApplicationCreateResponse => r.body)
    );
  }

  /** Path part for operation `apiOrgsOrgIdApplicationsGet()` */
  static readonly ApiOrgsOrgIdApplicationsGetPath = '/api/orgs/{orgId}/applications';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdApplicationsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdApplicationsGet$Response(params: ApiOrgsOrgIdApplicationsGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ApplicationListResponse>> {
    return apiOrgsOrgIdApplicationsGet(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdApplicationsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdApplicationsGet(params: ApiOrgsOrgIdApplicationsGet$Params, context?: HttpContext): Observable<ApplicationListResponse> {
    return this.apiOrgsOrgIdApplicationsGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<ApplicationListResponse>): ApplicationListResponse => r.body)
    );
  }

  /** Path part for operation `apiOrgsOrgIdApplicationsPaymentsGet()` */
  static readonly ApiOrgsOrgIdApplicationsPaymentsGetPath = '/api/orgs/{orgId}/applications/payments';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdApplicationsPaymentsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdApplicationsPaymentsGet$Response(params: ApiOrgsOrgIdApplicationsPaymentsGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ApplicationPaymentListResponse>> {
    return apiOrgsOrgIdApplicationsPaymentsGet(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdApplicationsPaymentsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdApplicationsPaymentsGet(params: ApiOrgsOrgIdApplicationsPaymentsGet$Params, context?: HttpContext): Observable<ApplicationPaymentListResponse> {
    return this.apiOrgsOrgIdApplicationsPaymentsGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<ApplicationPaymentListResponse>): ApplicationPaymentListResponse => r.body)
    );
  }

  /** Path part for operation `apiOrgsOrgIdClearancesExpiredGet()` */
  static readonly ApiOrgsOrgIdClearancesExpiredGetPath = '/api/orgs/{orgId}/clearances/expired';

  /**
   * return 
   * sort: expiresOn, default will be asc. Applicant Name, Email.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdClearancesExpiredGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdClearancesExpiredGet$Response(params: ApiOrgsOrgIdClearancesExpiredGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ClearanceAccessListResponse>> {
    return apiOrgsOrgIdClearancesExpiredGet(this.http, this.rootUrl, params, context);
  }

  /**
   * return 
   * sort: expiresOn, default will be asc. Applicant Name, Email.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdClearancesExpiredGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdClearancesExpiredGet(params: ApiOrgsOrgIdClearancesExpiredGet$Params, context?: HttpContext): Observable<ClearanceAccessListResponse> {
    return this.apiOrgsOrgIdClearancesExpiredGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<ClearanceAccessListResponse>): ClearanceAccessListResponse => r.body)
    );
  }

  /** Path part for operation `apiOrgsOrgIdClearancesExpiredClearanceAccessIdDelete()` */
  static readonly ApiOrgsOrgIdClearancesExpiredClearanceAccessIdDeletePath = '/api/orgs/{orgId}/clearances/expired/{clearanceAccessId}';

  /**
   * Mark the clearance access record as inactive.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdClearancesExpiredClearanceAccessIdDelete()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdClearancesExpiredClearanceAccessIdDelete$Response(params: ApiOrgsOrgIdClearancesExpiredClearanceAccessIdDelete$Params, context?: HttpContext): Observable<StrictHttpResponse<ActionResult>> {
    return apiOrgsOrgIdClearancesExpiredClearanceAccessIdDelete(this.http, this.rootUrl, params, context);
  }

  /**
   * Mark the clearance access record as inactive.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdClearancesExpiredClearanceAccessIdDelete$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdClearancesExpiredClearanceAccessIdDelete(params: ApiOrgsOrgIdClearancesExpiredClearanceAccessIdDelete$Params, context?: HttpContext): Observable<ActionResult> {
    return this.apiOrgsOrgIdClearancesExpiredClearanceAccessIdDelete$Response(params, context).pipe(
      map((r: StrictHttpResponse<ActionResult>): ActionResult => r.body)
    );
  }

  /** Path part for operation `apiOrgsOrgIdClearancesExpiredClearanceIdGet()` */
  static readonly ApiOrgsOrgIdClearancesExpiredClearanceIdGetPath = '/api/orgs/{orgId}/clearances/expired/{clearanceId}';

  /**
   * return.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdClearancesExpiredClearanceIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdClearancesExpiredClearanceIdGet$Response(params: ApiOrgsOrgIdClearancesExpiredClearanceIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ApplicationInvitePrepopulateDataResponse>> {
    return apiOrgsOrgIdClearancesExpiredClearanceIdGet(this.http, this.rootUrl, params, context);
  }

  /**
   * return.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdClearancesExpiredClearanceIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdClearancesExpiredClearanceIdGet(params: ApiOrgsOrgIdClearancesExpiredClearanceIdGet$Params, context?: HttpContext): Observable<ApplicationInvitePrepopulateDataResponse> {
    return this.apiOrgsOrgIdClearancesExpiredClearanceIdGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<ApplicationInvitePrepopulateDataResponse>): ApplicationInvitePrepopulateDataResponse => r.body)
    );
  }

  /** Path part for operation `apiOrgsOrgIdClearancesClearanceIdFileGet()` */
  static readonly ApiOrgsOrgIdClearancesClearanceIdFileGetPath = '/api/orgs/{orgId}/clearances/{clearanceId}/file';

  /**
   * download the clearance letter.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdClearancesClearanceIdFileGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdClearancesClearanceIdFileGet$Response(params: ApiOrgsOrgIdClearancesClearanceIdFileGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Blob>> {
    return apiOrgsOrgIdClearancesClearanceIdFileGet(this.http, this.rootUrl, params, context);
  }

  /**
   * download the clearance letter.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdClearancesClearanceIdFileGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdClearancesClearanceIdFileGet(params: ApiOrgsOrgIdClearancesClearanceIdFileGet$Params, context?: HttpContext): Observable<Blob> {
    return this.apiOrgsOrgIdClearancesClearanceIdFileGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Blob>): Blob => r.body)
    );
  }

}
