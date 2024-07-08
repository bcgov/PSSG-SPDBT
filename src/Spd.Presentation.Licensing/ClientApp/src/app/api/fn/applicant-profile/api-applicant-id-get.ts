/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ApplicantProfileResponse } from '../../models/applicant-profile-response';

export interface ApiApplicantIdGet$Params {
  id: string;
}

export function apiApplicantIdGet(http: HttpClient, rootUrl: string, params: ApiApplicantIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ApplicantProfileResponse>> {
  const rb = new RequestBuilder(rootUrl, apiApplicantIdGet.PATH, 'get');
  if (params) {
    rb.path('id', params.id, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<ApplicantProfileResponse>;
    })
  );
}

apiApplicantIdGet.PATH = '/api/applicant/{id}';
