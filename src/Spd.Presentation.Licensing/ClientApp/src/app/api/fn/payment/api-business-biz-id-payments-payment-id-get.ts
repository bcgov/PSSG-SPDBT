/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { PaymentResponse } from '../../models/payment-response';

export interface ApiBusinessBizIdPaymentsPaymentIdGet$Params {
  paymentId: string;
  bizId: string;
}

export function apiBusinessBizIdPaymentsPaymentIdGet(http: HttpClient, rootUrl: string, params: ApiBusinessBizIdPaymentsPaymentIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<PaymentResponse>> {
  const rb = new RequestBuilder(rootUrl, apiBusinessBizIdPaymentsPaymentIdGet.PATH, 'get');
  if (params) {
    rb.path('paymentId', params.paymentId, {});
    rb.path('bizId', params.bizId, {});
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

apiBusinessBizIdPaymentsPaymentIdGet.PATH = '/api/business/{bizId}/payments/{paymentId}';
