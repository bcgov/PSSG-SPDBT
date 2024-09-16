/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ControllingMemberCrcAppResponse } from '../../models/controlling-member-crc-app-response';

export interface ApiControllingMemberCrcApplicationsOriginalAppIdGet$Params {
  originalAppId: string;
}

export function apiControllingMemberCrcApplicationsOriginalAppIdGet(http: HttpClient, rootUrl: string, params: ApiControllingMemberCrcApplicationsOriginalAppIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ControllingMemberCrcAppResponse>> {
  const rb = new RequestBuilder(rootUrl, apiControllingMemberCrcApplicationsOriginalAppIdGet.PATH, 'get');
  if (params) {
    rb.path('originalAppId', params.originalAppId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<ControllingMemberCrcAppResponse>;
    })
  );
}

apiControllingMemberCrcApplicationsOriginalAppIdGet.PATH = '/api/controlling-member-crc-applications/{originalAppId}';
