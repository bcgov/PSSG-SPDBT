/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { LicenceAppListResponse } from '../../models/licence-app-list-response';

export interface ApiApplicantsApplicantIdDogCertificationApplicationsGet$Params {
  applicantId: string;
}

export function apiApplicantsApplicantIdDogCertificationApplicationsGet(http: HttpClient, rootUrl: string, params: ApiApplicantsApplicantIdDogCertificationApplicationsGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<LicenceAppListResponse>>> {
  const rb = new RequestBuilder(rootUrl, apiApplicantsApplicantIdDogCertificationApplicationsGet.PATH, 'get');
  if (params) {
    rb.path('applicantId', params.applicantId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<LicenceAppListResponse>>;
    })
  );
}

apiApplicantsApplicantIdDogCertificationApplicationsGet.PATH = '/api/applicants/{applicantId}/dog-certification-applications';
