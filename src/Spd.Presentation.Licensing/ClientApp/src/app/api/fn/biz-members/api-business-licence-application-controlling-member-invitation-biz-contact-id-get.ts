/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ControllingMemberInvitesCreateResponse } from '../../models/controlling-member-invites-create-response';

export interface ApiBusinessLicenceApplicationControllingMemberInvitationBizContactIdGet$Params {
  bizContactId: string;
}

export function apiBusinessLicenceApplicationControllingMemberInvitationBizContactIdGet(http: HttpClient, rootUrl: string, params: ApiBusinessLicenceApplicationControllingMemberInvitationBizContactIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ControllingMemberInvitesCreateResponse>> {
  const rb = new RequestBuilder(rootUrl, apiBusinessLicenceApplicationControllingMemberInvitationBizContactIdGet.PATH, 'get');
  if (params) {
    rb.path('bizContactId', params.bizContactId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<ControllingMemberInvitesCreateResponse>;
    })
  );
}

apiBusinessLicenceApplicationControllingMemberInvitationBizContactIdGet.PATH = '/api/business-licence-application/controlling-member-invitation/{bizContactId}';
