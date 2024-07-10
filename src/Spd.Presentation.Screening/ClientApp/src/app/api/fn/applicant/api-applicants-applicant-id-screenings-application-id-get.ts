/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ApplicantApplicationResponse } from '../../models/applicant-application-response';

export interface ApiApplicantsApplicantIdScreeningsApplicationIdGet$Params {
  applicantId: string;
  applicationId: string;
}

export function apiApplicantsApplicantIdScreeningsApplicationIdGet(http: HttpClient, rootUrl: string, params: ApiApplicantsApplicantIdScreeningsApplicationIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ApplicantApplicationResponse>> {
  const rb = new RequestBuilder(rootUrl, apiApplicantsApplicantIdScreeningsApplicationIdGet.PATH, 'get');
  if (params) {
    rb.path('applicantId', params.applicantId, {});
    rb.path('applicationId', params.applicationId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<ApplicantApplicationResponse>;
    })
  );
}

apiApplicantsApplicantIdScreeningsApplicationIdGet.PATH = '/api/applicants/{applicantId}/screenings/{applicationId}';
