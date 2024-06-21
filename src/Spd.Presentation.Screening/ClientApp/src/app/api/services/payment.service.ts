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
import { apiApplicantsScreeningsApplicationIdManualPaymentFormGet } from '../fn/payment/api-applicants-screenings-application-id-manual-payment-form-get';
import { ApiApplicantsScreeningsApplicationIdManualPaymentFormGet$Params } from '../fn/payment/api-applicants-screenings-application-id-manual-payment-form-get';
import { apiApplicantsScreeningsApplicationIdPaymentAttemptsGet } from '../fn/payment/api-applicants-screenings-application-id-payment-attempts-get';
import { ApiApplicantsScreeningsApplicationIdPaymentAttemptsGet$Params } from '../fn/payment/api-applicants-screenings-application-id-payment-attempts-get';
import { apiApplicantsScreeningsApplicationIdPaymentLinkPost } from '../fn/payment/api-applicants-screenings-application-id-payment-link-post';
import { ApiApplicantsScreeningsApplicationIdPaymentLinkPost$Params } from '../fn/payment/api-applicants-screenings-application-id-payment-link-post';
import { apiApplicantsScreeningsApplicationIdPaymentReceiptGet } from '../fn/payment/api-applicants-screenings-application-id-payment-receipt-get';
import { ApiApplicantsScreeningsApplicationIdPaymentReceiptGet$Params } from '../fn/payment/api-applicants-screenings-application-id-payment-receipt-get';
import { apiApplicantsScreeningsPaymentResultGet } from '../fn/payment/api-applicants-screenings-payment-result-get';
import { ApiApplicantsScreeningsPaymentResultGet$Params } from '../fn/payment/api-applicants-screenings-payment-result-get';
import { apiApplicantsScreeningsPaymentsPaymentIdGet } from '../fn/payment/api-applicants-screenings-payments-payment-id-get';
import { ApiApplicantsScreeningsPaymentsPaymentIdGet$Params } from '../fn/payment/api-applicants-screenings-payments-payment-id-get';
import { apiCrrpaApplicationIdManualPaymentFormGet } from '../fn/payment/api-crrpa-application-id-manual-payment-form-get';
import { ApiCrrpaApplicationIdManualPaymentFormGet$Params } from '../fn/payment/api-crrpa-application-id-manual-payment-form-get';
import { apiCrrpaApplicationIdPaymentAttemptsGet } from '../fn/payment/api-crrpa-application-id-payment-attempts-get';
import { ApiCrrpaApplicationIdPaymentAttemptsGet$Params } from '../fn/payment/api-crrpa-application-id-payment-attempts-get';
import { apiCrrpaApplicationIdPaymentReceiptGet } from '../fn/payment/api-crrpa-application-id-payment-receipt-get';
import { ApiCrrpaApplicationIdPaymentReceiptGet$Params } from '../fn/payment/api-crrpa-application-id-payment-receipt-get';
import { apiCrrpaPaymentLinkPost } from '../fn/payment/api-crrpa-payment-link-post';
import { ApiCrrpaPaymentLinkPost$Params } from '../fn/payment/api-crrpa-payment-link-post';
import { apiCrrpaPaymentResultGet } from '../fn/payment/api-crrpa-payment-result-get';
import { ApiCrrpaPaymentResultGet$Params } from '../fn/payment/api-crrpa-payment-result-get';
import { apiCrrpaPaymentSecureLinkGet } from '../fn/payment/api-crrpa-payment-secure-link-get';
import { ApiCrrpaPaymentSecureLinkGet$Params } from '../fn/payment/api-crrpa-payment-secure-link-get';
import { apiCrrpaPaymentsPaymentIdGet } from '../fn/payment/api-crrpa-payments-payment-id-get';
import { ApiCrrpaPaymentsPaymentIdGet$Params } from '../fn/payment/api-crrpa-payments-payment-id-get';
import { apiOrgsOrgIdApplicationsApplicationIdManualPaymentFormGet } from '../fn/payment/api-orgs-org-id-applications-application-id-manual-payment-form-get';
import { ApiOrgsOrgIdApplicationsApplicationIdManualPaymentFormGet$Params } from '../fn/payment/api-orgs-org-id-applications-application-id-manual-payment-form-get';
import { apiOrgsOrgIdApplicationsApplicationIdPaymentAttemptsGet } from '../fn/payment/api-orgs-org-id-applications-application-id-payment-attempts-get';
import { ApiOrgsOrgIdApplicationsApplicationIdPaymentAttemptsGet$Params } from '../fn/payment/api-orgs-org-id-applications-application-id-payment-attempts-get';
import { apiOrgsOrgIdApplicationsApplicationIdPaymentLinkPost } from '../fn/payment/api-orgs-org-id-applications-application-id-payment-link-post';
import { ApiOrgsOrgIdApplicationsApplicationIdPaymentLinkPost$Params } from '../fn/payment/api-orgs-org-id-applications-application-id-payment-link-post';
import { apiOrgsOrgIdApplicationsApplicationIdPaymentReceiptGet } from '../fn/payment/api-orgs-org-id-applications-application-id-payment-receipt-get';
import { ApiOrgsOrgIdApplicationsApplicationIdPaymentReceiptGet$Params } from '../fn/payment/api-orgs-org-id-applications-application-id-payment-receipt-get';
import { apiOrgsOrgIdPaymentResultGet } from '../fn/payment/api-orgs-org-id-payment-result-get';
import { ApiOrgsOrgIdPaymentResultGet$Params } from '../fn/payment/api-orgs-org-id-payment-result-get';
import { apiOrgsOrgIdPaymentsPaymentIdGet } from '../fn/payment/api-orgs-org-id-payments-payment-id-get';
import { ApiOrgsOrgIdPaymentsPaymentIdGet$Params } from '../fn/payment/api-orgs-org-id-payments-payment-id-get';
import { PaymentLinkResponse } from '../models/payment-link-response';
import { PaymentResponse } from '../models/payment-response';

@Injectable({ providedIn: 'root' })
export class PaymentService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `apiApplicantsScreeningsApplicationIdPaymentLinkPost()` */
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
  apiApplicantsScreeningsApplicationIdPaymentLinkPost$Response(params: ApiApplicantsScreeningsApplicationIdPaymentLinkPost$Params, context?: HttpContext): Observable<StrictHttpResponse<PaymentLinkResponse>> {
    return apiApplicantsScreeningsApplicationIdPaymentLinkPost(this.http, this.rootUrl, params, context);
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
  apiApplicantsScreeningsApplicationIdPaymentLinkPost(params: ApiApplicantsScreeningsApplicationIdPaymentLinkPost$Params, context?: HttpContext): Observable<PaymentLinkResponse> {
    return this.apiApplicantsScreeningsApplicationIdPaymentLinkPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<PaymentLinkResponse>): PaymentLinkResponse => r.body)
    );
  }

  /** Path part for operation `apiApplicantsScreeningsPaymentResultGet()` */
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
  apiApplicantsScreeningsPaymentResultGet$Response(params?: ApiApplicantsScreeningsPaymentResultGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ActionResult>> {
    return apiApplicantsScreeningsPaymentResultGet(this.http, this.rootUrl, params, context);
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
  apiApplicantsScreeningsPaymentResultGet(params?: ApiApplicantsScreeningsPaymentResultGet$Params, context?: HttpContext): Observable<ActionResult> {
    return this.apiApplicantsScreeningsPaymentResultGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<ActionResult>): ActionResult => r.body)
    );
  }

  /** Path part for operation `apiApplicantsScreeningsPaymentsPaymentIdGet()` */
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
  apiApplicantsScreeningsPaymentsPaymentIdGet$Response(params: ApiApplicantsScreeningsPaymentsPaymentIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<PaymentResponse>> {
    return apiApplicantsScreeningsPaymentsPaymentIdGet(this.http, this.rootUrl, params, context);
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
  apiApplicantsScreeningsPaymentsPaymentIdGet(params: ApiApplicantsScreeningsPaymentsPaymentIdGet$Params, context?: HttpContext): Observable<PaymentResponse> {
    return this.apiApplicantsScreeningsPaymentsPaymentIdGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<PaymentResponse>): PaymentResponse => r.body)
    );
  }

  /** Path part for operation `apiApplicantsScreeningsApplicationIdPaymentAttemptsGet()` */
  static readonly ApiApplicantsScreeningsApplicationIdPaymentAttemptsGetPath = '/api/applicants/screenings/{applicationId}/payment-attempts';

  /**
   * Get the payment result for application and payment.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiApplicantsScreeningsApplicationIdPaymentAttemptsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsScreeningsApplicationIdPaymentAttemptsGet$Response(params: ApiApplicantsScreeningsApplicationIdPaymentAttemptsGet$Params, context?: HttpContext): Observable<StrictHttpResponse<number>> {
    return apiApplicantsScreeningsApplicationIdPaymentAttemptsGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Get the payment result for application and payment.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiApplicantsScreeningsApplicationIdPaymentAttemptsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsScreeningsApplicationIdPaymentAttemptsGet(params: ApiApplicantsScreeningsApplicationIdPaymentAttemptsGet$Params, context?: HttpContext): Observable<number> {
    return this.apiApplicantsScreeningsApplicationIdPaymentAttemptsGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<number>): number => r.body)
    );
  }

  /** Path part for operation `apiApplicantsScreeningsApplicationIdPaymentReceiptGet()` */
  static readonly ApiApplicantsScreeningsApplicationIdPaymentReceiptGetPath = '/api/applicants/screenings/{applicationId}/payment-receipt';

  /**
   * download the receipt for successful payment.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiApplicantsScreeningsApplicationIdPaymentReceiptGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsScreeningsApplicationIdPaymentReceiptGet$Response(params: ApiApplicantsScreeningsApplicationIdPaymentReceiptGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Blob>> {
    return apiApplicantsScreeningsApplicationIdPaymentReceiptGet(this.http, this.rootUrl, params, context);
  }

  /**
   * download the receipt for successful payment.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiApplicantsScreeningsApplicationIdPaymentReceiptGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsScreeningsApplicationIdPaymentReceiptGet(params: ApiApplicantsScreeningsApplicationIdPaymentReceiptGet$Params, context?: HttpContext): Observable<Blob> {
    return this.apiApplicantsScreeningsApplicationIdPaymentReceiptGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Blob>): Blob => r.body)
    );
  }

  /** Path part for operation `apiApplicantsScreeningsApplicationIdManualPaymentFormGet()` */
  static readonly ApiApplicantsScreeningsApplicationIdManualPaymentFormGetPath = '/api/applicants/screenings/{applicationId}/manual-payment-form';

  /**
   * download the manual payment form.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiApplicantsScreeningsApplicationIdManualPaymentFormGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsScreeningsApplicationIdManualPaymentFormGet$Response(params: ApiApplicantsScreeningsApplicationIdManualPaymentFormGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Blob>> {
    return apiApplicantsScreeningsApplicationIdManualPaymentFormGet(this.http, this.rootUrl, params, context);
  }

  /**
   * download the manual payment form.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiApplicantsScreeningsApplicationIdManualPaymentFormGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsScreeningsApplicationIdManualPaymentFormGet(params: ApiApplicantsScreeningsApplicationIdManualPaymentFormGet$Params, context?: HttpContext): Observable<Blob> {
    return this.apiApplicantsScreeningsApplicationIdManualPaymentFormGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Blob>): Blob => r.body)
    );
  }

  /** Path part for operation `apiOrgsOrgIdApplicationsApplicationIdPaymentLinkPost()` */
  static readonly ApiOrgsOrgIdApplicationsApplicationIdPaymentLinkPostPath = '/api/orgs/{orgId}/applications/{applicationId}/payment-link';

  /**
   * Return the direct pay payment link.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdApplicationsApplicationIdPaymentLinkPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgsOrgIdApplicationsApplicationIdPaymentLinkPost$Response(params: ApiOrgsOrgIdApplicationsApplicationIdPaymentLinkPost$Params, context?: HttpContext): Observable<StrictHttpResponse<PaymentLinkResponse>> {
    return apiOrgsOrgIdApplicationsApplicationIdPaymentLinkPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Return the direct pay payment link.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdApplicationsApplicationIdPaymentLinkPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgsOrgIdApplicationsApplicationIdPaymentLinkPost(params: ApiOrgsOrgIdApplicationsApplicationIdPaymentLinkPost$Params, context?: HttpContext): Observable<PaymentLinkResponse> {
    return this.apiOrgsOrgIdApplicationsApplicationIdPaymentLinkPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<PaymentLinkResponse>): PaymentLinkResponse => r.body)
    );
  }

  /** Path part for operation `apiOrgsOrgIdPaymentResultGet()` */
  static readonly ApiOrgsOrgIdPaymentResultGetPath = '/api/orgs/{orgId}/payment-result';

  /**
   * redirect url for paybc to redirect to.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdPaymentResultGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdPaymentResultGet$Response(params: ApiOrgsOrgIdPaymentResultGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ActionResult>> {
    return apiOrgsOrgIdPaymentResultGet(this.http, this.rootUrl, params, context);
  }

  /**
   * redirect url for paybc to redirect to.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdPaymentResultGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdPaymentResultGet(params: ApiOrgsOrgIdPaymentResultGet$Params, context?: HttpContext): Observable<ActionResult> {
    return this.apiOrgsOrgIdPaymentResultGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<ActionResult>): ActionResult => r.body)
    );
  }

  /** Path part for operation `apiOrgsOrgIdPaymentsPaymentIdGet()` */
  static readonly ApiOrgsOrgIdPaymentsPaymentIdGetPath = '/api/orgs/{orgId}/payments/{paymentId}';

  /**
   * Get the payment result for org and payment.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdPaymentsPaymentIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdPaymentsPaymentIdGet$Response(params: ApiOrgsOrgIdPaymentsPaymentIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<PaymentResponse>> {
    return apiOrgsOrgIdPaymentsPaymentIdGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Get the payment result for org and payment.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdPaymentsPaymentIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdPaymentsPaymentIdGet(params: ApiOrgsOrgIdPaymentsPaymentIdGet$Params, context?: HttpContext): Observable<PaymentResponse> {
    return this.apiOrgsOrgIdPaymentsPaymentIdGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<PaymentResponse>): PaymentResponse => r.body)
    );
  }

  /** Path part for operation `apiOrgsOrgIdApplicationsApplicationIdPaymentAttemptsGet()` */
  static readonly ApiOrgsOrgIdApplicationsApplicationIdPaymentAttemptsGetPath = '/api/orgs/{orgId}/applications/{applicationId}/payment-attempts';

  /**
   * Get failed attempts for org paid application.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdApplicationsApplicationIdPaymentAttemptsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdApplicationsApplicationIdPaymentAttemptsGet$Response(params: ApiOrgsOrgIdApplicationsApplicationIdPaymentAttemptsGet$Params, context?: HttpContext): Observable<StrictHttpResponse<number>> {
    return apiOrgsOrgIdApplicationsApplicationIdPaymentAttemptsGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Get failed attempts for org paid application.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdApplicationsApplicationIdPaymentAttemptsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdApplicationsApplicationIdPaymentAttemptsGet(params: ApiOrgsOrgIdApplicationsApplicationIdPaymentAttemptsGet$Params, context?: HttpContext): Observable<number> {
    return this.apiOrgsOrgIdApplicationsApplicationIdPaymentAttemptsGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<number>): number => r.body)
    );
  }

  /** Path part for operation `apiOrgsOrgIdApplicationsApplicationIdPaymentReceiptGet()` */
  static readonly ApiOrgsOrgIdApplicationsApplicationIdPaymentReceiptGetPath = '/api/orgs/{orgId}/applications/{applicationId}/payment-receipt';

  /**
   * download the receipt for successful payment.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdApplicationsApplicationIdPaymentReceiptGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdApplicationsApplicationIdPaymentReceiptGet$Response(params: ApiOrgsOrgIdApplicationsApplicationIdPaymentReceiptGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Blob>> {
    return apiOrgsOrgIdApplicationsApplicationIdPaymentReceiptGet(this.http, this.rootUrl, params, context);
  }

  /**
   * download the receipt for successful payment.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdApplicationsApplicationIdPaymentReceiptGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdApplicationsApplicationIdPaymentReceiptGet(params: ApiOrgsOrgIdApplicationsApplicationIdPaymentReceiptGet$Params, context?: HttpContext): Observable<Blob> {
    return this.apiOrgsOrgIdApplicationsApplicationIdPaymentReceiptGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Blob>): Blob => r.body)
    );
  }

  /** Path part for operation `apiOrgsOrgIdApplicationsApplicationIdManualPaymentFormGet()` */
  static readonly ApiOrgsOrgIdApplicationsApplicationIdManualPaymentFormGetPath = '/api/orgs/{orgId}/applications/{applicationId}/manual-payment-form';

  /**
   * download the manual payment form.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiOrgsOrgIdApplicationsApplicationIdManualPaymentFormGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdApplicationsApplicationIdManualPaymentFormGet$Response(params: ApiOrgsOrgIdApplicationsApplicationIdManualPaymentFormGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Blob>> {
    return apiOrgsOrgIdApplicationsApplicationIdManualPaymentFormGet(this.http, this.rootUrl, params, context);
  }

  /**
   * download the manual payment form.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdApplicationsApplicationIdManualPaymentFormGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdApplicationsApplicationIdManualPaymentFormGet(params: ApiOrgsOrgIdApplicationsApplicationIdManualPaymentFormGet$Params, context?: HttpContext): Observable<Blob> {
    return this.apiOrgsOrgIdApplicationsApplicationIdManualPaymentFormGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Blob>): Blob => r.body)
    );
  }

  /** Path part for operation `apiCrrpaPaymentLinkPost()` */
  static readonly ApiCrrpaPaymentLinkPostPath = '/api/crrpa/payment-link';

  /**
   * Return the direct pay payment link.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiCrrpaPaymentLinkPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiCrrpaPaymentLinkPost$Response(params: ApiCrrpaPaymentLinkPost$Params, context?: HttpContext): Observable<StrictHttpResponse<PaymentLinkResponse>> {
    return apiCrrpaPaymentLinkPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Return the direct pay payment link.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiCrrpaPaymentLinkPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiCrrpaPaymentLinkPost(params: ApiCrrpaPaymentLinkPost$Params, context?: HttpContext): Observable<PaymentLinkResponse> {
    return this.apiCrrpaPaymentLinkPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<PaymentLinkResponse>): PaymentLinkResponse => r.body)
    );
  }

  /** Path part for operation `apiCrrpaPaymentResultGet()` */
  static readonly ApiCrrpaPaymentResultGetPath = '/api/crrpa/payment-result';

  /**
   * redirect url for paybc to redirect to.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiCrrpaPaymentResultGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiCrrpaPaymentResultGet$Response(params?: ApiCrrpaPaymentResultGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ActionResult>> {
    return apiCrrpaPaymentResultGet(this.http, this.rootUrl, params, context);
  }

  /**
   * redirect url for paybc to redirect to.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiCrrpaPaymentResultGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiCrrpaPaymentResultGet(params?: ApiCrrpaPaymentResultGet$Params, context?: HttpContext): Observable<ActionResult> {
    return this.apiCrrpaPaymentResultGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<ActionResult>): ActionResult => r.body)
    );
  }

  /** Path part for operation `apiCrrpaPaymentsPaymentIdGet()` */
  static readonly ApiCrrpaPaymentsPaymentIdGetPath = '/api/crrpa/payments/{paymentId}';

  /**
   * Get the payment result for application and payment.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiCrrpaPaymentsPaymentIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiCrrpaPaymentsPaymentIdGet$Response(params: ApiCrrpaPaymentsPaymentIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<PaymentResponse>> {
    return apiCrrpaPaymentsPaymentIdGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Get the payment result for application and payment.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiCrrpaPaymentsPaymentIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiCrrpaPaymentsPaymentIdGet(params: ApiCrrpaPaymentsPaymentIdGet$Params, context?: HttpContext): Observable<PaymentResponse> {
    return this.apiCrrpaPaymentsPaymentIdGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<PaymentResponse>): PaymentResponse => r.body)
    );
  }

  /** Path part for operation `apiCrrpaApplicationIdPaymentAttemptsGet()` */
  static readonly ApiCrrpaApplicationIdPaymentAttemptsGetPath = '/api/crrpa/{applicationId}/payment-attempts';

  /**
   * Get the payment result for application and payment.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiCrrpaApplicationIdPaymentAttemptsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiCrrpaApplicationIdPaymentAttemptsGet$Response(params: ApiCrrpaApplicationIdPaymentAttemptsGet$Params, context?: HttpContext): Observable<StrictHttpResponse<number>> {
    return apiCrrpaApplicationIdPaymentAttemptsGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Get the payment result for application and payment.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiCrrpaApplicationIdPaymentAttemptsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiCrrpaApplicationIdPaymentAttemptsGet(params: ApiCrrpaApplicationIdPaymentAttemptsGet$Params, context?: HttpContext): Observable<number> {
    return this.apiCrrpaApplicationIdPaymentAttemptsGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<number>): number => r.body)
    );
  }

  /** Path part for operation `apiCrrpaApplicationIdPaymentReceiptGet()` */
  static readonly ApiCrrpaApplicationIdPaymentReceiptGetPath = '/api/crrpa/{applicationId}/payment-receipt';

  /**
   * download the receipt for successful payment.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiCrrpaApplicationIdPaymentReceiptGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiCrrpaApplicationIdPaymentReceiptGet$Response(params: ApiCrrpaApplicationIdPaymentReceiptGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Blob>> {
    return apiCrrpaApplicationIdPaymentReceiptGet(this.http, this.rootUrl, params, context);
  }

  /**
   * download the receipt for successful payment.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiCrrpaApplicationIdPaymentReceiptGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiCrrpaApplicationIdPaymentReceiptGet(params: ApiCrrpaApplicationIdPaymentReceiptGet$Params, context?: HttpContext): Observable<Blob> {
    return this.apiCrrpaApplicationIdPaymentReceiptGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Blob>): Blob => r.body)
    );
  }

  /** Path part for operation `apiCrrpaApplicationIdManualPaymentFormGet()` */
  static readonly ApiCrrpaApplicationIdManualPaymentFormGetPath = '/api/crrpa/{applicationId}/manual-payment-form';

  /**
   * download the manual payment form.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiCrrpaApplicationIdManualPaymentFormGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiCrrpaApplicationIdManualPaymentFormGet$Response(params: ApiCrrpaApplicationIdManualPaymentFormGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Blob>> {
    return apiCrrpaApplicationIdManualPaymentFormGet(this.http, this.rootUrl, params, context);
  }

  /**
   * download the manual payment form.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiCrrpaApplicationIdManualPaymentFormGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiCrrpaApplicationIdManualPaymentFormGet(params: ApiCrrpaApplicationIdManualPaymentFormGet$Params, context?: HttpContext): Observable<Blob> {
    return this.apiCrrpaApplicationIdManualPaymentFormGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Blob>): Blob => r.body)
    );
  }

  /** Path part for operation `apiCrrpaPaymentSecureLinkGet()` */
  static readonly ApiCrrpaPaymentSecureLinkGetPath = '/api/crrpa/payment-secure-link';

  /**
   * Redirect to PayBC the direct pay payment page.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiCrrpaPaymentSecureLinkGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiCrrpaPaymentSecureLinkGet$Response(params?: ApiCrrpaPaymentSecureLinkGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ActionResult>> {
    return apiCrrpaPaymentSecureLinkGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Redirect to PayBC the direct pay payment page.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiCrrpaPaymentSecureLinkGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiCrrpaPaymentSecureLinkGet(params?: ApiCrrpaPaymentSecureLinkGet$Params, context?: HttpContext): Observable<ActionResult> {
    return this.apiCrrpaPaymentSecureLinkGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<ActionResult>): ActionResult => r.body)
    );
  }

}
