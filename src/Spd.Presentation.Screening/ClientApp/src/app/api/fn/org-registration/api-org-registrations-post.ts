/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { OrgRegistrationCreateRequest } from '../../models/org-registration-create-request';
import { OrgRegistrationCreateResponse } from '../../models/org-registration-create-response';

export interface ApiOrgRegistrationsPost$Params {
      body: OrgRegistrationCreateRequest
}

export function apiOrgRegistrationsPost(http: HttpClient, rootUrl: string, params: ApiOrgRegistrationsPost$Params, context?: HttpContext): Observable<StrictHttpResponse<OrgRegistrationCreateResponse>> {
  const rb = new RequestBuilder(rootUrl, apiOrgRegistrationsPost.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/*+json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<OrgRegistrationCreateResponse>;
    })
  );
}

apiOrgRegistrationsPost.PATH = '/api/org-registrations';
