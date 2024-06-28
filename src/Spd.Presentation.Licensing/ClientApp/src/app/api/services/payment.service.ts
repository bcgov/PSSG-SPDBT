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
import { PaymentLinkCreateRequest } from '../models/payment-link-create-request';
import { PaymentLinkResponse } from '../models/payment-link-response';
import { PaymentResponse } from '../models/payment-response';

@Injectable({
  providedIn: 'root',
})
export class PaymentService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation apiUnauthLicenceApplicationIdPaymentLinkPost
   */
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
  apiUnauthLicenceApplicationIdPaymentLinkPost$Response(params: {
    applicationId: string;

    /**
     * which include Payment link create request
     */
    body: PaymentLinkCreateRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<PaymentLinkResponse>> {

    const rb = new RequestBuilder(this.rootUrl, PaymentService.ApiUnauthLicenceApplicationIdPaymentLinkPostPath, 'post');
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
   * To access the full response (for headers, for example), `apiUnauthLicenceApplicationIdPaymentLinkPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiUnauthLicenceApplicationIdPaymentLinkPost(params: {
    applicationId: string;

    /**
     * which include Payment link create request
     */
    body: PaymentLinkCreateRequest
  },
  context?: HttpContext

): Observable<PaymentLinkResponse> {

    return this.apiUnauthLicenceApplicationIdPaymentLinkPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<PaymentLinkResponse>) => r.body as PaymentLinkResponse)
    );
  }

  /**
   * Path part for operation apiUnauthLicencePaymentResultGet
   */
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
  apiUnauthLicencePaymentResultGet$Response(params?: {
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

    const rb = new RequestBuilder(this.rootUrl, PaymentService.ApiUnauthLicencePaymentResultGetPath, 'get');
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
   * To access the full response (for headers, for example), `apiUnauthLicencePaymentResultGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiUnauthLicencePaymentResultGet(params?: {
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

    return this.apiUnauthLicencePaymentResultGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<ActionResult>) => r.body as ActionResult)
    );
  }

  /**
   * Path part for operation apiUnauthLicencePaymentsPaymentIdGet
   */
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
  apiUnauthLicencePaymentsPaymentIdGet$Response(params: {
    paymentId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<PaymentResponse>> {

    const rb = new RequestBuilder(this.rootUrl, PaymentService.ApiUnauthLicencePaymentsPaymentIdGetPath, 'get');
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
   * To access the full response (for headers, for example), `apiUnauthLicencePaymentsPaymentIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiUnauthLicencePaymentsPaymentIdGet(params: {
    paymentId: string;
  },
  context?: HttpContext

): Observable<PaymentResponse> {

    return this.apiUnauthLicencePaymentsPaymentIdGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<PaymentResponse>) => r.body as PaymentResponse)
    );
  }

  /**
   * Path part for operation apiUnauthLicenceApplicationIdPaymentAttemptsGet
   */
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
  apiUnauthLicenceApplicationIdPaymentAttemptsGet$Response(params: {
    applicationId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<number>> {

    const rb = new RequestBuilder(this.rootUrl, PaymentService.ApiUnauthLicenceApplicationIdPaymentAttemptsGetPath, 'get');
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
        return (r as HttpResponse<any>).clone({ body: parseFloat(String((r as HttpResponse<any>).body)) }) as StrictHttpResponse<number>;
      })
    );
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
  apiUnauthLicenceApplicationIdPaymentAttemptsGet(params: {
    applicationId: string;
  },
  context?: HttpContext

): Observable<number> {

    return this.apiUnauthLicenceApplicationIdPaymentAttemptsGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<number>) => r.body as number)
    );
  }

  /**
   * Path part for operation apiUnauthLicenceApplicationIdPaymentReceiptGet
   */
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
  apiUnauthLicenceApplicationIdPaymentReceiptGet$Response(params: {
    applicationId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Blob>> {

    const rb = new RequestBuilder(this.rootUrl, PaymentService.ApiUnauthLicenceApplicationIdPaymentReceiptGetPath, 'get');
    if (params) {
      rb.path('applicationId', params.applicationId, {});
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
   * download the receipt for successful payment.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiUnauthLicenceApplicationIdPaymentReceiptGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiUnauthLicenceApplicationIdPaymentReceiptGet(params: {
    applicationId: string;
  },
  context?: HttpContext

): Observable<Blob> {

    return this.apiUnauthLicenceApplicationIdPaymentReceiptGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<Blob>) => r.body as Blob)
    );
  }

  /**
   * Path part for operation apiUnauthLicenceApplicationIdManualPaymentFormGet
   */
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
  apiUnauthLicenceApplicationIdManualPaymentFormGet$Response(params: {
    applicationId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Blob>> {

    const rb = new RequestBuilder(this.rootUrl, PaymentService.ApiUnauthLicenceApplicationIdManualPaymentFormGetPath, 'get');
    if (params) {
      rb.path('applicationId', params.applicationId, {});
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
   * download the manual payment form.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiUnauthLicenceApplicationIdManualPaymentFormGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiUnauthLicenceApplicationIdManualPaymentFormGet(params: {
    applicationId: string;
  },
  context?: HttpContext

): Observable<Blob> {

    return this.apiUnauthLicenceApplicationIdManualPaymentFormGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<Blob>) => r.body as Blob)
    );
  }

  /**
   * Path part for operation apiAuthLicenceApplicationIdPaymentLinkPost
   */
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
  apiAuthLicenceApplicationIdPaymentLinkPost$Response(params: {
    applicationId: string;

    /**
     * which include Payment link create request
     */
    body: PaymentLinkCreateRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<PaymentLinkResponse>> {

    const rb = new RequestBuilder(this.rootUrl, PaymentService.ApiAuthLicenceApplicationIdPaymentLinkPostPath, 'post');
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
   * To access the full response (for headers, for example), `apiAuthLicenceApplicationIdPaymentLinkPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiAuthLicenceApplicationIdPaymentLinkPost(params: {
    applicationId: string;

    /**
     * which include Payment link create request
     */
    body: PaymentLinkCreateRequest
  },
  context?: HttpContext

): Observable<PaymentLinkResponse> {

    return this.apiAuthLicenceApplicationIdPaymentLinkPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<PaymentLinkResponse>) => r.body as PaymentLinkResponse)
    );
  }

  /**
   * Path part for operation apiAuthLicencePaymentResultGet
   */
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
  apiAuthLicencePaymentResultGet$Response(params?: {
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

    const rb = new RequestBuilder(this.rootUrl, PaymentService.ApiAuthLicencePaymentResultGetPath, 'get');
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
   * To access the full response (for headers, for example), `apiAuthLicencePaymentResultGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiAuthLicencePaymentResultGet(params?: {
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

    return this.apiAuthLicencePaymentResultGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<ActionResult>) => r.body as ActionResult)
    );
  }

  /**
   * Path part for operation apiAuthLicencePaymentsPaymentIdGet
   */
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
  apiAuthLicencePaymentsPaymentIdGet$Response(params: {
    paymentId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<PaymentResponse>> {

    const rb = new RequestBuilder(this.rootUrl, PaymentService.ApiAuthLicencePaymentsPaymentIdGetPath, 'get');
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
   * To access the full response (for headers, for example), `apiAuthLicencePaymentsPaymentIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiAuthLicencePaymentsPaymentIdGet(params: {
    paymentId: string;
  },
  context?: HttpContext

): Observable<PaymentResponse> {

    return this.apiAuthLicencePaymentsPaymentIdGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<PaymentResponse>) => r.body as PaymentResponse)
    );
  }

  /**
   * Path part for operation apiAuthLicenceApplicationIdPaymentAttemptsGet
   */
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
  apiAuthLicenceApplicationIdPaymentAttemptsGet$Response(params: {
    applicationId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<number>> {

    const rb = new RequestBuilder(this.rootUrl, PaymentService.ApiAuthLicenceApplicationIdPaymentAttemptsGetPath, 'get');
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
        return (r as HttpResponse<any>).clone({ body: parseFloat(String((r as HttpResponse<any>).body)) }) as StrictHttpResponse<number>;
      })
    );
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
  apiAuthLicenceApplicationIdPaymentAttemptsGet(params: {
    applicationId: string;
  },
  context?: HttpContext

): Observable<number> {

    return this.apiAuthLicenceApplicationIdPaymentAttemptsGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<number>) => r.body as number)
    );
  }

  /**
   * Path part for operation apiAuthLicenceApplicationIdPaymentReceiptGet
   */
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
  apiAuthLicenceApplicationIdPaymentReceiptGet$Response(params: {
    applicationId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Blob>> {

    const rb = new RequestBuilder(this.rootUrl, PaymentService.ApiAuthLicenceApplicationIdPaymentReceiptGetPath, 'get');
    if (params) {
      rb.path('applicationId', params.applicationId, {});
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
   * download the receipt for successful payment.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiAuthLicenceApplicationIdPaymentReceiptGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiAuthLicenceApplicationIdPaymentReceiptGet(params: {
    applicationId: string;
  },
  context?: HttpContext

): Observable<Blob> {

    return this.apiAuthLicenceApplicationIdPaymentReceiptGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<Blob>) => r.body as Blob)
    );
  }

  /**
   * Path part for operation apiAuthLicenceApplicationIdManualPaymentFormGet
   */
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
  apiAuthLicenceApplicationIdManualPaymentFormGet$Response(params: {
    applicationId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Blob>> {

    const rb = new RequestBuilder(this.rootUrl, PaymentService.ApiAuthLicenceApplicationIdManualPaymentFormGetPath, 'get');
    if (params) {
      rb.path('applicationId', params.applicationId, {});
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
   * download the manual payment form.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiAuthLicenceApplicationIdManualPaymentFormGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiAuthLicenceApplicationIdManualPaymentFormGet(params: {
    applicationId: string;
  },
  context?: HttpContext

): Observable<Blob> {

    return this.apiAuthLicenceApplicationIdManualPaymentFormGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<Blob>) => r.body as Blob)
    );
  }

  /**
   * Path part for operation apiBusinessBizIdApplicationsApplicationIdPaymentLinkPost
   */
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
  apiBusinessBizIdApplicationsApplicationIdPaymentLinkPost$Response(params: {

    /**
     * business id
     */
    bizId: string;
    applicationId: string;

    /**
     * which include Payment link create request
     */
    body: PaymentLinkCreateRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<PaymentLinkResponse>> {

    const rb = new RequestBuilder(this.rootUrl, PaymentService.ApiBusinessBizIdApplicationsApplicationIdPaymentLinkPostPath, 'post');
    if (params) {
      rb.path('bizId', params.bizId, {});
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
   * To access the full response (for headers, for example), `apiBusinessBizIdApplicationsApplicationIdPaymentLinkPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiBusinessBizIdApplicationsApplicationIdPaymentLinkPost(params: {

    /**
     * business id
     */
    bizId: string;
    applicationId: string;

    /**
     * which include Payment link create request
     */
    body: PaymentLinkCreateRequest
  },
  context?: HttpContext

): Observable<PaymentLinkResponse> {

    return this.apiBusinessBizIdApplicationsApplicationIdPaymentLinkPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<PaymentLinkResponse>) => r.body as PaymentLinkResponse)
    );
  }

  /**
   * Path part for operation apiBusinessBizIdPaymentResultGet
   */
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
  apiBusinessBizIdPaymentResultGet$Response(params: {
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
    bizId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ActionResult>> {

    const rb = new RequestBuilder(this.rootUrl, PaymentService.ApiBusinessBizIdPaymentResultGetPath, 'get');
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
      rb.path('bizId', params.bizId, {});
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
   * To access the full response (for headers, for example), `apiBusinessBizIdPaymentResultGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBusinessBizIdPaymentResultGet(params: {
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
    bizId: string;
  },
  context?: HttpContext

): Observable<ActionResult> {

    return this.apiBusinessBizIdPaymentResultGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<ActionResult>) => r.body as ActionResult)
    );
  }

  /**
   * Path part for operation apiBusinessBizIdPaymentsPaymentIdGet
   */
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
  apiBusinessBizIdPaymentsPaymentIdGet$Response(params: {
    paymentId: string;
    bizId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<PaymentResponse>> {

    const rb = new RequestBuilder(this.rootUrl, PaymentService.ApiBusinessBizIdPaymentsPaymentIdGetPath, 'get');
    if (params) {
      rb.path('paymentId', params.paymentId, {});
      rb.path('bizId', params.bizId, {});
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
   * To access the full response (for headers, for example), `apiBusinessBizIdPaymentsPaymentIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBusinessBizIdPaymentsPaymentIdGet(params: {
    paymentId: string;
    bizId: string;
  },
  context?: HttpContext

): Observable<PaymentResponse> {

    return this.apiBusinessBizIdPaymentsPaymentIdGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<PaymentResponse>) => r.body as PaymentResponse)
    );
  }

  /**
   * Path part for operation apiBusinessBizIdApplicationsApplicationIdPaymentAttemptsGet
   */
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
  apiBusinessBizIdApplicationsApplicationIdPaymentAttemptsGet$Response(params: {
    applicationId: string;
    bizId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<number>> {

    const rb = new RequestBuilder(this.rootUrl, PaymentService.ApiBusinessBizIdApplicationsApplicationIdPaymentAttemptsGetPath, 'get');
    if (params) {
      rb.path('applicationId', params.applicationId, {});
      rb.path('bizId', params.bizId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: parseFloat(String((r as HttpResponse<any>).body)) }) as StrictHttpResponse<number>;
      })
    );
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
  apiBusinessBizIdApplicationsApplicationIdPaymentAttemptsGet(params: {
    applicationId: string;
    bizId: string;
  },
  context?: HttpContext

): Observable<number> {

    return this.apiBusinessBizIdApplicationsApplicationIdPaymentAttemptsGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<number>) => r.body as number)
    );
  }

  /**
   * Path part for operation apiBusinessBizIdApplicationsApplicationIdPaymentReceiptGet
   */
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
  apiBusinessBizIdApplicationsApplicationIdPaymentReceiptGet$Response(params: {
    applicationId: string;
    bizId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Blob>> {

    const rb = new RequestBuilder(this.rootUrl, PaymentService.ApiBusinessBizIdApplicationsApplicationIdPaymentReceiptGetPath, 'get');
    if (params) {
      rb.path('applicationId', params.applicationId, {});
      rb.path('bizId', params.bizId, {});
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
   * download the receipt for successful payment.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBusinessBizIdApplicationsApplicationIdPaymentReceiptGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBusinessBizIdApplicationsApplicationIdPaymentReceiptGet(params: {
    applicationId: string;
    bizId: string;
  },
  context?: HttpContext

): Observable<Blob> {

    return this.apiBusinessBizIdApplicationsApplicationIdPaymentReceiptGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<Blob>) => r.body as Blob)
    );
  }

  /**
   * Path part for operation apiBusinessBizIdApplicationsApplicationIdManualPaymentFormGet
   */
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
  apiBusinessBizIdApplicationsApplicationIdManualPaymentFormGet$Response(params: {
    applicationId: string;
    bizId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Blob>> {

    const rb = new RequestBuilder(this.rootUrl, PaymentService.ApiBusinessBizIdApplicationsApplicationIdManualPaymentFormGetPath, 'get');
    if (params) {
      rb.path('applicationId', params.applicationId, {});
      rb.path('bizId', params.bizId, {});
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
   * download the manual payment form.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBusinessBizIdApplicationsApplicationIdManualPaymentFormGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBusinessBizIdApplicationsApplicationIdManualPaymentFormGet(params: {
    applicationId: string;
    bizId: string;
  },
  context?: HttpContext

): Observable<Blob> {

    return this.apiBusinessBizIdApplicationsApplicationIdManualPaymentFormGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<Blob>) => r.body as Blob)
    );
  }

  /**
   * Path part for operation apiLicensingPaymentSecureLinkGet
   */
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
  apiLicensingPaymentSecureLinkGet$Response(params?: {
    encodedAppId?: string;
    encodedPaymentId?: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ActionResult>> {

    const rb = new RequestBuilder(this.rootUrl, PaymentService.ApiLicensingPaymentSecureLinkGetPath, 'get');
    if (params) {
      rb.query('encodedAppId', params.encodedAppId, {});
      rb.query('encodedPaymentId', params.encodedPaymentId, {});
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
   * Redirect to PayBC the direct pay payment page.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiLicensingPaymentSecureLinkGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiLicensingPaymentSecureLinkGet(params?: {
    encodedAppId?: string;
    encodedPaymentId?: string;
  },
  context?: HttpContext

): Observable<ActionResult> {

    return this.apiLicensingPaymentSecureLinkGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<ActionResult>) => r.body as ActionResult)
    );
  }

}
