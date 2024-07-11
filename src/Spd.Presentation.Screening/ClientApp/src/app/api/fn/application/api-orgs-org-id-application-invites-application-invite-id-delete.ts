/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ActionResult } from '../../models/action-result';

export interface ApiOrgsOrgIdApplicationInvitesApplicationInviteIdDelete$Params {
  applicationInviteId: string;
  orgId: string;
}

export function apiOrgsOrgIdApplicationInvitesApplicationInviteIdDelete(http: HttpClient, rootUrl: string, params: ApiOrgsOrgIdApplicationInvitesApplicationInviteIdDelete$Params, context?: HttpContext): Observable<StrictHttpResponse<ActionResult>> {
  const rb = new RequestBuilder(rootUrl, apiOrgsOrgIdApplicationInvitesApplicationInviteIdDelete.PATH, 'delete');
  if (params) {
    rb.path('applicationInviteId', params.applicationInviteId, {});
    rb.path('orgId', params.orgId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<ActionResult>;
    })
  );
}

apiOrgsOrgIdApplicationInvitesApplicationInviteIdDelete.PATH = '/api/orgs/{orgId}/application-invites/{applicationInviteId}';
