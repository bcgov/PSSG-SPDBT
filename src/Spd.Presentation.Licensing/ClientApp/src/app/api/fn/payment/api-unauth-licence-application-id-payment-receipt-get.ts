/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';


export interface ApiUnauthLicenceApplicationIdPaymentReceiptGet$Params {
  applicationId: string;
}

export function apiUnauthLicenceApplicationIdPaymentReceiptGet(http: HttpClient, rootUrl: string, params: ApiUnauthLicenceApplicationIdPaymentReceiptGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Blob>> {
  const rb = new RequestBuilder(rootUrl, apiUnauthLicenceApplicationIdPaymentReceiptGet.PATH, 'get');
  if (params) {
    rb.path('applicationId', params.applicationId, {});
  }

  return http.request(
    rb.build({ responseType: 'blob', accept: 'application/pdf', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Blob>;
    })
  );
}

apiUnauthLicenceApplicationIdPaymentReceiptGet.PATH = '/api/unauth-licence/{applicationId}/payment-receipt';
