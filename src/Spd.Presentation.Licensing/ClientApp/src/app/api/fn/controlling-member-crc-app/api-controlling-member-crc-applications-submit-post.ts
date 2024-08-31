/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ControllingMemberCrcAppCommandResponse } from '../../models/controlling-member-crc-app-command-response';
import { ControllingMemberCrcAppUpsertRequest } from '../../models/controlling-member-crc-app-upsert-request';

export interface ApiControllingMemberCrcApplicationsSubmitPost$Params {
      body: ControllingMemberCrcAppUpsertRequest
}

export function apiControllingMemberCrcApplicationsSubmitPost(http: HttpClient, rootUrl: string, params: ApiControllingMemberCrcApplicationsSubmitPost$Params, context?: HttpContext): Observable<StrictHttpResponse<ControllingMemberCrcAppCommandResponse>> {
  const rb = new RequestBuilder(rootUrl, apiControllingMemberCrcApplicationsSubmitPost.PATH, 'post');
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

apiControllingMemberCrcApplicationsSubmitPost.PATH = '/api/controlling-member-crc-applications/submit';
