/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { OrgRegistrationPortalStatusResponse } from '../../models/org-registration-portal-status-response';

export interface ApiOrgRegistrationsRegistrationNumberStatusGet$Params {
  registrationNumber: string;
}

export function apiOrgRegistrationsRegistrationNumberStatusGet(http: HttpClient, rootUrl: string, params: ApiOrgRegistrationsRegistrationNumberStatusGet$Params, context?: HttpContext): Observable<StrictHttpResponse<OrgRegistrationPortalStatusResponse>> {
  const rb = new RequestBuilder(rootUrl, apiOrgRegistrationsRegistrationNumberStatusGet.PATH, 'get');
  if (params) {
    rb.path('registrationNumber', params.registrationNumber, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<OrgRegistrationPortalStatusResponse>;
    })
  );
}

apiOrgRegistrationsRegistrationNumberStatusGet.PATH = '/api/org-registrations/{registrationNumber}/status';
