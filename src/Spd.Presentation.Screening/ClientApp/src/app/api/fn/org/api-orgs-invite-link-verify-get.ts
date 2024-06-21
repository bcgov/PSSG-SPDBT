/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { OrgInviteVerifyResponse } from '../../models/org-invite-verify-response';

export interface ApiOrgsInviteLinkVerifyGet$Params {
  encodedOrgId?: string;
}

export function apiOrgsInviteLinkVerifyGet(http: HttpClient, rootUrl: string, params?: ApiOrgsInviteLinkVerifyGet$Params, context?: HttpContext): Observable<StrictHttpResponse<OrgInviteVerifyResponse>> {
  const rb = new RequestBuilder(rootUrl, apiOrgsInviteLinkVerifyGet.PATH, 'get');
  if (params) {
    rb.query('encodedOrgId', params.encodedOrgId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<OrgInviteVerifyResponse>;
    })
  );
}

apiOrgsInviteLinkVerifyGet.PATH = '/api/orgs/invite-link-verify';
