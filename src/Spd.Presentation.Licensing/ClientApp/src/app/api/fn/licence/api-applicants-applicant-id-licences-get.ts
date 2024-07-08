/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { LicenceBasicResponse } from '../../models/licence-basic-response';

export interface ApiApplicantsApplicantIdLicencesGet$Params {
  applicantId: string;
}

export function apiApplicantsApplicantIdLicencesGet(http: HttpClient, rootUrl: string, params: ApiApplicantsApplicantIdLicencesGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<LicenceBasicResponse>>> {
  const rb = new RequestBuilder(rootUrl, apiApplicantsApplicantIdLicencesGet.PATH, 'get');
  if (params) {
    rb.path('applicantId', params.applicantId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<LicenceBasicResponse>>;
    })
  );
}

apiApplicantsApplicantIdLicencesGet.PATH = '/api/applicants/{applicantId}/licences';
