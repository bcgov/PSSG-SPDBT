/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';


export interface ApiCrrpaApplicationIdManualPaymentFormGet$Params {
  applicationId: string;
}

export function apiCrrpaApplicationIdManualPaymentFormGet(http: HttpClient, rootUrl: string, params: ApiCrrpaApplicationIdManualPaymentFormGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Blob>> {
  const rb = new RequestBuilder(rootUrl, apiCrrpaApplicationIdManualPaymentFormGet.PATH, 'get');
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

apiCrrpaApplicationIdManualPaymentFormGet.PATH = '/api/crrpa/{applicationId}/manual-payment-form';
