/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { AppInviteVerifyRequest } from '../../models/app-invite-verify-request';
import { AppOrgResponse } from '../../models/app-org-response';

export interface ApiApplicantsInvitesPost$Params {
  
    /**
     * which include InviteEncryptedCode
     */
    body: AppInviteVerifyRequest
}

export function apiApplicantsInvitesPost(http: HttpClient, rootUrl: string, params: ApiApplicantsInvitesPost$Params, context?: HttpContext): Observable<StrictHttpResponse<AppOrgResponse>> {
  const rb = new RequestBuilder(rootUrl, apiApplicantsInvitesPost.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/*+json');
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

apiApplicantsInvitesPost.PATH = '/api/applicants/invites';
