/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { PaymentLinkCreateRequest } from '../../models/payment-link-create-request';
import { PaymentLinkResponse } from '../../models/payment-link-response';

export interface ApiUnauthLicenceApplicationIdPaymentLinkPost$Params {
  applicationId: string;
  
    /**
     * which include Payment link create request
     */
    body: PaymentLinkCreateRequest
}

export function apiUnauthLicenceApplicationIdPaymentLinkPost(http: HttpClient, rootUrl: string, params: ApiUnauthLicenceApplicationIdPaymentLinkPost$Params, context?: HttpContext): Observable<StrictHttpResponse<PaymentLinkResponse>> {
  const rb = new RequestBuilder(rootUrl, apiUnauthLicenceApplicationIdPaymentLinkPost.PATH, 'post');
  if (params) {
    rb.path('applicationId', params.applicationId, {});
    rb.body(params.body, 'application/*+json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<PaymentLinkResponse>;
    })
  );
}

apiUnauthLicenceApplicationIdPaymentLinkPost.PATH = '/api/unauth-licence/{applicationId}/payment-link';
