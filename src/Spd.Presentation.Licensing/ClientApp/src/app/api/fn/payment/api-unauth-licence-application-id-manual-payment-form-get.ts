/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';


export interface ApiUnauthLicenceApplicationIdManualPaymentFormGet$Params {
  applicationId: string;
}

export function apiUnauthLicenceApplicationIdManualPaymentFormGet(http: HttpClient, rootUrl: string, params: ApiUnauthLicenceApplicationIdManualPaymentFormGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Blob>> {
  const rb = new RequestBuilder(rootUrl, apiUnauthLicenceApplicationIdManualPaymentFormGet.PATH, 'get');
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

apiUnauthLicenceApplicationIdManualPaymentFormGet.PATH = '/api/unauth-licence/{applicationId}/manual-payment-form';
