/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ActionResult } from '../../models/action-result';

export interface ApiLicensingPaymentSecureLinkGet$Params {
  encodedAppId?: string;
  encodedPaymentId?: string;
}

export function apiLicensingPaymentSecureLinkGet(http: HttpClient, rootUrl: string, params?: ApiLicensingPaymentSecureLinkGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ActionResult>> {
  const rb = new RequestBuilder(rootUrl, apiLicensingPaymentSecureLinkGet.PATH, 'get');
  if (params) {
    rb.query('encodedAppId', params.encodedAppId, {});
    rb.query('encodedPaymentId', params.encodedPaymentId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<ActionResult>;
    })
  );
}

apiLicensingPaymentSecureLinkGet.PATH = '/api/licensing/payment-secure-link';
