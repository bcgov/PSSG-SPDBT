/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { LicenceAppListResponse } from '../../models/licence-app-list-response';

export interface ApiApplicantsApplicantIdLicenceApplicationsGet$Params {
  applicantId: string;
}

export function apiApplicantsApplicantIdLicenceApplicationsGet(http: HttpClient, rootUrl: string, params: ApiApplicantsApplicantIdLicenceApplicationsGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<LicenceAppListResponse>>> {
  const rb = new RequestBuilder(rootUrl, apiApplicantsApplicantIdLicenceApplicationsGet.PATH, 'get');
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

apiApplicantsApplicantIdLicenceApplicationsGet.PATH = '/api/applicants/{applicantId}/licence-applications';
