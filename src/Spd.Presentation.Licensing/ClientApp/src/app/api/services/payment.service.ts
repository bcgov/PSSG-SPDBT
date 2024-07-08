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
import { apiAuthLicenceApplicationIdManualPaymentFormGet } from '../fn/payment/api-auth-licence-application-id-manual-payment-form-get';
import { ApiAuthLicenceApplicationIdManualPaymentFormGet$Params } from '../fn/payment/api-auth-licence-application-id-manual-payment-form-get';
import { apiAuthLicenceApplicationIdPaymentAttemptsGet } from '../fn/payment/api-auth-licence-application-id-payment-attempts-get';
import { ApiAuthLicenceApplicationIdPaymentAttemptsGet$Params } from '../fn/payment/api-auth-licence-application-id-payment-attempts-get';
import { apiAuthLicenceApplicationIdPaymentLinkPost } from '../fn/payment/api-auth-licence-application-id-payment-link-post';
import { ApiAuthLicenceApplicationIdPaymentLinkPost$Params } from '../fn/payment/api-auth-licence-application-id-payment-link-post';
import { apiAuthLicenceApplicationIdPaymentReceiptGet } from '../fn/payment/api-auth-licence-application-id-payment-receipt-get';
import { ApiAuthLicenceApplicationIdPaymentReceiptGet$Params } from '../fn/payment/api-auth-licence-application-id-payment-receipt-get';
import { apiAuthLicencePaymentResultGet } from '../fn/payment/api-auth-licence-payment-result-get';
import { ApiAuthLicencePaymentResultGet$Params } from '../fn/payment/api-auth-licence-payment-result-get';
import { apiAuthLicencePaymentsPaymentIdGet } from '../fn/payment/api-auth-licence-payments-payment-id-get';
import { ApiAuthLicencePaymentsPaymentIdGet$Params } from '../fn/payment/api-auth-licence-payments-payment-id-get';
import { apiBusinessBizIdApplicationsApplicationIdManualPaymentFormGet } from '../fn/payment/api-business-biz-id-applications-application-id-manual-payment-form-get';
import { ApiBusinessBizIdApplicationsApplicationIdManualPaymentFormGet$Params } from '../fn/payment/api-business-biz-id-applications-application-id-manual-payment-form-get';
import { apiBusinessBizIdApplicationsApplicationIdPaymentAttemptsGet } from '../fn/payment/api-business-biz-id-applications-application-id-payment-attempts-get';
import { ApiBusinessBizIdApplicationsApplicationIdPaymentAttemptsGet$Params } from '../fn/payment/api-business-biz-id-applications-application-id-payment-attempts-get';
import { apiBusinessBizIdApplicationsApplicationIdPaymentLinkPost } from '../fn/payment/api-business-biz-id-applications-application-id-payment-link-post';
import { ApiBusinessBizIdApplicationsApplicationIdPaymentLinkPost$Params } from '../fn/payment/api-business-biz-id-applications-application-id-payment-link-post';
import { apiBusinessBizIdApplicationsApplicationIdPaymentReceiptGet } from '../fn/payment/api-business-biz-id-applications-application-id-payment-receipt-get';
import { ApiBusinessBizIdApplicationsApplicationIdPaymentReceiptGet$Params } from '../fn/payment/api-business-biz-id-applications-application-id-payment-receipt-get';
import { apiBusinessBizIdPaymentResultGet } from '../fn/payment/api-business-biz-id-payment-result-get';
import { ApiBusinessBizIdPaymentResultGet$Params } from '../fn/payment/api-business-biz-id-payment-result-get';
import { apiBusinessBizIdPaymentsPaymentIdGet } from '../fn/payment/api-business-biz-id-payments-payment-id-get';
import { ApiBusinessBizIdPaymentsPaymentIdGet$Params } from '../fn/payment/api-business-biz-id-payments-payment-id-get';
import { apiLicensingPaymentSecureLinkGet } from '../fn/payment/api-licensing-payment-secure-link-get';
import { ApiLicensingPaymentSecureLinkGet$Params } from '../fn/payment/api-licensing-payment-secure-link-get';
import { apiUnauthLicenceApplicationIdManualPaymentFormGet } from '../fn/payment/api-unauth-licence-application-id-manual-payment-form-get';
import { ApiUnauthLicenceApplicationIdManualPaymentFormGet$Params } from '../fn/payment/api-unauth-licence-application-id-manual-payment-form-get';
import { apiUnauthLicenceApplicationIdPaymentAttemptsGet } from '../fn/payment/api-unauth-licence-application-id-payment-attempts-get';
import { ApiUnauthLicenceApplicationIdPaymentAttemptsGet$Params } from '../fn/payment/api-unauth-licence-application-id-payment-attempts-get';
import { apiUnauthLicenceApplicationIdPaymentLinkPost } from '../fn/payment/api-unauth-licence-application-id-payment-link-post';
import { ApiUnauthLicenceApplicationIdPaymentLinkPost$Params } from '../fn/payment/api-unauth-licence-application-id-payment-link-post';
import { apiUnauthLicenceApplicationIdPaymentReceiptGet } from '../fn/payment/api-unauth-licence-application-id-payment-receipt-get';
import { ApiUnauthLicenceApplicationIdPaymentReceiptGet$Params } from '../fn/payment/api-unauth-licence-application-id-payment-receipt-get';
import { apiUnauthLicencePaymentResultGet } from '../fn/payment/api-unauth-licence-payment-result-get';
import { ApiUnauthLicencePaymentResultGet$Params } from '../fn/payment/api-unauth-licence-payment-result-get';
import { apiUnauthLicencePaymentsPaymentIdGet } from '../fn/payment/api-unauth-licence-payments-payment-id-get';
import { ApiUnauthLicencePaymentsPaymentIdGet$Params } from '../fn/payment/api-unauth-licence-payments-payment-id-get';
import { PaymentLinkResponse } from '../models/payment-link-response';
import { PaymentResponse } from '../models/payment-response';

@Injectable({ providedIn: 'root' })
export class PaymentService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `apiUnauthLicenceApplicationIdPaymentLinkPost()` */
  static readonly ApiUnauthLicenceApplicationIdPaymentLinkPostPath = '/api/unauth-licence/{applicationId}/payment-link';

  /**
   * Return the direct pay payment link.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiUnauthLicenceApplicationIdPaymentLinkPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiUnauthLicenceApplicationIdPaymentLinkPost$Response(params: ApiUnauthLicenceApplicationIdPaymentLinkPost$Params, context?: HttpContext): Observable<StrictHttpResponse<PaymentLinkResponse>> {
    return apiUnauthLicenceApplicationIdPaymentLinkPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Return the direct pay payment link.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiUnauthLicenceApplicationIdPaymentLinkPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiUnauthLicenceApplicationIdPaymentLinkPost(params: ApiUnauthLicenceApplicationIdPaymentLinkPost$Params, context?: HttpContext): Observable<PaymentLinkResponse> {
    return this.apiUnauthLicenceApplicationIdPaymentLinkPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<PaymentLinkResponse>): PaymentLinkResponse => r.body)
    );
  }

  /** Path part for operation `apiUnauthLicencePaymentResultGet()` */
  static readonly ApiUnauthLicencePaymentResultGetPath = '/api/unauth-licence/payment-result';

  /**
   * redirect url for paybc to redirect to.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiUnauthLicencePaymentResultGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiUnauthLicencePaymentResultGet$Response(params?: ApiUnauthLicencePaymentResultGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ActionResult>> {
    return apiUnauthLicencePaymentResultGet(this.http, this.rootUrl, params, context);
  }

  /**
   * redirect url for paybc to redirect to.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiUnauthLicencePaymentResultGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiUnauthLicencePaymentResultGet(params?: ApiUnauthLicencePaymentResultGet$Params, context?: HttpContext): Observable<ActionResult> {
    return this.apiUnauthLicencePaymentResultGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<ActionResult>): ActionResult => r.body)
    );
  }

  /** Path part for operation `apiUnauthLicencePaymentsPaymentIdGet()` */
  static readonly ApiUnauthLicencePaymentsPaymentIdGetPath = '/api/unauth-licence/payments/{paymentId}';

  /**
   * Get the payment result for application and payment.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiUnauthLicencePaymentsPaymentIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiUnauthLicencePaymentsPaymentIdGet$Response(params: ApiUnauthLicencePaymentsPaymentIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<PaymentResponse>> {
    return apiUnauthLicencePaymentsPaymentIdGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Get the payment result for application and payment.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiUnauthLicencePaymentsPaymentIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiUnauthLicencePaymentsPaymentIdGet(params: ApiUnauthLicencePaymentsPaymentIdGet$Params, context?: HttpContext): Observable<PaymentResponse> {
    return this.apiUnauthLicencePaymentsPaymentIdGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<PaymentResponse>): PaymentResponse => r.body)
    );
  }

  /** Path part for operation `apiUnauthLicenceApplicationIdPaymentAttemptsGet()` */
  static readonly ApiUnauthLicenceApplicationIdPaymentAttemptsGetPath = '/api/unauth-licence/{applicationId}/payment-attempts';

  /**
   * Get the payment failed times for an application.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiUnauthLicenceApplicationIdPaymentAttemptsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiUnauthLicenceApplicationIdPaymentAttemptsGet$Response(params: ApiUnauthLicenceApplicationIdPaymentAttemptsGet$Params, context?: HttpContext): Observable<StrictHttpResponse<number>> {
    return apiUnauthLicenceApplicationIdPaymentAttemptsGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Get the payment failed times for an application.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiUnauthLicenceApplicationIdPaymentAttemptsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiUnauthLicenceApplicationIdPaymentAttemptsGet(params: ApiUnauthLicenceApplicationIdPaymentAttemptsGet$Params, context?: HttpContext): Observable<number> {
    return this.apiUnauthLicenceApplicationIdPaymentAttemptsGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<number>): number => r.body)
    );
  }

  /** Path part for operation `apiUnauthLicenceApplicationIdPaymentReceiptGet()` */
  static readonly ApiUnauthLicenceApplicationIdPaymentReceiptGetPath = '/api/unauth-licence/{applicationId}/payment-receipt';

  /**
   * download the receipt for successful payment.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiUnauthLicenceApplicationIdPaymentReceiptGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiUnauthLicenceApplicationIdPaymentReceiptGet$Response(params: ApiUnauthLicenceApplicationIdPaymentReceiptGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Blob>> {
    return apiUnauthLicenceApplicationIdPaymentReceiptGet(this.http, this.rootUrl, params, context);
  }

  /**
   * download the receipt for successful payment.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiUnauthLicenceApplicationIdPaymentReceiptGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiUnauthLicenceApplicationIdPaymentReceiptGet(params: ApiUnauthLicenceApplicationIdPaymentReceiptGet$Params, context?: HttpContext): Observable<Blob> {
    return this.apiUnauthLicenceApplicationIdPaymentReceiptGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Blob>): Blob => r.body)
    );
  }

  /** Path part for operation `apiUnauthLicenceApplicationIdManualPaymentFormGet()` */
  static readonly ApiUnauthLicenceApplicationIdManualPaymentFormGetPath = '/api/unauth-licence/{applicationId}/manual-payment-form';

  /**
   * download the manual payment form.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiUnauthLicenceApplicationIdManualPaymentFormGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiUnauthLicenceApplicationIdManualPaymentFormGet$Response(params: ApiUnauthLicenceApplicationIdManualPaymentFormGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Blob>> {
    return apiUnauthLicenceApplicationIdManualPaymentFormGet(this.http, this.rootUrl, params, context);
  }

  /**
   * download the manual payment form.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiUnauthLicenceApplicationIdManualPaymentFormGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiUnauthLicenceApplicationIdManualPaymentFormGet(params: ApiUnauthLicenceApplicationIdManualPaymentFormGet$Params, context?: HttpContext): Observable<Blob> {
    return this.apiUnauthLicenceApplicationIdManualPaymentFormGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Blob>): Blob => r.body)
    );
  }

  /** Path part for operation `apiAuthLicenceApplicationIdPaymentLinkPost()` */
  static readonly ApiAuthLicenceApplicationIdPaymentLinkPostPath = '/api/auth-licence/{applicationId}/payment-link';

  /**
   * Return the direct pay payment link.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiAuthLicenceApplicationIdPaymentLinkPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiAuthLicenceApplicationIdPaymentLinkPost$Response(params: ApiAuthLicenceApplicationIdPaymentLinkPost$Params, context?: HttpContext): Observable<StrictHttpResponse<PaymentLinkResponse>> {
    return apiAuthLicenceApplicationIdPaymentLinkPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Return the direct pay payment link.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiAuthLicenceApplicationIdPaymentLinkPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiAuthLicenceApplicationIdPaymentLinkPost(params: ApiAuthLicenceApplicationIdPaymentLinkPost$Params, context?: HttpContext): Observable<PaymentLinkResponse> {
    return this.apiAuthLicenceApplicationIdPaymentLinkPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<PaymentLinkResponse>): PaymentLinkResponse => r.body)
    );
  }

  /** Path part for operation `apiAuthLicencePaymentResultGet()` */
  static readonly ApiAuthLicencePaymentResultGetPath = '/api/auth-licence/payment-result';

  /**
   * redirect url for paybc to redirect to.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiAuthLicencePaymentResultGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiAuthLicencePaymentResultGet$Response(params?: ApiAuthLicencePaymentResultGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ActionResult>> {
    return apiAuthLicencePaymentResultGet(this.http, this.rootUrl, params, context);
  }

  /**
   * redirect url for paybc to redirect to.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiAuthLicencePaymentResultGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiAuthLicencePaymentResultGet(params?: ApiAuthLicencePaymentResultGet$Params, context?: HttpContext): Observable<ActionResult> {
    return this.apiAuthLicencePaymentResultGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<ActionResult>): ActionResult => r.body)
    );
  }

  /** Path part for operation `apiAuthLicencePaymentsPaymentIdGet()` */
  static readonly ApiAuthLicencePaymentsPaymentIdGetPath = '/api/auth-licence/payments/{paymentId}';

  /**
   * Get the payment result for application and payment.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiAuthLicencePaymentsPaymentIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiAuthLicencePaymentsPaymentIdGet$Response(params: ApiAuthLicencePaymentsPaymentIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<PaymentResponse>> {
    return apiAuthLicencePaymentsPaymentIdGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Get the payment result for application and payment.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiAuthLicencePaymentsPaymentIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiAuthLicencePaymentsPaymentIdGet(params: ApiAuthLicencePaymentsPaymentIdGet$Params, context?: HttpContext): Observable<PaymentResponse> {
    return this.apiAuthLicencePaymentsPaymentIdGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<PaymentResponse>): PaymentResponse => r.body)
    );
  }

  /** Path part for operation `apiAuthLicenceApplicationIdPaymentAttemptsGet()` */
  static readonly ApiAuthLicenceApplicationIdPaymentAttemptsGetPath = '/api/auth-licence/{applicationId}/payment-attempts';

  /**
   * Get the failed payment times for an application.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiAuthLicenceApplicationIdPaymentAttemptsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiAuthLicenceApplicationIdPaymentAttemptsGet$Response(params: ApiAuthLicenceApplicationIdPaymentAttemptsGet$Params, context?: HttpContext): Observable<StrictHttpResponse<number>> {
    return apiAuthLicenceApplicationIdPaymentAttemptsGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Get the failed payment times for an application.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiAuthLicenceApplicationIdPaymentAttemptsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiAuthLicenceApplicationIdPaymentAttemptsGet(params: ApiAuthLicenceApplicationIdPaymentAttemptsGet$Params, context?: HttpContext): Observable<number> {
    return this.apiAuthLicenceApplicationIdPaymentAttemptsGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<number>): number => r.body)
    );
  }

  /** Path part for operation `apiAuthLicenceApplicationIdPaymentReceiptGet()` */
  static readonly ApiAuthLicenceApplicationIdPaymentReceiptGetPath = '/api/auth-licence/{applicationId}/payment-receipt';

  /**
   * download the receipt for successful payment.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiAuthLicenceApplicationIdPaymentReceiptGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiAuthLicenceApplicationIdPaymentReceiptGet$Response(params: ApiAuthLicenceApplicationIdPaymentReceiptGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Blob>> {
    return apiAuthLicenceApplicationIdPaymentReceiptGet(this.http, this.rootUrl, params, context);
  }

  /**
   * download the receipt for successful payment.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiAuthLicenceApplicationIdPaymentReceiptGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiAuthLicenceApplicationIdPaymentReceiptGet(params: ApiAuthLicenceApplicationIdPaymentReceiptGet$Params, context?: HttpContext): Observable<Blob> {
    return this.apiAuthLicenceApplicationIdPaymentReceiptGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Blob>): Blob => r.body)
    );
  }

  /** Path part for operation `apiAuthLicenceApplicationIdManualPaymentFormGet()` */
  static readonly ApiAuthLicenceApplicationIdManualPaymentFormGetPath = '/api/auth-licence/{applicationId}/manual-payment-form';

  /**
   * download the manual payment form.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiAuthLicenceApplicationIdManualPaymentFormGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiAuthLicenceApplicationIdManualPaymentFormGet$Response(params: ApiAuthLicenceApplicationIdManualPaymentFormGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Blob>> {
    return apiAuthLicenceApplicationIdManualPaymentFormGet(this.http, this.rootUrl, params, context);
  }

  /**
   * download the manual payment form.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiAuthLicenceApplicationIdManualPaymentFormGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiAuthLicenceApplicationIdManualPaymentFormGet(params: ApiAuthLicenceApplicationIdManualPaymentFormGet$Params, context?: HttpContext): Observable<Blob> {
    return this.apiAuthLicenceApplicationIdManualPaymentFormGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Blob>): Blob => r.body)
    );
  }

  /** Path part for operation `apiBusinessBizIdApplicationsApplicationIdPaymentLinkPost()` */
  static readonly ApiBusinessBizIdApplicationsApplicationIdPaymentLinkPostPath = '/api/business/{bizId}/applications/{applicationId}/payment-link';

  /**
   * Return the direct pay payment link.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBusinessBizIdApplicationsApplicationIdPaymentLinkPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiBusinessBizIdApplicationsApplicationIdPaymentLinkPost$Response(params: ApiBusinessBizIdApplicationsApplicationIdPaymentLinkPost$Params, context?: HttpContext): Observable<StrictHttpResponse<PaymentLinkResponse>> {
    return apiBusinessBizIdApplicationsApplicationIdPaymentLinkPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Return the direct pay payment link.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBusinessBizIdApplicationsApplicationIdPaymentLinkPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiBusinessBizIdApplicationsApplicationIdPaymentLinkPost(params: ApiBusinessBizIdApplicationsApplicationIdPaymentLinkPost$Params, context?: HttpContext): Observable<PaymentLinkResponse> {
    return this.apiBusinessBizIdApplicationsApplicationIdPaymentLinkPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<PaymentLinkResponse>): PaymentLinkResponse => r.body)
    );
  }

  /** Path part for operation `apiBusinessBizIdPaymentResultGet()` */
  static readonly ApiBusinessBizIdPaymentResultGetPath = '/api/business/{bizId}/payment-result';

  /**
   * redirect url for paybc to redirect to.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBusinessBizIdPaymentResultGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBusinessBizIdPaymentResultGet$Response(params: ApiBusinessBizIdPaymentResultGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ActionResult>> {
    return apiBusinessBizIdPaymentResultGet(this.http, this.rootUrl, params, context);
  }

  /**
   * redirect url for paybc to redirect to.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBusinessBizIdPaymentResultGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBusinessBizIdPaymentResultGet(params: ApiBusinessBizIdPaymentResultGet$Params, context?: HttpContext): Observable<ActionResult> {
    return this.apiBusinessBizIdPaymentResultGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<ActionResult>): ActionResult => r.body)
    );
  }

  /** Path part for operation `apiBusinessBizIdPaymentsPaymentIdGet()` */
  static readonly ApiBusinessBizIdPaymentsPaymentIdGetPath = '/api/business/{bizId}/payments/{paymentId}';

  /**
   * Get the payment result for application and payment.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBusinessBizIdPaymentsPaymentIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBusinessBizIdPaymentsPaymentIdGet$Response(params: ApiBusinessBizIdPaymentsPaymentIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<PaymentResponse>> {
    return apiBusinessBizIdPaymentsPaymentIdGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Get the payment result for application and payment.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBusinessBizIdPaymentsPaymentIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBusinessBizIdPaymentsPaymentIdGet(params: ApiBusinessBizIdPaymentsPaymentIdGet$Params, context?: HttpContext): Observable<PaymentResponse> {
    return this.apiBusinessBizIdPaymentsPaymentIdGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<PaymentResponse>): PaymentResponse => r.body)
    );
  }

  /** Path part for operation `apiBusinessBizIdApplicationsApplicationIdPaymentAttemptsGet()` */
  static readonly ApiBusinessBizIdApplicationsApplicationIdPaymentAttemptsGetPath = '/api/business/{bizId}/applications/{applicationId}/payment-attempts';

  /**
   * Get the failed payment times for an application.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBusinessBizIdApplicationsApplicationIdPaymentAttemptsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBusinessBizIdApplicationsApplicationIdPaymentAttemptsGet$Response(params: ApiBusinessBizIdApplicationsApplicationIdPaymentAttemptsGet$Params, context?: HttpContext): Observable<StrictHttpResponse<number>> {
    return apiBusinessBizIdApplicationsApplicationIdPaymentAttemptsGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Get the failed payment times for an application.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBusinessBizIdApplicationsApplicationIdPaymentAttemptsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBusinessBizIdApplicationsApplicationIdPaymentAttemptsGet(params: ApiBusinessBizIdApplicationsApplicationIdPaymentAttemptsGet$Params, context?: HttpContext): Observable<number> {
    return this.apiBusinessBizIdApplicationsApplicationIdPaymentAttemptsGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<number>): number => r.body)
    );
  }

  /** Path part for operation `apiBusinessBizIdApplicationsApplicationIdPaymentReceiptGet()` */
  static readonly ApiBusinessBizIdApplicationsApplicationIdPaymentReceiptGetPath = '/api/business/{bizId}/applications/{applicationId}/payment-receipt';

  /**
   * download the receipt for successful payment.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBusinessBizIdApplicationsApplicationIdPaymentReceiptGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBusinessBizIdApplicationsApplicationIdPaymentReceiptGet$Response(params: ApiBusinessBizIdApplicationsApplicationIdPaymentReceiptGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Blob>> {
    return apiBusinessBizIdApplicationsApplicationIdPaymentReceiptGet(this.http, this.rootUrl, params, context);
  }

  /**
   * download the receipt for successful payment.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBusinessBizIdApplicationsApplicationIdPaymentReceiptGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBusinessBizIdApplicationsApplicationIdPaymentReceiptGet(params: ApiBusinessBizIdApplicationsApplicationIdPaymentReceiptGet$Params, context?: HttpContext): Observable<Blob> {
    return this.apiBusinessBizIdApplicationsApplicationIdPaymentReceiptGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Blob>): Blob => r.body)
    );
  }

  /** Path part for operation `apiBusinessBizIdApplicationsApplicationIdManualPaymentFormGet()` */
  static readonly ApiBusinessBizIdApplicationsApplicationIdManualPaymentFormGetPath = '/api/business/{bizId}/applications/{applicationId}/manual-payment-form';

  /**
   * download the manual payment form.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBusinessBizIdApplicationsApplicationIdManualPaymentFormGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBusinessBizIdApplicationsApplicationIdManualPaymentFormGet$Response(params: ApiBusinessBizIdApplicationsApplicationIdManualPaymentFormGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Blob>> {
    return apiBusinessBizIdApplicationsApplicationIdManualPaymentFormGet(this.http, this.rootUrl, params, context);
  }

  /**
   * download the manual payment form.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBusinessBizIdApplicationsApplicationIdManualPaymentFormGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBusinessBizIdApplicationsApplicationIdManualPaymentFormGet(params: ApiBusinessBizIdApplicationsApplicationIdManualPaymentFormGet$Params, context?: HttpContext): Observable<Blob> {
    return this.apiBusinessBizIdApplicationsApplicationIdManualPaymentFormGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Blob>): Blob => r.body)
    );
  }

  /** Path part for operation `apiLicensingPaymentSecureLinkGet()` */
  static readonly ApiLicensingPaymentSecureLinkGetPath = '/api/licensing/payment-secure-link';

  /**
   * Redirect to PayBC the direct pay payment page.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiLicensingPaymentSecureLinkGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiLicensingPaymentSecureLinkGet$Response(params?: ApiLicensingPaymentSecureLinkGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ActionResult>> {
    return apiLicensingPaymentSecureLinkGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Redirect to PayBC the direct pay payment page.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiLicensingPaymentSecureLinkGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiLicensingPaymentSecureLinkGet(params?: ApiLicensingPaymentSecureLinkGet$Params, context?: HttpContext): Observable<ActionResult> {
    return this.apiLicensingPaymentSecureLinkGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<ActionResult>): ActionResult => r.body)
    );
  }

}
