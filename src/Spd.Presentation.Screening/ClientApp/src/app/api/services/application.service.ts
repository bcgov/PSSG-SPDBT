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

import { ActionResult } from '../models/action-result';
import { ApplicationCreateResponse } from '../models/application-create-response';
import { ApplicationInviteListResponse } from '../models/application-invite-list-response';
import { ApplicationInvitesCreateRequest } from '../models/application-invites-create-request';
import { ApplicationInvitesCreateResponse } from '../models/application-invites-create-response';
import { ApplicationListResponse } from '../models/application-list-response';
import { ApplicationStatisticsResponse } from '../models/application-statistics-response';
import { BulkHistoryListResponse } from '../models/bulk-history-list-response';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation apiOrgsOrgIdApplicationInvitesGet
   */
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
  apiOrgsOrgIdApplicationInvitesGet$Response(params: {
    orgId: string;
    filters?: string;
    page?: number;
    pageSize?: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<ApplicationInviteListResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicationService.ApiOrgsOrgIdApplicationInvitesGetPath, 'get');
    if (params) {
      rb.path('orgId', params.orgId, {});
      rb.query('filters', params.filters, {});
      rb.query('page', params.page, {});
      rb.query('pageSize', params.pageSize, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ApplicationInviteListResponse>;
      })
    );
  }

  /**
   * get the active application invites list.
   * support wildcard search for email and name, it will search email or name contains str.
   * sample: /application-invites?filters=searchText@=str.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdApplicationInvitesGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdApplicationInvitesGet(params: {
    orgId: string;
    filters?: string;
    page?: number;
    pageSize?: number;
    context?: HttpContext
  }
): Observable<ApplicationInviteListResponse> {

    return this.apiOrgsOrgIdApplicationInvitesGet$Response(params).pipe(
      map((r: StrictHttpResponse<ApplicationInviteListResponse>) => r.body as ApplicationInviteListResponse)
    );
  }

  /**
   * Path part for operation apiOrgsOrgIdApplicationInvitesPost
   */
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
  apiOrgsOrgIdApplicationInvitesPost$Response(params: {
    orgId: string;
    context?: HttpContext
    body: ApplicationInvitesCreateRequest
  }
): Observable<StrictHttpResponse<ApplicationInvitesCreateResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicationService.ApiOrgsOrgIdApplicationInvitesPostPath, 'post');
    if (params) {
      rb.path('orgId', params.orgId, {});
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ApplicationInvitesCreateResponse>;
      })
    );
  }

  /**
   * create more than one application invites. if checkDuplicate is true, the implementation will check if there is existing duplicated applicants or invites.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdApplicationInvitesPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgsOrgIdApplicationInvitesPost(params: {
    orgId: string;
    context?: HttpContext
    body: ApplicationInvitesCreateRequest
  }
): Observable<ApplicationInvitesCreateResponse> {

    return this.apiOrgsOrgIdApplicationInvitesPost$Response(params).pipe(
      map((r: StrictHttpResponse<ApplicationInvitesCreateResponse>) => r.body as ApplicationInvitesCreateResponse)
    );
  }

  /**
   * Path part for operation apiOrgsOrgIdApplicationInvitesApplicationInviteIdDelete
   */
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
  apiOrgsOrgIdApplicationInvitesApplicationInviteIdDelete$Response(params: {
    applicationInviteId: string;
    orgId: string;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<ActionResult>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicationService.ApiOrgsOrgIdApplicationInvitesApplicationInviteIdDeletePath, 'delete');
    if (params) {
      rb.path('applicationInviteId', params.applicationInviteId, {});
      rb.path('orgId', params.orgId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ActionResult>;
      })
    );
  }

  /**
   * remove the invitation for a organization.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdApplicationInvitesApplicationInviteIdDelete$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdApplicationInvitesApplicationInviteIdDelete(params: {
    applicationInviteId: string;
    orgId: string;
    context?: HttpContext
  }
): Observable<ActionResult> {

    return this.apiOrgsOrgIdApplicationInvitesApplicationInviteIdDelete$Response(params).pipe(
      map((r: StrictHttpResponse<ActionResult>) => r.body as ActionResult)
    );
  }

  /**
   * Path part for operation apiOrgsOrgIdApplicationPost
   */
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
  apiOrgsOrgIdApplicationPost$Response(params: {

    /**
     * organizationId
     */
    orgId: string;
    context?: HttpContext
    body: {

/**
 * PDF, Microsoft Word .docx/.doc files only
 */
'ConsentFormFile'?: Blob;

/**
 * See ApplicationCreateRequest schema
 */
'ApplicationCreateRequestJson'?: {
'orgId'?: string;
'givenName'?: string | null;
'middleName1'?: string | null;
'middleName2'?: string | null;
'surname'?: string | null;
'emailAddress'?: string | null;
'jobTitle'?: string | null;
'dateOfBirth'?: string | null;
'contractedCompanyName'?: string | null;
'phoneNumber'?: string | null;
'driversLicense'?: string | null;
'birthPlace'?: string | null;
'addressLine1'?: string | null;
'addressLine2'?: string | null;
'city'?: string | null;
'postalCode'?: string | null;
'province'?: string | null;
'country'?: string | null;
'oneLegalName'?: boolean | null;
'agreeToCompleteAndAccurate'?: boolean | null;
'haveVerifiedIdentity'?: boolean | null;
'requireDuplicateCheck'?: boolean;
'aliases'?: Array<{
'givenName'?: string | null;
'middleName1'?: string | null;
'middleName2'?: string | null;
'surname'?: string | null;
}>;
'OriginTypeCode'?: string;
'payeeType'?: string;
'screeningTypeCode'?: string;
};
}
  }
): Observable<StrictHttpResponse<ApplicationCreateResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicationService.ApiOrgsOrgIdApplicationPostPath, 'post');
    if (params) {
      rb.path('orgId', params.orgId, {});
      rb.body(params.body, 'multipart/form-data');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ApplicationCreateResponse>;
      })
    );
  }

  /**
   * create application. if checkDuplicate is true, it will check if there is existing duplicated applications.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdApplicationPost$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiOrgsOrgIdApplicationPost(params: {

    /**
     * organizationId
     */
    orgId: string;
    context?: HttpContext
    body: {

/**
 * PDF, Microsoft Word .docx/.doc files only
 */
'ConsentFormFile'?: Blob;

/**
 * See ApplicationCreateRequest schema
 */
'ApplicationCreateRequestJson'?: {
'orgId'?: string;
'givenName'?: string | null;
'middleName1'?: string | null;
'middleName2'?: string | null;
'surname'?: string | null;
'emailAddress'?: string | null;
'jobTitle'?: string | null;
'dateOfBirth'?: string | null;
'contractedCompanyName'?: string | null;
'phoneNumber'?: string | null;
'driversLicense'?: string | null;
'birthPlace'?: string | null;
'addressLine1'?: string | null;
'addressLine2'?: string | null;
'city'?: string | null;
'postalCode'?: string | null;
'province'?: string | null;
'country'?: string | null;
'oneLegalName'?: boolean | null;
'agreeToCompleteAndAccurate'?: boolean | null;
'haveVerifiedIdentity'?: boolean | null;
'requireDuplicateCheck'?: boolean;
'aliases'?: Array<{
'givenName'?: string | null;
'middleName1'?: string | null;
'middleName2'?: string | null;
'surname'?: string | null;
}>;
'OriginTypeCode'?: string;
'payeeType'?: string;
'screeningTypeCode'?: string;
};
}
  }
): Observable<ApplicationCreateResponse> {

    return this.apiOrgsOrgIdApplicationPost$Response(params).pipe(
      map((r: StrictHttpResponse<ApplicationCreateResponse>) => r.body as ApplicationCreateResponse)
    );
  }

  /**
   * Path part for operation apiOrgsOrgIdApplicationsGet
   */
  static readonly ApiOrgsOrgIdApplicationsGetPath = '/api/orgs/{orgId}/applications';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdApplicationsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdApplicationsGet$Response(params: {
    orgId: string;
    filters?: string;
    sorts?: string;
    page?: number;
    pageSize?: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<ApplicationListResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicationService.ApiOrgsOrgIdApplicationsGetPath, 'get');
    if (params) {
      rb.path('orgId', params.orgId, {});
      rb.query('filters', params.filters, {});
      rb.query('sorts', params.sorts, {});
      rb.query('page', params.page, {});
      rb.query('pageSize', params.pageSize, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ApplicationListResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdApplicationsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdApplicationsGet(params: {
    orgId: string;
    filters?: string;
    sorts?: string;
    page?: number;
    pageSize?: number;
    context?: HttpContext
  }
): Observable<ApplicationListResponse> {

    return this.apiOrgsOrgIdApplicationsGet$Response(params).pipe(
      map((r: StrictHttpResponse<ApplicationListResponse>) => r.body as ApplicationListResponse)
    );
  }

  /**
   * Path part for operation apiOrgsOrgIdApplicationStatisticsGet
   */
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
  apiOrgsOrgIdApplicationStatisticsGet$Response(params: {
    orgId: string;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<ApplicationStatisticsResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicationService.ApiOrgsOrgIdApplicationStatisticsGetPath, 'get');
    if (params) {
      rb.path('orgId', params.orgId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ApplicationStatisticsResponse>;
      })
    );
  }

  /**
   * return the application statistics for a particular organization.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdApplicationStatisticsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdApplicationStatisticsGet(params: {
    orgId: string;
    context?: HttpContext
  }
): Observable<ApplicationStatisticsResponse> {

    return this.apiOrgsOrgIdApplicationStatisticsGet$Response(params).pipe(
      map((r: StrictHttpResponse<ApplicationStatisticsResponse>) => r.body as ApplicationStatisticsResponse)
    );
  }

  /**
   * Path part for operation apiOrgsOrgIdVerifyidentityApplicationIdPut
   */
  static readonly ApiOrgsOrgIdVerifyidentityApplicationIdPutPath = '/api/orgs/{orgId}/verifyidentity/{applicationId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdVerifyidentityApplicationIdPut()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdVerifyidentityApplicationIdPut$Response(params: {
    applicationId: string;
    orgId: string;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<boolean>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicationService.ApiOrgsOrgIdVerifyidentityApplicationIdPutPath, 'put');
    if (params) {
      rb.path('applicationId', params.applicationId, {});
      rb.path('orgId', params.orgId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: String((r as HttpResponse<any>).body) === 'true' }) as StrictHttpResponse<boolean>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdVerifyidentityApplicationIdPut$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdVerifyidentityApplicationIdPut(params: {
    applicationId: string;
    orgId: string;
    context?: HttpContext
  }
): Observable<boolean> {

    return this.apiOrgsOrgIdVerifyidentityApplicationIdPut$Response(params).pipe(
      map((r: StrictHttpResponse<boolean>) => r.body as boolean)
    );
  }

  /**
   * Path part for operation apiOrgsOrgIdRejectidentityApplicationIdPut
   */
  static readonly ApiOrgsOrgIdRejectidentityApplicationIdPutPath = '/api/orgs/{orgId}/rejectidentity/{applicationId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdRejectidentityApplicationIdPut()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdRejectidentityApplicationIdPut$Response(params: {
    applicationId: string;
    orgId: string;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<boolean>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicationService.ApiOrgsOrgIdRejectidentityApplicationIdPutPath, 'put');
    if (params) {
      rb.path('applicationId', params.applicationId, {});
      rb.path('orgId', params.orgId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: String((r as HttpResponse<any>).body) === 'true' }) as StrictHttpResponse<boolean>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdRejectidentityApplicationIdPut$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdRejectidentityApplicationIdPut(params: {
    applicationId: string;
    orgId: string;
    context?: HttpContext
  }
): Observable<boolean> {

    return this.apiOrgsOrgIdRejectidentityApplicationIdPut$Response(params).pipe(
      map((r: StrictHttpResponse<boolean>) => r.body as boolean)
    );
  }

  /**
   * Path part for operation apiOrgsOrgIdApplicationsBulkHistoryGet
   */
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
  apiOrgsOrgIdApplicationsBulkHistoryGet$Response(params: {
    orgId: string;
    sorts?: string;
    page?: number;
    pageSize?: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<BulkHistoryListResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicationService.ApiOrgsOrgIdApplicationsBulkHistoryGetPath, 'get');
    if (params) {
      rb.path('orgId', params.orgId, {});
      rb.query('sorts', params.sorts, {});
      rb.query('page', params.page, {});
      rb.query('pageSize', params.pageSize, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<BulkHistoryListResponse>;
      })
    );
  }

  /**
   * return all bulk upload history belong to the organization.
   * sort: submittedon, default will be desc.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdApplicationsBulkHistoryGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdApplicationsBulkHistoryGet(params: {
    orgId: string;
    sorts?: string;
    page?: number;
    pageSize?: number;
    context?: HttpContext
  }
): Observable<BulkHistoryListResponse> {

    return this.apiOrgsOrgIdApplicationsBulkHistoryGet$Response(params).pipe(
      map((r: StrictHttpResponse<BulkHistoryListResponse>) => r.body as BulkHistoryListResponse)
    );
  }

}
