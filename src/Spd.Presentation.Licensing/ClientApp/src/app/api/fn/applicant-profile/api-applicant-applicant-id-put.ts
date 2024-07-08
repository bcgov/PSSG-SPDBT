/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ApplicantUpdateRequest } from '../../models/applicant-update-request';

export interface ApiApplicantApplicantIdPut$Params {
  applicantId: string;
  
    /**
     * ApplicantUpdateRequest request
     */
    body?: ApplicantUpdateRequest
}

export function apiApplicantApplicantIdPut(http: HttpClient, rootUrl: string, params: ApiApplicantApplicantIdPut$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
  const rb = new RequestBuilder(rootUrl, apiApplicantApplicantIdPut.PATH, 'put');
  if (params) {
    rb.path('applicantId', params.applicantId, {});
    rb.body(params.body, 'application/*+json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<string>;
    })
  );
}

apiApplicantApplicantIdPut.PATH = '/api/applicant/{applicantId}';
