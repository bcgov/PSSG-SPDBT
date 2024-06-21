/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ActionResult } from '../../models/action-result';

export interface ApiOrgsOrgIdApplicationApplicationIdDelegateDelegateIdDelete$Params {
  delegateId: string;
  applicationId: string;
  orgId: string;
}

export function apiOrgsOrgIdApplicationApplicationIdDelegateDelegateIdDelete(http: HttpClient, rootUrl: string, params: ApiOrgsOrgIdApplicationApplicationIdDelegateDelegateIdDelete$Params, context?: HttpContext): Observable<StrictHttpResponse<ActionResult>> {
  const rb = new RequestBuilder(rootUrl, apiOrgsOrgIdApplicationApplicationIdDelegateDelegateIdDelete.PATH, 'delete');
  if (params) {
    rb.path('delegateId', params.delegateId, {});
    rb.path('applicationId', params.applicationId, {});
    rb.path('orgId', params.orgId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<ActionResult>;
    })
  );
}

apiOrgsOrgIdApplicationApplicationIdDelegateDelegateIdDelete.PATH = '/api/orgs/{orgId}/application/{applicationId}/delegate/{delegateId}';
