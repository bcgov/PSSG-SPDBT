/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ControllingMemberAppInviteVerifyRequest } from '../../models/controlling-member-app-invite-verify-request';
import { ControllingMemberAppInviteVerifyResponse } from '../../models/controlling-member-app-invite-verify-response';

export interface ApiControllingMembersInvitesPost$Params {
      body: ControllingMemberAppInviteVerifyRequest
}

export function apiControllingMembersInvitesPost(http: HttpClient, rootUrl: string, params: ApiControllingMembersInvitesPost$Params, context?: HttpContext): Observable<StrictHttpResponse<ControllingMemberAppInviteVerifyResponse>> {
  const rb = new RequestBuilder(rootUrl, apiControllingMembersInvitesPost.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/*+json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<ControllingMemberAppInviteVerifyResponse>;
    })
  );
}

apiControllingMembersInvitesPost.PATH = '/api/controlling-members/invites';
