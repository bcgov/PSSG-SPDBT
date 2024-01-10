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
    body: PaymentLinkCreateRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<PaymentLinkResponse>> {

    const rb = new RequestBuilder(this.rootUrl, PaymentService.ApiUnauthLicenceApplicationIdPaymentLinkPostPath, 'post');
    if (params) {
      rb.path('applicationId', params.applicationId, {"style":"simple"});
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
      rb.query('trnApproved', params.trnApproved, {"style":"form"});
      rb.query('messageText', params.messageText, {"style":"form"});
      rb.query('cardType', params.cardType, {"style":"form"});
      rb.query('trnOrderId', params.trnOrderId, {"style":"form"});
      rb.query('trnAmount', params.trnAmount, {"style":"form"});
      rb.query('paymentMethod', params.paymentMethod, {"style":"form"});
      rb.query('trnDate', params.trnDate, {"style":"form"});
      rb.query('ref1', params.ref1, {"style":"form"});
      rb.query('ref2', params.ref2, {"style":"form"});
      rb.query('ref3', params.ref3, {"style":"form"});
      rb.query('pbcTxnNumber', params.pbcTxnNumber, {"style":"form"});
      rb.query('trnNumber', params.trnNumber, {"style":"form"});
      rb.query('hashValue', params.hashValue, {"style":"form"});
      rb.query('pbcRefNumber', params.pbcRefNumber, {"style":"form"});
      rb.query('glDate', params.glDate, {"style":"form"});
      rb.query('paymentAuthCode', params.paymentAuthCode, {"style":"form"});
      rb.query('revenue', params.revenue, {"style":"form"});
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
      rb.path('paymentId', params.paymentId, {"style":"simple"});
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
   * Get the payment result for application and payment.
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
      rb.path('applicationId', params.applicationId, {"style":"simple"});
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
   * Get the payment result for application and payment.
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
      rb.path('applicationId', params.applicationId, {"style":"simple"});
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
      rb.path('applicationId', params.applicationId, {"style":"simple"});
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

}
