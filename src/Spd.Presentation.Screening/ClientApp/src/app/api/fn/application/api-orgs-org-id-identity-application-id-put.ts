/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ActionResult } from '../../models/action-result';
import { IdentityStatusCode } from '../../models/identity-status-code';

export interface ApiOrgsOrgIdIdentityApplicationIdPut$Params {
  applicationId: string;
  orgId: string;
  status?: IdentityStatusCode;
}

export function apiOrgsOrgIdIdentityApplicationIdPut(http: HttpClient, rootUrl: string, params: ApiOrgsOrgIdIdentityApplicationIdPut$Params, context?: HttpContext): Observable<StrictHttpResponse<ActionResult>> {
  const rb = new RequestBuilder(rootUrl, apiOrgsOrgIdIdentityApplicationIdPut.PATH, 'put');
  if (params) {
    rb.path('applicationId', params.applicationId, {});
    rb.path('orgId', params.orgId, {});
    rb.query('status', params.status, {});
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

apiOrgsOrgIdIdentityApplicationIdPut.PATH = '/api/orgs/{orgId}/identity/{applicationId}';
