/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ApplicationInvitesCreateRequest } from '../../models/application-invites-create-request';
import { ApplicationInvitesCreateResponse } from '../../models/application-invites-create-response';

export interface ApiOrgsOrgIdApplicationInvitesPost$Params {

/**
 * organizationId, for PSSO, it should be BC Gov hard coded id.
 */
  orgId: string;
      body: ApplicationInvitesCreateRequest
}

export function apiOrgsOrgIdApplicationInvitesPost(http: HttpClient, rootUrl: string, params: ApiOrgsOrgIdApplicationInvitesPost$Params, context?: HttpContext): Observable<StrictHttpResponse<ApplicationInvitesCreateResponse>> {
  const rb = new RequestBuilder(rootUrl, apiOrgsOrgIdApplicationInvitesPost.PATH, 'post');
  if (params) {
    rb.path('orgId', params.orgId, {});
    rb.body(params.body, 'application/*+json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<ApplicationInvitesCreateResponse>;
    })
  );
}

apiOrgsOrgIdApplicationInvitesPost.PATH = '/api/orgs/{orgId}/application-invites';
