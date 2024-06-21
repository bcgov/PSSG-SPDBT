/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';


export interface ApiOrgsOrgIdApplicationsApplicationIdPaymentReceiptGet$Params {
  applicationId: string;
  orgId: string;
}

export function apiOrgsOrgIdApplicationsApplicationIdPaymentReceiptGet(http: HttpClient, rootUrl: string, params: ApiOrgsOrgIdApplicationsApplicationIdPaymentReceiptGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Blob>> {
  const rb = new RequestBuilder(rootUrl, apiOrgsOrgIdApplicationsApplicationIdPaymentReceiptGet.PATH, 'get');
  if (params) {
    rb.path('applicationId', params.applicationId, {});
    rb.path('orgId', params.orgId, {});
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

apiOrgsOrgIdApplicationsApplicationIdPaymentReceiptGet.PATH = '/api/orgs/{orgId}/applications/{applicationId}/payment-receipt';
