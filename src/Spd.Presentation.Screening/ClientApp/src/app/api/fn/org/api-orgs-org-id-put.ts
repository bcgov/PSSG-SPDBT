/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { OrgResponse } from '../../models/org-response';
import { OrgUpdateRequest } from '../../models/org-update-request';

export interface ApiOrgsOrgIdPut$Params {
  orgId: string;
      body?: OrgUpdateRequest
}

export function apiOrgsOrgIdPut(http: HttpClient, rootUrl: string, params: ApiOrgsOrgIdPut$Params, context?: HttpContext): Observable<StrictHttpResponse<OrgResponse>> {
  const rb = new RequestBuilder(rootUrl, apiOrgsOrgIdPut.PATH, 'put');
  if (params) {
    rb.path('orgId', params.orgId, {});
    rb.body(params.body, 'application/*+json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<OrgResponse>;
    })
  );
}

apiOrgsOrgIdPut.PATH = '/api/orgs/{orgId}';
