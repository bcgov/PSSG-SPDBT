/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';


export interface ApiOrgsOrgIdApplicationsApplicationIdPaymentAttemptsGet$Params {
  applicationId: string;
  orgId: string;
}

export function apiOrgsOrgIdApplicationsApplicationIdPaymentAttemptsGet(http: HttpClient, rootUrl: string, params: ApiOrgsOrgIdApplicationsApplicationIdPaymentAttemptsGet$Params, context?: HttpContext): Observable<StrictHttpResponse<number>> {
  const rb = new RequestBuilder(rootUrl, apiOrgsOrgIdApplicationsApplicationIdPaymentAttemptsGet.PATH, 'get');
  if (params) {
    rb.path('applicationId', params.applicationId, {});
    rb.path('orgId', params.orgId, {});
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

apiOrgsOrgIdApplicationsApplicationIdPaymentAttemptsGet.PATH = '/api/orgs/{orgId}/applications/{applicationId}/payment-attempts';
