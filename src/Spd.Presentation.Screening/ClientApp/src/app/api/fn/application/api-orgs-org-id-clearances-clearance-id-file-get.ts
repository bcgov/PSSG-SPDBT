/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';


export interface ApiOrgsOrgIdClearancesClearanceIdFileGet$Params {
  clearanceId: string;
  orgId: string;
}

export function apiOrgsOrgIdClearancesClearanceIdFileGet(http: HttpClient, rootUrl: string, params: ApiOrgsOrgIdClearancesClearanceIdFileGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Blob>> {
  const rb = new RequestBuilder(rootUrl, apiOrgsOrgIdClearancesClearanceIdFileGet.PATH, 'get');
  if (params) {
    rb.path('clearanceId', params.clearanceId, {});
    rb.path('orgId', params.orgId, {});
  }

  return http.request(
    rb.build({ responseType: 'blob', accept: 'application/pdf', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Blob>;
    })
  );
}

apiOrgsOrgIdClearancesClearanceIdFileGet.PATH = '/api/orgs/{orgId}/clearances/{clearanceId}/file';
