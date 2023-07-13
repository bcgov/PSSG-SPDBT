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
import { AnonymousApplicantAppCreateRequest } from '../models/anonymous-applicant-app-create-request';
import { AppInviteVerifyRequest } from '../models/app-invite-verify-request';
import { AppOrgResponse } from '../models/app-org-response';
import { ApplicantAppCreateRequest } from '../models/applicant-app-create-request';
import { ApplicantAppFileCreateResponse } from '../models/applicant-app-file-create-response';
import { ApplicantApplicationFileListResponse } from '../models/applicant-application-file-list-response';
import { ApplicantApplicationListResponse } from '../models/applicant-application-list-response';
import { ApplicantPaymentLinkCreateRequest } from '../models/applicant-payment-link-create-request';
import { ApplicantUserInfo } from '../models/applicant-user-info';
import { ApplicationCreateResponse } from '../models/application-create-response';
import { FileTemplateTypeCode } from '../models/file-template-type-code';
import { FileTypeCode } from '../models/file-type-code';
import { PaymentLinkResponse } from '../models/payment-link-response';
import { PaymentResponse } from '../models/payment-response';
import { ServiceTypeCode } from '../models/service-type-code';
import { ShareableClearanceResponse } from '../models/shareable-clearance-response';

@Injectable({
  providedIn: 'root',
})
export class ApplicantService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation apiApplicantsInvitesPost
   */
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
  apiApplicantsInvitesPost$Response(params: {

    /**
     * which include InviteEncryptedCode
     */
    body: AppInviteVerifyRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<AppOrgResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicantService.ApiApplicantsInvitesPostPath, 'post');
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
        return r as StrictHttpResponse<AppOrgResponse>;
      })
    );
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
  apiApplicantsInvitesPost(params: {

    /**
     * which include InviteEncryptedCode
     */
    body: AppInviteVerifyRequest
  },
  context?: HttpContext

): Observable<AppOrgResponse> {

    return this.apiApplicantsInvitesPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<AppOrgResponse>) => r.body as AppOrgResponse)
    );
  }

  /**
   * Path part for operation apiApplicantsScreeningsPost
   */
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
  apiApplicantsScreeningsPost$Response(params?: {
    body?: ApplicantAppCreateRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ApplicationCreateResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicantService.ApiApplicantsScreeningsPostPath, 'post');
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
        return r as StrictHttpResponse<ApplicationCreateResponse>;
      })
    );
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
  apiApplicantsScreeningsPost(params?: {
    body?: ApplicantAppCreateRequest
  },
  context?: HttpContext

): Observable<ApplicationCreateResponse> {

    return this.apiApplicantsScreeningsPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<ApplicationCreateResponse>) => r.body as ApplicationCreateResponse)
    );
  }

  /**
   * Path part for operation apiApplicantsScreeningsAnonymousPost
   */
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
  apiApplicantsScreeningsAnonymousPost$Response(params?: {
    body?: AnonymousApplicantAppCreateRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ApplicationCreateResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicantService.ApiApplicantsScreeningsAnonymousPostPath, 'post');
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
        return r as StrictHttpResponse<ApplicationCreateResponse>;
      })
    );
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
  apiApplicantsScreeningsAnonymousPost(params?: {
    body?: AnonymousApplicantAppCreateRequest
  },
  context?: HttpContext

): Observable<ApplicationCreateResponse> {

    return this.apiApplicantsScreeningsAnonymousPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<ApplicationCreateResponse>) => r.body as ApplicationCreateResponse)
    );
  }

  /**
   * Path part for operation apiApplicantsClearancesShareableGet
   */
  static readonly ApiApplicantsClearancesShareableGetPath = '/api/applicants/clearances/shareable';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiApplicantsClearancesShareableGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsClearancesShareableGet$Response(params?: {
    withOrgId?: string;
    serviceType?: ServiceTypeCode;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ShareableClearanceResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicantService.ApiApplicantsClearancesShareableGetPath, 'get');
    if (params) {
      rb.query('withOrgId', params.withOrgId, {});
      rb.query('serviceType', params.serviceType, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ShareableClearanceResponse>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiApplicantsClearancesShareableGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsClearancesShareableGet(params?: {
    withOrgId?: string;
    serviceType?: ServiceTypeCode;
  },
  context?: HttpContext

): Observable<ShareableClearanceResponse> {

    return this.apiApplicantsClearancesShareableGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<ShareableClearanceResponse>) => r.body as ShareableClearanceResponse)
    );
  }

  /**
   * Path part for operation apiApplicantsApplicantIdScreeningsGet
   */
  static readonly ApiApplicantsApplicantIdScreeningsGetPath = '/api/applicants/{applicantId}/screenings';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiApplicantsApplicantIdScreeningsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsApplicantIdScreeningsGet$Response(params: {
    applicantId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ApplicantApplicationListResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicantService.ApiApplicantsApplicantIdScreeningsGetPath, 'get');
    if (params) {
      rb.path('applicantId', params.applicantId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ApplicantApplicationListResponse>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiApplicantsApplicantIdScreeningsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsApplicantIdScreeningsGet(params: {
    applicantId: string;
  },
  context?: HttpContext

): Observable<ApplicantApplicationListResponse> {

    return this.apiApplicantsApplicantIdScreeningsGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<ApplicantApplicationListResponse>) => r.body as ApplicantApplicationListResponse)
    );
  }

  /**
   * Path part for operation apiApplicantsUserinfoGet
   */
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
  apiApplicantsUserinfoGet$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ApplicantUserInfo>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicantService.ApiApplicantsUserinfoGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ApplicantUserInfo>;
      })
    );
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
  apiApplicantsUserinfoGet(params?: {
  },
  context?: HttpContext

): Observable<ApplicantUserInfo> {

    return this.apiApplicantsUserinfoGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<ApplicantUserInfo>) => r.body as ApplicantUserInfo)
    );
  }

  /**
   * Path part for operation apiApplicantsScreeningsApplicationIdFilesGet
   */
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
  apiApplicantsScreeningsApplicationIdFilesGet$Response(params: {
    applicationId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ApplicantApplicationFileListResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicantService.ApiApplicantsScreeningsApplicationIdFilesGetPath, 'get');
    if (params) {
      rb.path('applicationId', params.applicationId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ApplicantApplicationFileListResponse>;
      })
    );
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
  apiApplicantsScreeningsApplicationIdFilesGet(params: {
    applicationId: string;
  },
  context?: HttpContext

): Observable<ApplicantApplicationFileListResponse> {

    return this.apiApplicantsScreeningsApplicationIdFilesGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<ApplicantApplicationFileListResponse>) => r.body as ApplicantApplicationFileListResponse)
    );
  }

  /**
   * Path part for operation apiApplicantsScreeningsApplicationIdFilesPost
   */
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
  apiApplicantsScreeningsApplicationIdFilesPost$Response(params: {
    applicationId: string;
    body?: {
'Files'?: Array<Blob>;
'FileType'?: FileTypeCode;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Array<ApplicantAppFileCreateResponse>>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicantService.ApiApplicantsScreeningsApplicationIdFilesPostPath, 'post');
    if (params) {
      rb.path('applicationId', params.applicationId, {});
      rb.body(params.body, 'multipart/form-data');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<ApplicantAppFileCreateResponse>>;
      })
    );
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
  apiApplicantsScreeningsApplicationIdFilesPost(params: {
    applicationId: string;
    body?: {
'Files'?: Array<Blob>;
'FileType'?: FileTypeCode;
}
  },
  context?: HttpContext

): Observable<Array<ApplicantAppFileCreateResponse>> {

    return this.apiApplicantsScreeningsApplicationIdFilesPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<Array<ApplicantAppFileCreateResponse>>) => r.body as Array<ApplicantAppFileCreateResponse>)
    );
  }

  /**
   * Path part for operation apiApplicantsScreeningsFileTemplatesGet
   */
  static readonly ApiApplicantsScreeningsFileTemplatesGetPath = '/api/applicants/screenings/file-templates';

  /**
   * download the template document.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiApplicantsScreeningsFileTemplatesGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsScreeningsFileTemplatesGet$Response(params: {
    fileTemplateType: FileTemplateTypeCode;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Blob>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicantService.ApiApplicantsScreeningsFileTemplatesGetPath, 'get');
    if (params) {
      rb.query('fileTemplateType', params.fileTemplateType, {});
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
   * download the template document.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiApplicantsScreeningsFileTemplatesGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsScreeningsFileTemplatesGet(params: {
    fileTemplateType: FileTemplateTypeCode;
  },
  context?: HttpContext

): Observable<Blob> {

    return this.apiApplicantsScreeningsFileTemplatesGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<Blob>) => r.body as Blob)
    );
  }

  /**
   * Path part for operation apiApplicantsScreeningsApplicationIdPaymentLinkPost
   */
  static readonly ApiApplicantsScreeningsApplicationIdPaymentLinkPostPath = '/api/applicants/screenings/{applicationId}/payment-link';

  /**
   * Return the direct pay payment link.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiApplicantsScreeningsApplicationIdPaymentLinkPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiApplicantsScreeningsApplicationIdPaymentLinkPost$Response(params: {
    applicationId: string;
    body: ApplicantPaymentLinkCreateRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<PaymentLinkResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicantService.ApiApplicantsScreeningsApplicationIdPaymentLinkPostPath, 'post');
    if (params) {
      rb.path('applicationId', params.applicationId, {});
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<PaymentLinkResponse>;
      })
    );
  }

  /**
   * Return the direct pay payment link.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiApplicantsScreeningsApplicationIdPaymentLinkPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiApplicantsScreeningsApplicationIdPaymentLinkPost(params: {
    applicationId: string;
    body: ApplicantPaymentLinkCreateRequest
  },
  context?: HttpContext

): Observable<PaymentLinkResponse> {

    return this.apiApplicantsScreeningsApplicationIdPaymentLinkPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<PaymentLinkResponse>) => r.body as PaymentLinkResponse)
    );
  }

  /**
   * Path part for operation apiApplicantsScreeningsPaymentResultGet
   */
  static readonly ApiApplicantsScreeningsPaymentResultGetPath = '/api/applicants/screenings/payment-result';

  /**
   * redirect url for paybc to redirect to.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiApplicantsScreeningsPaymentResultGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsScreeningsPaymentResultGet$Response(params?: {
    trnApproved?: number;
    messageText?: string;
    cardType?: string;
    trnOrderId?: string;
    trnAmount?: string;
    paymentMethod?: string;
    trnDate?: string;
    ref1?: string;
    ref2?: string;
    ref3?: string;
    pbcTxnNumber?: string;
    trnNumber?: string;
    hashValue?: string;
    pbcRefNumber?: string;
    glDate?: string;
    paymentAuthCode?: string;
    revenue?: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ActionResult>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicantService.ApiApplicantsScreeningsPaymentResultGetPath, 'get');
    if (params) {
      rb.query('trnApproved', params.trnApproved, {});
      rb.query('messageText', params.messageText, {});
      rb.query('cardType', params.cardType, {});
      rb.query('trnOrderId', params.trnOrderId, {});
      rb.query('trnAmount', params.trnAmount, {});
      rb.query('paymentMethod', params.paymentMethod, {});
      rb.query('trnDate', params.trnDate, {});
      rb.query('ref1', params.ref1, {});
      rb.query('ref2', params.ref2, {});
      rb.query('ref3', params.ref3, {});
      rb.query('pbcTxnNumber', params.pbcTxnNumber, {});
      rb.query('trnNumber', params.trnNumber, {});
      rb.query('hashValue', params.hashValue, {});
      rb.query('pbcRefNumber', params.pbcRefNumber, {});
      rb.query('glDate', params.glDate, {});
      rb.query('paymentAuthCode', params.paymentAuthCode, {});
      rb.query('revenue', params.revenue, {});
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
   * redirect url for paybc to redirect to.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiApplicantsScreeningsPaymentResultGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsScreeningsPaymentResultGet(params?: {
    trnApproved?: number;
    messageText?: string;
    cardType?: string;
    trnOrderId?: string;
    trnAmount?: string;
    paymentMethod?: string;
    trnDate?: string;
    ref1?: string;
    ref2?: string;
    ref3?: string;
    pbcTxnNumber?: string;
    trnNumber?: string;
    hashValue?: string;
    pbcRefNumber?: string;
    glDate?: string;
    paymentAuthCode?: string;
    revenue?: string;
  },
  context?: HttpContext

): Observable<ActionResult> {

    return this.apiApplicantsScreeningsPaymentResultGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<ActionResult>) => r.body as ActionResult)
    );
  }

  /**
   * Path part for operation apiApplicantsScreeningsPaymentsPaymentIdGet
   */
  static readonly ApiApplicantsScreeningsPaymentsPaymentIdGetPath = '/api/applicants/screenings/payments/{paymentId}';

  /**
   * Get the payment result for application and payment.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiApplicantsScreeningsPaymentsPaymentIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsScreeningsPaymentsPaymentIdGet$Response(params: {
    paymentId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<PaymentResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ApplicantService.ApiApplicantsScreeningsPaymentsPaymentIdGetPath, 'get');
    if (params) {
      rb.path('paymentId', params.paymentId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<PaymentResponse>;
      })
    );
  }

  /**
   * Get the payment result for application and payment.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiApplicantsScreeningsPaymentsPaymentIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsScreeningsPaymentsPaymentIdGet(params: {
    paymentId: string;
  },
  context?: HttpContext

): Observable<PaymentResponse> {

    return this.apiApplicantsScreeningsPaymentsPaymentIdGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<PaymentResponse>) => r.body as PaymentResponse)
    );
  }

}
