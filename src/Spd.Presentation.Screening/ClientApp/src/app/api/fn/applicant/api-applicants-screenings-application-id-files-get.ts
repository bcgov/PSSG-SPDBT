/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ApplicantApplicationFileListResponse } from '../../models/applicant-application-file-list-response';

export interface ApiApplicantsScreeningsApplicationIdFilesGet$Params {
  applicationId: string;
}

export function apiApplicantsScreeningsApplicationIdFilesGet(http: HttpClient, rootUrl: string, params: ApiApplicantsScreeningsApplicationIdFilesGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ApplicantApplicationFileListResponse>> {
  const rb = new RequestBuilder(rootUrl, apiApplicantsScreeningsApplicationIdFilesGet.PATH, 'get');
  if (params) {
    rb.path('applicationId', params.applicationId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<ApplicantApplicationFileListResponse>;
    })
  );
}

apiApplicantsScreeningsApplicationIdFilesGet.PATH = '/api/applicants/screenings/{applicationId}/files';
