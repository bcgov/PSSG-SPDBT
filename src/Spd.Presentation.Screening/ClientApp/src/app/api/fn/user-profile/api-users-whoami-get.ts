/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { OrgUserProfileResponse } from '../../models/org-user-profile-response';

export interface ApiUsersWhoamiGet$Params {
}

export function apiUsersWhoamiGet(http: HttpClient, rootUrl: string, params?: ApiUsersWhoamiGet$Params, context?: HttpContext): Observable<StrictHttpResponse<OrgUserProfileResponse>> {
  const rb = new RequestBuilder(rootUrl, apiUsersWhoamiGet.PATH, 'get');
  if (params) {
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<OrgUserProfileResponse>;
    })
  );
}

apiUsersWhoamiGet.PATH = '/api/users/whoami';
