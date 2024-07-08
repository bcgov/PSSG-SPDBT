/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { WorkerLicenceAppResponse } from '../../models/worker-licence-app-response';

export interface ApiApplicantsApplicantIdSwlLatestGet$Params {
  applicantId: string;
}

export function apiApplicantsApplicantIdSwlLatestGet(http: HttpClient, rootUrl: string, params: ApiApplicantsApplicantIdSwlLatestGet$Params, context?: HttpContext): Observable<StrictHttpResponse<WorkerLicenceAppResponse>> {
  const rb = new RequestBuilder(rootUrl, apiApplicantsApplicantIdSwlLatestGet.PATH, 'get');
  if (params) {
    rb.path('applicantId', params.applicantId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<WorkerLicenceAppResponse>;
    })
  );
}

apiApplicantsApplicantIdSwlLatestGet.PATH = '/api/applicants/{applicantId}/swl-latest';
