/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';


export interface ApiBusinessBizIdApplicationsApplicationIdManualPaymentFormGet$Params {
  applicationId: string;
  bizId: string;
}

export function apiBusinessBizIdApplicationsApplicationIdManualPaymentFormGet(http: HttpClient, rootUrl: string, params: ApiBusinessBizIdApplicationsApplicationIdManualPaymentFormGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Blob>> {
  const rb = new RequestBuilder(rootUrl, apiBusinessBizIdApplicationsApplicationIdManualPaymentFormGet.PATH, 'get');
  if (params) {
    rb.path('applicationId', params.applicationId, {});
    rb.path('bizId', params.bizId, {});
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

apiBusinessBizIdApplicationsApplicationIdManualPaymentFormGet.PATH = '/api/business/{bizId}/applications/{applicationId}/manual-payment-form';
