/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ActionResult } from '../../models/action-result';
import { DelegateCreateRequest } from '../../models/delegate-create-request';

export interface ApiOrgsOrgIdApplicationApplicationIdDelegatePost$Params {
  applicationId: string;
  orgId: string;
      body: DelegateCreateRequest
}

export function apiOrgsOrgIdApplicationApplicationIdDelegatePost(http: HttpClient, rootUrl: string, params: ApiOrgsOrgIdApplicationApplicationIdDelegatePost$Params, context?: HttpContext): Observable<StrictHttpResponse<ActionResult>> {
  const rb = new RequestBuilder(rootUrl, apiOrgsOrgIdApplicationApplicationIdDelegatePost.PATH, 'post');
  if (params) {
    rb.path('applicationId', params.applicationId, {});
    rb.path('orgId', params.orgId, {});
    rb.body(params.body, 'application/*+json');
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

apiOrgsOrgIdApplicationApplicationIdDelegatePost.PATH = '/api/orgs/{orgId}/application/{applicationId}/delegate';
