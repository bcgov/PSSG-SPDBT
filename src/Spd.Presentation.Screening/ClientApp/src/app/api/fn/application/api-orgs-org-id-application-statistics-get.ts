/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ApplicationStatisticsResponse } from '../../models/application-statistics-response';

export interface ApiOrgsOrgIdApplicationStatisticsGet$Params {
  orgId: string;
}

export function apiOrgsOrgIdApplicationStatisticsGet(http: HttpClient, rootUrl: string, params: ApiOrgsOrgIdApplicationStatisticsGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ApplicationStatisticsResponse>> {
  const rb = new RequestBuilder(rootUrl, apiOrgsOrgIdApplicationStatisticsGet.PATH, 'get');
  if (params) {
    rb.path('orgId', params.orgId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<ApplicationStatisticsResponse>;
    })
  );
}

apiOrgsOrgIdApplicationStatisticsGet.PATH = '/api/orgs/{orgId}/application-statistics';
