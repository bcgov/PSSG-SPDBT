/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { PaymentResponse } from '../../models/payment-response';

export interface ApiOrgsOrgIdPaymentsPaymentIdGet$Params {
  paymentId: string;
  orgId: string;
}

export function apiOrgsOrgIdPaymentsPaymentIdGet(http: HttpClient, rootUrl: string, params: ApiOrgsOrgIdPaymentsPaymentIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<PaymentResponse>> {
  const rb = new RequestBuilder(rootUrl, apiOrgsOrgIdPaymentsPaymentIdGet.PATH, 'get');
  if (params) {
    rb.path('paymentId', params.paymentId, {});
    rb.path('orgId', params.orgId, {});
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

apiOrgsOrgIdPaymentsPaymentIdGet.PATH = '/api/orgs/{orgId}/payments/{paymentId}';
