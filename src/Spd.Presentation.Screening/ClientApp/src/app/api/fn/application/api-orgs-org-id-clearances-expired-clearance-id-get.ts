/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ApplicationInvitePrepopulateDataResponse } from '../../models/application-invite-prepopulate-data-response';

export interface ApiOrgsOrgIdClearancesExpiredClearanceIdGet$Params {
  orgId: string;
  clearanceId: string;
}

export function apiOrgsOrgIdClearancesExpiredClearanceIdGet(http: HttpClient, rootUrl: string, params: ApiOrgsOrgIdClearancesExpiredClearanceIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ApplicationInvitePrepopulateDataResponse>> {
  const rb = new RequestBuilder(rootUrl, apiOrgsOrgIdClearancesExpiredClearanceIdGet.PATH, 'get');
  if (params) {
    rb.path('orgId', params.orgId, {});
    rb.path('clearanceId', params.clearanceId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<ApplicationInvitePrepopulateDataResponse>;
    })
  );
}

apiOrgsOrgIdClearancesExpiredClearanceIdGet.PATH = '/api/orgs/{orgId}/clearances/expired/{clearanceId}';
