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
    body: PaymentLinkCreateRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<PaymentLinkResponse>> {

    const rb = new RequestBuilder(this.rootUrl, PaymentService.ApiApplicantsScreeningsApplicationIdPaymentLinkPostPath, 'post');
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
    body: PaymentLinkCreateRequest
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

    const rb = new RequestBuilder(this.rootUrl, PaymentService.ApiApplicantsScreeningsPaymentResultGetPath, 'get');
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

    const rb = new RequestBuilder(this.rootUrl, PaymentService.ApiApplicantsScreeningsPaymentsPaymentIdGetPath, 'get');
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

  /**
   * Path part for operation apiApplicantsScreeningsApplicationIdPaymentAttemptsGet
   */
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
  apiApplicantsScreeningsApplicationIdPaymentAttemptsGet$Response(params: {
    applicationId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<number>> {

    const rb = new RequestBuilder(this.rootUrl, PaymentService.ApiApplicantsScreeningsApplicationIdPaymentAttemptsGetPath, 'get');
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
   * Get the payment result for application and payment.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiApplicantsScreeningsApplicationIdPaymentAttemptsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsScreeningsApplicationIdPaymentAttemptsGet(params: {
    applicationId: string;
  },
  context?: HttpContext

): Observable<number> {

    return this.apiApplicantsScreeningsApplicationIdPaymentAttemptsGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<number>) => r.body as number)
    );
  }

  /**
   * Path part for operation apiApplicantsScreeningsApplicationIdPaymentReceiptGet
   */
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
  apiApplicantsScreeningsApplicationIdPaymentReceiptGet$Response(params: {
    applicationId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Blob>> {

    const rb = new RequestBuilder(this.rootUrl, PaymentService.ApiApplicantsScreeningsApplicationIdPaymentReceiptGetPath, 'get');
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
   * To access the full response (for headers, for example), `apiApplicantsScreeningsApplicationIdPaymentReceiptGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsScreeningsApplicationIdPaymentReceiptGet(params: {
    applicationId: string;
  },
  context?: HttpContext

): Observable<Blob> {

    return this.apiApplicantsScreeningsApplicationIdPaymentReceiptGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<Blob>) => r.body as Blob)
    );
  }

  /**
   * Path part for operation apiOrgsOrgIdApplicationsApplicationIdPaymentLinkPost
   */
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
  apiOrgsOrgIdApplicationsApplicationIdPaymentLinkPost$Response(params: {
    orgId: string;
    applicationId: string;

    /**
     * which include Payment link create request
     */
    body: PaymentLinkCreateRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<PaymentLinkResponse>> {

    const rb = new RequestBuilder(this.rootUrl, PaymentService.ApiOrgsOrgIdApplicationsApplicationIdPaymentLinkPostPath, 'post');
    if (params) {
      rb.path('orgId', params.orgId, {});
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
   * To access the full response (for headers, for example), `apiOrgsOrgIdApplicationsApplicationIdPaymentLinkPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiOrgsOrgIdApplicationsApplicationIdPaymentLinkPost(params: {
    orgId: string;
    applicationId: string;

    /**
     * which include Payment link create request
     */
    body: PaymentLinkCreateRequest
  },
  context?: HttpContext

): Observable<PaymentLinkResponse> {

    return this.apiOrgsOrgIdApplicationsApplicationIdPaymentLinkPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<PaymentLinkResponse>) => r.body as PaymentLinkResponse)
    );
  }

  /**
   * Path part for operation apiOrgsOrgIdPaymentResultGet
   */
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
  apiOrgsOrgIdPaymentResultGet$Response(params: {
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
    orgId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ActionResult>> {

    const rb = new RequestBuilder(this.rootUrl, PaymentService.ApiOrgsOrgIdPaymentResultGetPath, 'get');
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
   * redirect url for paybc to redirect to.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdPaymentResultGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdPaymentResultGet(params: {
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
    orgId: string;
  },
  context?: HttpContext

): Observable<ActionResult> {

    return this.apiOrgsOrgIdPaymentResultGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<ActionResult>) => r.body as ActionResult)
    );
  }

  /**
   * Path part for operation apiOrgsOrgIdPaymentsPaymentIdGet
   */
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
  apiOrgsOrgIdPaymentsPaymentIdGet$Response(params: {
    paymentId: string;
    orgId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<PaymentResponse>> {

    const rb = new RequestBuilder(this.rootUrl, PaymentService.ApiOrgsOrgIdPaymentsPaymentIdGetPath, 'get');
    if (params) {
      rb.path('paymentId', params.paymentId, {});
      rb.path('orgId', params.orgId, {});
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
   * Get the payment result for org and payment.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdPaymentsPaymentIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdPaymentsPaymentIdGet(params: {
    paymentId: string;
    orgId: string;
  },
  context?: HttpContext

): Observable<PaymentResponse> {

    return this.apiOrgsOrgIdPaymentsPaymentIdGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<PaymentResponse>) => r.body as PaymentResponse)
    );
  }

  /**
   * Path part for operation apiOrgsOrgIdApplicationsApplicationIdPaymentAttemptsGet
   */
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
  apiOrgsOrgIdApplicationsApplicationIdPaymentAttemptsGet$Response(params: {
    applicationId: string;
    orgId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<number>> {

    const rb = new RequestBuilder(this.rootUrl, PaymentService.ApiOrgsOrgIdApplicationsApplicationIdPaymentAttemptsGetPath, 'get');
    if (params) {
      rb.path('applicationId', params.applicationId, {});
      rb.path('orgId', params.orgId, {});
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
   * Get failed attempts for org paid application.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdApplicationsApplicationIdPaymentAttemptsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdApplicationsApplicationIdPaymentAttemptsGet(params: {
    applicationId: string;
    orgId: string;
  },
  context?: HttpContext

): Observable<number> {

    return this.apiOrgsOrgIdApplicationsApplicationIdPaymentAttemptsGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<number>) => r.body as number)
    );
  }

  /**
   * Path part for operation apiOrgsOrgIdApplicationsApplicationIdPaymentReceiptGet
   */
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
  apiOrgsOrgIdApplicationsApplicationIdPaymentReceiptGet$Response(params: {
    applicationId: string;
    orgId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Blob>> {

    const rb = new RequestBuilder(this.rootUrl, PaymentService.ApiOrgsOrgIdApplicationsApplicationIdPaymentReceiptGetPath, 'get');
    if (params) {
      rb.path('applicationId', params.applicationId, {});
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
   * download the receipt for successful payment.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiOrgsOrgIdApplicationsApplicationIdPaymentReceiptGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiOrgsOrgIdApplicationsApplicationIdPaymentReceiptGet(params: {
    applicationId: string;
    orgId: string;
  },
  context?: HttpContext

): Observable<Blob> {

    return this.apiOrgsOrgIdApplicationsApplicationIdPaymentReceiptGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<Blob>) => r.body as Blob)
    );
  }

  /**
   * Path part for operation apiCrrpaPaymentLinkPost
   */
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
  apiCrrpaPaymentLinkPost$Response(params: {

    /**
     * which include Payment link create request
     */
    body: PaymentLinkCreateRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<PaymentLinkResponse>> {

    const rb = new RequestBuilder(this.rootUrl, PaymentService.ApiCrrpaPaymentLinkPostPath, 'post');
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
   * To access the full response (for headers, for example), `apiCrrpaPaymentLinkPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiCrrpaPaymentLinkPost(params: {

    /**
     * which include Payment link create request
     */
    body: PaymentLinkCreateRequest
  },
  context?: HttpContext

): Observable<PaymentLinkResponse> {

    return this.apiCrrpaPaymentLinkPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<PaymentLinkResponse>) => r.body as PaymentLinkResponse)
    );
  }

  /**
   * Path part for operation apiCrrpaPaymentResultGet
   */
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
  apiCrrpaPaymentResultGet$Response(params?: {
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

    const rb = new RequestBuilder(this.rootUrl, PaymentService.ApiCrrpaPaymentResultGetPath, 'get');
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
   * To access the full response (for headers, for example), `apiCrrpaPaymentResultGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiCrrpaPaymentResultGet(params?: {
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

    return this.apiCrrpaPaymentResultGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<ActionResult>) => r.body as ActionResult)
    );
  }

  /**
   * Path part for operation apiCrrpaPaymentsPaymentIdGet
   */
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
  apiCrrpaPaymentsPaymentIdGet$Response(params: {
    paymentId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<PaymentResponse>> {

    const rb = new RequestBuilder(this.rootUrl, PaymentService.ApiCrrpaPaymentsPaymentIdGetPath, 'get');
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
   * To access the full response (for headers, for example), `apiCrrpaPaymentsPaymentIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiCrrpaPaymentsPaymentIdGet(params: {
    paymentId: string;
  },
  context?: HttpContext

): Observable<PaymentResponse> {

    return this.apiCrrpaPaymentsPaymentIdGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<PaymentResponse>) => r.body as PaymentResponse)
    );
  }

  /**
   * Path part for operation apiCrrpaApplicationIdPaymentAttemptsGet
   */
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
  apiCrrpaApplicationIdPaymentAttemptsGet$Response(params: {
    applicationId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<number>> {

    const rb = new RequestBuilder(this.rootUrl, PaymentService.ApiCrrpaApplicationIdPaymentAttemptsGetPath, 'get');
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
   * Get the payment result for application and payment.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiCrrpaApplicationIdPaymentAttemptsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiCrrpaApplicationIdPaymentAttemptsGet(params: {
    applicationId: string;
  },
  context?: HttpContext

): Observable<number> {

    return this.apiCrrpaApplicationIdPaymentAttemptsGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<number>) => r.body as number)
    );
  }

  /**
   * Path part for operation apiCrrpaApplicationIdPaymentReceiptGet
   */
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
  apiCrrpaApplicationIdPaymentReceiptGet$Response(params: {
    applicationId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Blob>> {

    const rb = new RequestBuilder(this.rootUrl, PaymentService.ApiCrrpaApplicationIdPaymentReceiptGetPath, 'get');
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
   * To access the full response (for headers, for example), `apiCrrpaApplicationIdPaymentReceiptGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiCrrpaApplicationIdPaymentReceiptGet(params: {
    applicationId: string;
  },
  context?: HttpContext

): Observable<Blob> {

    return this.apiCrrpaApplicationIdPaymentReceiptGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<Blob>) => r.body as Blob)
    );
  }

  /**
   * Path part for operation apiCrrpaPaymentSecureLinkGet
   */
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
  apiCrrpaPaymentSecureLinkGet$Response(params?: {
    encodedAppId?: string;
    encodedPaymentId?: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ActionResult>> {

    const rb = new RequestBuilder(this.rootUrl, PaymentService.ApiCrrpaPaymentSecureLinkGetPath, 'get');
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
   * To access the full response (for headers, for example), `apiCrrpaPaymentSecureLinkGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiCrrpaPaymentSecureLinkGet(params?: {
    encodedAppId?: string;
    encodedPaymentId?: string;
  },
  context?: HttpContext

): Observable<ActionResult> {

    return this.apiCrrpaPaymentSecureLinkGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<ActionResult>) => r.body as ActionResult)
    );
  }

}
