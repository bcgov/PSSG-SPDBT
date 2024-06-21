/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { DelegateListResponse } from '../../models/delegate-list-response';

export interface ApiOrgsOrgIdApplicationApplicationIdDelegatesGet$Params {
  applicationId: string;
  orgId: string;
}

export function apiOrgsOrgIdApplicationApplicationIdDelegatesGet(http: HttpClient, rootUrl: string, params: ApiOrgsOrgIdApplicationApplicationIdDelegatesGet$Params, context?: HttpContext): Observable<StrictHttpResponse<DelegateListResponse>> {
  const rb = new RequestBuilder(rootUrl, apiOrgsOrgIdApplicationApplicationIdDelegatesGet.PATH, 'get');
  if (params) {
    rb.path('applicationId', params.applicationId, {});
    rb.path('orgId', params.orgId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<DelegateListResponse>;
    })
  );
}

apiOrgsOrgIdApplicationApplicationIdDelegatesGet.PATH = '/api/orgs/{orgId}/application/{applicationId}/delegates';
