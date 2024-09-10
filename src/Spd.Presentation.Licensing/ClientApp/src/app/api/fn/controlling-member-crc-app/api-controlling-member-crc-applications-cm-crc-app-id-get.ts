/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ControllingMemberCrcAppResponse } from '../../models/controlling-member-crc-app-response';

export interface ApiControllingMemberCrcApplicationsCmCrcAppIdGet$Params {
  cmCrcAppId: string;
}

export function apiControllingMemberCrcApplicationsCmCrcAppIdGet(http: HttpClient, rootUrl: string, params: ApiControllingMemberCrcApplicationsCmCrcAppIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ControllingMemberCrcAppResponse>> {
  const rb = new RequestBuilder(rootUrl, apiControllingMemberCrcApplicationsCmCrcAppIdGet.PATH, 'get');
  if (params) {
    rb.path('cmCrcAppId', params.cmCrcAppId, {});
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

apiControllingMemberCrcApplicationsCmCrcAppIdGet.PATH = '/api/controlling-member-crc-applications/{cmCrcAppId}';
