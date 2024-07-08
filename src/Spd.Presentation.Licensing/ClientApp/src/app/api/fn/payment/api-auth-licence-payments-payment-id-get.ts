/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { PaymentResponse } from '../../models/payment-response';

export interface ApiAuthLicencePaymentsPaymentIdGet$Params {
  paymentId: string;
}

export function apiAuthLicencePaymentsPaymentIdGet(http: HttpClient, rootUrl: string, params: ApiAuthLicencePaymentsPaymentIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<PaymentResponse>> {
  const rb = new RequestBuilder(rootUrl, apiAuthLicencePaymentsPaymentIdGet.PATH, 'get');
  if (params) {
    rb.path('paymentId', params.paymentId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<PaymentResponse>;
    })
  );
}

apiAuthLicencePaymentsPaymentIdGet.PATH = '/api/auth-licence/payments/{paymentId}';
