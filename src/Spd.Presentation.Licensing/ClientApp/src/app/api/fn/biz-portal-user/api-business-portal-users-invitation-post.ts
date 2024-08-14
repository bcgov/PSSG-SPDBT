/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { InvitationRequest } from '../../models/invitation-request';
import { InvitationResponse } from '../../models/invitation-response';

export interface ApiBusinessPortalUsersInvitationPost$Params {
      body: InvitationRequest
}

export function apiBusinessPortalUsersInvitationPost(http: HttpClient, rootUrl: string, params: ApiBusinessPortalUsersInvitationPost$Params, context?: HttpContext): Observable<StrictHttpResponse<InvitationResponse>> {
  const rb = new RequestBuilder(rootUrl, apiBusinessPortalUsersInvitationPost.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/*+json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<InvitationResponse>;
    })
  );
}

apiBusinessPortalUsersInvitationPost.PATH = '/api/business/portal-users/invitation';
