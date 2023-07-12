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
import { ApplicationPaymentListResponse } from '../models/application-payment-list-response';
import { ApplicationStatisticsResponse } from '../models/application-statistics-response';
import { BulkHistoryListResponse } from '../models/bulk-history-list-response';
import { BulkUploadCreateResponse } from '../models/bulk-upload-create-response';
import { ClearanceListResponse } from '../models/clearance-list-response';
import { IdentityStatusCode } from '../models/identity-status-code';

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
  },
  context?: HttpContext

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
      context: context
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
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdApplicationInvitesGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdApplicationInvitesGet(params: {
    orgId: string;
    filters?: string;
    page?: number;
    pageSize?: number;
  },
  context?: HttpContext

): Observable<ApplicationInviteListResponse> {

    return this.apiOrgsOrgIdApplicationInvitesGet$Response(params,context).pipe(
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
    body: ApplicationInvitesCreateRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ApplicationInvitesCreateResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicationService.ApiOrgsOrgIdApplicationInvitesPostPath, 'post');
    if (params) {
      rb.path('orgId', params.orgId, {});
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
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
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdApplicationInvitesPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgsOrgIdApplicationInvitesPost(params: {
    orgId: string;
    body: ApplicationInvitesCreateRequest
  },
  context?: HttpContext

): Observable<ApplicationInvitesCreateResponse> {

    return this.apiOrgsOrgIdApplicationInvitesPost$Response(params,context).pipe(
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
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ActionResult>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicationService.ApiOrgsOrgIdApplicationInvitesApplicationInviteIdDeletePath, 'delete');
    if (params) {
      rb.path('applicationInviteId', params.applicationInviteId, {});
      rb.path('orgId', params.orgId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
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
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdApplicationInvitesApplicationInviteIdDelete$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdApplicationInvitesApplicationInviteIdDelete(params: {
    applicationInviteId: string;
    orgId: string;
  },
  context?: HttpContext

): Observable<ActionResult> {

    return this.apiOrgsOrgIdApplicationInvitesApplicationInviteIdDelete$Response(params,context).pipe(
      map((r: StrictHttpResponse<ActionResult>) => r.body as ActionResult)
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
  },
  context?: HttpContext

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
      context: context
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
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdApplicationsBulkHistoryGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdApplicationsBulkHistoryGet(params: {
    orgId: string;
    sorts?: string;
    page?: number;
    pageSize?: number;
  },
  context?: HttpContext

): Observable<BulkHistoryListResponse> {

    return this.apiOrgsOrgIdApplicationsBulkHistoryGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<BulkHistoryListResponse>) => r.body as BulkHistoryListResponse)
    );
  }

  /**
   * Path part for operation apiOrgsOrgIdApplicationsBulkPost
   */
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
  apiOrgsOrgIdApplicationsBulkPost$Response(params: {
    orgId: string;
    body?: {
'File'?: Blob;
'RequireDuplicateCheck'?: boolean;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<BulkUploadCreateResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicationService.ApiOrgsOrgIdApplicationsBulkPostPath, 'post');
    if (params) {
      rb.path('orgId', params.orgId, {});
      rb.body(params.body, 'multipart/form-data');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<BulkUploadCreateResponse>;
      })
    );
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
  apiOrgsOrgIdApplicationsBulkPost(params: {
    orgId: string;
    body?: {
'File'?: Blob;
'RequireDuplicateCheck'?: boolean;
}
  },
  context?: HttpContext

): Observable<BulkUploadCreateResponse> {

    return this.apiOrgsOrgIdApplicationsBulkPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<BulkUploadCreateResponse>) => r.body as BulkUploadCreateResponse)
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
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ApplicationStatisticsResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicationService.ApiOrgsOrgIdApplicationStatisticsGetPath, 'get');
    if (params) {
      rb.path('orgId', params.orgId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
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
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdApplicationStatisticsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdApplicationStatisticsGet(params: {
    orgId: string;
  },
  context?: HttpContext

): Observable<ApplicationStatisticsResponse> {

    return this.apiOrgsOrgIdApplicationStatisticsGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<ApplicationStatisticsResponse>) => r.body as ApplicationStatisticsResponse)
    );
  }

  /**
   * Path part for operation apiOrgsOrgIdIdentityApplicationIdPut
   */
  static readonly ApiOrgsOrgIdIdentityApplicationIdPutPath = '/api/orgs/{orgId}/identity/{applicationId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdIdentityApplicationIdPut()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdIdentityApplicationIdPut$Response(params: {
    applicationId: string;
    orgId: string;
    status?: IdentityStatusCode;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ActionResult>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicationService.ApiOrgsOrgIdIdentityApplicationIdPutPath, 'put');
    if (params) {
      rb.path('applicationId', params.applicationId, {});
      rb.path('orgId', params.orgId, {});
      rb.query('status', params.status, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ActionResult>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdIdentityApplicationIdPut$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdIdentityApplicationIdPut(params: {
    applicationId: string;
    orgId: string;
    status?: IdentityStatusCode;
  },
  context?: HttpContext

): Observable<ActionResult> {

    return this.apiOrgsOrgIdIdentityApplicationIdPut$Response(params,context).pipe(
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
'genderCode'?: string | null;
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
'originTypeCode'?: string;
'payeeType'?: string;
'screeningType'?: string;
'serviceType'?: string;
};
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ApplicationCreateResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicationService.ApiOrgsOrgIdApplicationPostPath, 'post');
    if (params) {
      rb.path('orgId', params.orgId, {});
      rb.body(params.body, 'multipart/form-data');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
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
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdApplicationPost$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiOrgsOrgIdApplicationPost(params: {

    /**
     * organizationId
     */
    orgId: string;
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
'genderCode'?: string | null;
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
'originTypeCode'?: string;
'payeeType'?: string;
'screeningType'?: string;
'serviceType'?: string;
};
}
  },
  context?: HttpContext

): Observable<ApplicationCreateResponse> {

    return this.apiOrgsOrgIdApplicationPost$Response(params,context).pipe(
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
  },
  context?: HttpContext

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
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ApplicationListResponse>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
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
  },
  context?: HttpContext

): Observable<ApplicationListResponse> {

    return this.apiOrgsOrgIdApplicationsGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<ApplicationListResponse>) => r.body as ApplicationListResponse)
    );
  }

  /**
   * Path part for operation apiOrgsOrgIdApplicationsPaymentsGet
   */
  static readonly ApiOrgsOrgIdApplicationsPaymentsGetPath = '/api/orgs/{orgId}/applications/payments';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdApplicationsPaymentsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdApplicationsPaymentsGet$Response(params: {
    orgId: string;
    filters?: string;
    sorts?: string;
    page?: number;
    pageSize?: number;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ApplicationPaymentListResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicationService.ApiOrgsOrgIdApplicationsPaymentsGetPath, 'get');
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
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ApplicationPaymentListResponse>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdApplicationsPaymentsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdApplicationsPaymentsGet(params: {
    orgId: string;
    filters?: string;
    sorts?: string;
    page?: number;
    pageSize?: number;
  },
  context?: HttpContext

): Observable<ApplicationPaymentListResponse> {

    return this.apiOrgsOrgIdApplicationsPaymentsGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<ApplicationPaymentListResponse>) => r.body as ApplicationPaymentListResponse)
    );
  }

  /**
   * Path part for operation apiOrgsOrgIdClearancesExpiredGet
   */
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
  apiOrgsOrgIdClearancesExpiredGet$Response(params: {
    orgId: string;
    filters?: string;
    sorts?: string;
    page?: number;
    pageSize?: number;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ClearanceListResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicationService.ApiOrgsOrgIdClearancesExpiredGetPath, 'get');
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
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ClearanceListResponse>;
      })
    );
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
  apiOrgsOrgIdClearancesExpiredGet(params: {
    orgId: string;
    filters?: string;
    sorts?: string;
    page?: number;
    pageSize?: number;
  },
  context?: HttpContext

): Observable<ClearanceListResponse> {

    return this.apiOrgsOrgIdClearancesExpiredGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<ClearanceListResponse>) => r.body as ClearanceListResponse)
    );
  }

  /**
   * Path part for operation apiOrgsOrgIdClearancesExpiredClearanceAccessIdDelete
   */
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
  apiOrgsOrgIdClearancesExpiredClearanceAccessIdDelete$Response(params: {
    clearanceAccessId: string;
    orgId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ActionResult>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicationService.ApiOrgsOrgIdClearancesExpiredClearanceAccessIdDeletePath, 'delete');
    if (params) {
      rb.path('clearanceAccessId', params.clearanceAccessId, {});
      rb.path('orgId', params.orgId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ActionResult>;
      })
    );
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
  apiOrgsOrgIdClearancesExpiredClearanceAccessIdDelete(params: {
    clearanceAccessId: string;
    orgId: string;
  },
  context?: HttpContext

): Observable<ActionResult> {

    return this.apiOrgsOrgIdClearancesExpiredClearanceAccessIdDelete$Response(params,context).pipe(
      map((r: StrictHttpResponse<ActionResult>) => r.body as ActionResult)
    );
  }

  /**
   * Path part for operation apiOrgsOrgIdClearancesClearanceIdFileGet
   */
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
  apiOrgsOrgIdClearancesClearanceIdFileGet$Response(params: {
    clearanceId: string;
    orgId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Blob>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicationService.ApiOrgsOrgIdClearancesClearanceIdFileGetPath, 'get');
    if (params) {
      rb.path('clearanceId', params.clearanceId, {});
      rb.path('orgId', params.orgId, {});
    }

    return this.http.request(rb.build({
      responseType: 'blob',
      accept: 'application/pdf',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Blob>;
      })
    );
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
  apiOrgsOrgIdClearancesClearanceIdFileGet(params: {
    clearanceId: string;
    orgId: string;
  },
  context?: HttpContext

): Observable<Blob> {

    return this.apiOrgsOrgIdClearancesClearanceIdFileGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<Blob>) => r.body as Blob)
    );
  }

}
