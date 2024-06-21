/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { OrgResponse } from '../../models/org-response';

export interface ApiOrgsOrgIdGet$Params {
  orgId: string;
}

export function apiOrgsOrgIdGet(http: HttpClient, rootUrl: string, params: ApiOrgsOrgIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<OrgResponse>> {
  const rb = new RequestBuilder(rootUrl, apiOrgsOrgIdGet.PATH, 'get');
  if (params) {
    rb.path('orgId', params.orgId, {});
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

apiOrgsOrgIdGet.PATH = '/api/orgs/{orgId}';
