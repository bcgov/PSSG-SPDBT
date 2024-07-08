/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';


export interface ApiUnauthLicenceApplicationIdPaymentAttemptsGet$Params {
  applicationId: string;
}

export function apiUnauthLicenceApplicationIdPaymentAttemptsGet(http: HttpClient, rootUrl: string, params: ApiUnauthLicenceApplicationIdPaymentAttemptsGet$Params, context?: HttpContext): Observable<StrictHttpResponse<number>> {
  const rb = new RequestBuilder(rootUrl, apiUnauthLicenceApplicationIdPaymentAttemptsGet.PATH, 'get');
  if (params) {
    rb.path('applicationId', params.applicationId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return (r as HttpResponse<any>).clone({ body: parseFloat(String((r as HttpResponse<any>).body)) }) as StrictHttpResponse<number>;
    })
  );
}

apiUnauthLicenceApplicationIdPaymentAttemptsGet.PATH = '/api/unauth-licence/{applicationId}/payment-attempts';
