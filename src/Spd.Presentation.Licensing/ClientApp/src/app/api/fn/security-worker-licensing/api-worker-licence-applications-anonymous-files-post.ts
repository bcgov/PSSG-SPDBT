/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { LicenceDocumentTypeCode } from '../../models/licence-document-type-code';

export interface ApiWorkerLicenceApplicationsAnonymousFilesPost$Params {
      body?: {
'Documents'?: Array<Blob>;
'LicenceDocumentTypeCode'?: LicenceDocumentTypeCode;
}
}

export function apiWorkerLicenceApplicationsAnonymousFilesPost(http: HttpClient, rootUrl: string, params?: ApiWorkerLicenceApplicationsAnonymousFilesPost$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
  const rb = new RequestBuilder(rootUrl, apiWorkerLicenceApplicationsAnonymousFilesPost.PATH, 'post');
  if (params) {
    rb.body(params.body, 'multipart/form-data');
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

apiWorkerLicenceApplicationsAnonymousFilesPost.PATH = '/api/worker-licence-applications/anonymous/files';
