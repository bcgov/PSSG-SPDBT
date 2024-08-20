/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ControllingMemberCrcAppCommandResponse } from '../../models/controlling-member-crc-app-command-response';
import { ControllingMemberCrcAppSubmitRequest } from '../../models/controlling-member-crc-app-submit-request';

export interface ApiControllingMemberCrcApplicationsAnonymousSubmitPost$Params {
      body: ControllingMemberCrcAppSubmitRequest
}

export function apiControllingMemberCrcApplicationsAnonymousSubmitPost(http: HttpClient, rootUrl: string, params: ApiControllingMemberCrcApplicationsAnonymousSubmitPost$Params, context?: HttpContext): Observable<StrictHttpResponse<ControllingMemberCrcAppCommandResponse>> {
  const rb = new RequestBuilder(rootUrl, apiControllingMemberCrcApplicationsAnonymousSubmitPost.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/*+json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<ControllingMemberCrcAppCommandResponse>;
    })
  );
}

apiControllingMemberCrcApplicationsAnonymousSubmitPost.PATH = '/api/controlling-member-crc-applications/anonymous/submit';
