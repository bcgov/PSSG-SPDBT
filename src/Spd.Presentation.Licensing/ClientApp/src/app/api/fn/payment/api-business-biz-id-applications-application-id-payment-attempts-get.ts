/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';


export interface ApiBusinessBizIdApplicationsApplicationIdPaymentAttemptsGet$Params {
  applicationId: string;
  bizId: string;
}

export function apiBusinessBizIdApplicationsApplicationIdPaymentAttemptsGet(http: HttpClient, rootUrl: string, params: ApiBusinessBizIdApplicationsApplicationIdPaymentAttemptsGet$Params, context?: HttpContext): Observable<StrictHttpResponse<number>> {
  const rb = new RequestBuilder(rootUrl, apiBusinessBizIdApplicationsApplicationIdPaymentAttemptsGet.PATH, 'get');
  if (params) {
    rb.path('applicationId', params.applicationId, {});
    rb.path('bizId', params.bizId, {});
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

apiBusinessBizIdApplicationsApplicationIdPaymentAttemptsGet.PATH = '/api/business/{bizId}/applications/{applicationId}/payment-attempts';
