/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { LicenceAppDocumentResponse } from '../../models/licence-app-document-response';
import { LicenceDocumentTypeCode } from '../../models/licence-document-type-code';

export interface ApiControllingMemberCrcApplicationsCrcAppIdFilesPost$Params {
  CrcAppId: string;
      body?: {
'Documents'?: Array<Blob>;
'LicenceDocumentTypeCode'?: LicenceDocumentTypeCode;
}
}

export function apiControllingMemberCrcApplicationsCrcAppIdFilesPost(http: HttpClient, rootUrl: string, params: ApiControllingMemberCrcApplicationsCrcAppIdFilesPost$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<LicenceAppDocumentResponse>>> {
  const rb = new RequestBuilder(rootUrl, apiControllingMemberCrcApplicationsCrcAppIdFilesPost.PATH, 'post');
  if (params) {
    rb.path('CrcAppId', params.CrcAppId, {});
    rb.body(params.body, 'multipart/form-data');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<LicenceAppDocumentResponse>>;
    })
  );
}

apiControllingMemberCrcApplicationsCrcAppIdFilesPost.PATH = '/api/controlling-member-crc-applications/{CrcAppId}/files';