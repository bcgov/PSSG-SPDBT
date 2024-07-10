/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ActionResult } from '../../models/action-result';

export interface ApiOrgsOrgIdClearancesExpiredClearanceAccessIdDelete$Params {
  clearanceAccessId: string;
  orgId: string;
}

export function apiOrgsOrgIdClearancesExpiredClearanceAccessIdDelete(http: HttpClient, rootUrl: string, params: ApiOrgsOrgIdClearancesExpiredClearanceAccessIdDelete$Params, context?: HttpContext): Observable<StrictHttpResponse<ActionResult>> {
  const rb = new RequestBuilder(rootUrl, apiOrgsOrgIdClearancesExpiredClearanceAccessIdDelete.PATH, 'delete');
  if (params) {
    rb.path('clearanceAccessId', params.clearanceAccessId, {});
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

apiOrgsOrgIdClearancesExpiredClearanceAccessIdDelete.PATH = '/api/orgs/{orgId}/clearances/expired/{clearanceAccessId}';
