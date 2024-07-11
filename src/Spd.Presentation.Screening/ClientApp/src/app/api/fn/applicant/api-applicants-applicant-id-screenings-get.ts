/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ApplicantApplicationListResponse } from '../../models/applicant-application-list-response';

export interface ApiApplicantsApplicantIdScreeningsGet$Params {
  applicantId: string;
}

export function apiApplicantsApplicantIdScreeningsGet(http: HttpClient, rootUrl: string, params: ApiApplicantsApplicantIdScreeningsGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ApplicantApplicationListResponse>> {
  const rb = new RequestBuilder(rootUrl, apiApplicantsApplicantIdScreeningsGet.PATH, 'get');
  if (params) {
    rb.path('applicantId', params.applicantId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<ApplicantApplicationListResponse>;
    })
  );
}

apiApplicantsApplicantIdScreeningsGet.PATH = '/api/applicants/{applicantId}/screenings';
