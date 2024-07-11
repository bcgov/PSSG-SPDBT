/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ApplicantAppFileCreateResponse } from '../../models/applicant-app-file-create-response';
import { FileTypeCode } from '../../models/file-type-code';

export interface ApiApplicantsScreeningsApplicationIdFilesPost$Params {
  applicationId: string;
      body?: {
'Files'?: Array<Blob>;
'FileType'?: FileTypeCode;
}
}

export function apiApplicantsScreeningsApplicationIdFilesPost(http: HttpClient, rootUrl: string, params: ApiApplicantsScreeningsApplicationIdFilesPost$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<ApplicantAppFileCreateResponse>>> {
  const rb = new RequestBuilder(rootUrl, apiApplicantsScreeningsApplicationIdFilesPost.PATH, 'post');
  if (params) {
    rb.path('applicationId', params.applicationId, {});
    rb.body(params.body, 'multipart/form-data');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<ApplicantAppFileCreateResponse>>;
    })
  );
}

apiApplicantsScreeningsApplicationIdFilesPost.PATH = '/api/applicants/screenings/{applicationId}/files';
