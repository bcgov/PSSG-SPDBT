/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';


export interface ApiApplicantsScreeningsApplicationIdPaymentAttemptsGet$Params {
  applicationId: string;
}

export function apiApplicantsScreeningsApplicationIdPaymentAttemptsGet(http: HttpClient, rootUrl: string, params: ApiApplicantsScreeningsApplicationIdPaymentAttemptsGet$Params, context?: HttpContext): Observable<StrictHttpResponse<number>> {
  const rb = new RequestBuilder(rootUrl, apiApplicantsScreeningsApplicationIdPaymentAttemptsGet.PATH, 'get');
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

apiApplicantsScreeningsApplicationIdPaymentAttemptsGet.PATH = '/api/applicants/screenings/{applicationId}/payment-attempts';