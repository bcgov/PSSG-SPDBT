/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { AppOrgResponse } from '../../models/app-org-response';

export interface ApiOrgsAccessCodeAccessCodeGet$Params {
  accessCode: string;
}

export function apiOrgsAccessCodeAccessCodeGet(http: HttpClient, rootUrl: string, params: ApiOrgsAccessCodeAccessCodeGet$Params, context?: HttpContext): Observable<StrictHttpResponse<AppOrgResponse>> {
  const rb = new RequestBuilder(rootUrl, apiOrgsAccessCodeAccessCodeGet.PATH, 'get');
  if (params) {
    rb.path('accessCode', params.accessCode, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<AppOrgResponse>;
    })
  );
}

apiOrgsAccessCodeAccessCodeGet.PATH = '/api/orgs/access-code/{accessCode}';
