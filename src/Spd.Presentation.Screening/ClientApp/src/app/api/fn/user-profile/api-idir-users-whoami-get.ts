/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { IdirUserProfileResponse } from '../../models/idir-user-profile-response';

export interface ApiIdirUsersWhoamiGet$Params {
}

export function apiIdirUsersWhoamiGet(http: HttpClient, rootUrl: string, params?: ApiIdirUsersWhoamiGet$Params, context?: HttpContext): Observable<StrictHttpResponse<IdirUserProfileResponse>> {
  const rb = new RequestBuilder(rootUrl, apiIdirUsersWhoamiGet.PATH, 'get');
  if (params) {
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<IdirUserProfileResponse>;
    })
  );
}

apiIdirUsersWhoamiGet.PATH = '/api/idir-users/whoami';
