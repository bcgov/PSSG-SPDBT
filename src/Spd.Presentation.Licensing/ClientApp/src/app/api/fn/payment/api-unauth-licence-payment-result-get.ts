/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ActionResult } from '../../models/action-result';

export interface ApiUnauthLicencePaymentResultGet$Params {
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
}

export function apiUnauthLicencePaymentResultGet(http: HttpClient, rootUrl: string, params?: ApiUnauthLicencePaymentResultGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ActionResult>> {
  const rb = new RequestBuilder(rootUrl, apiUnauthLicencePaymentResultGet.PATH, 'get');
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

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<ActionResult>;
    })
  );
}

apiUnauthLicencePaymentResultGet.PATH = '/api/unauth-licence/payment-result';
