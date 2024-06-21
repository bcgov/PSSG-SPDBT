/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ApplicationStatisticsResponse } from '../../models/application-statistics-response';

export interface ApiUsersDelegateUserIdPssoApplicationStatisticsGet$Params {
  delegateUserId: string;
}

export function apiUsersDelegateUserIdPssoApplicationStatisticsGet(http: HttpClient, rootUrl: string, params: ApiUsersDelegateUserIdPssoApplicationStatisticsGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ApplicationStatisticsResponse>> {
  const rb = new RequestBuilder(rootUrl, apiUsersDelegateUserIdPssoApplicationStatisticsGet.PATH, 'get');
  if (params) {
    rb.path('delegateUserId', params.delegateUserId, {});
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

apiUsersDelegateUserIdPssoApplicationStatisticsGet.PATH = '/api/users/{delegateUserId}/psso-application-statistics';
