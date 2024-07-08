/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { LicenceAppDocumentResponse } from '../../models/licence-app-document-response';
import { LicenceDocumentTypeCode } from '../../models/licence-document-type-code';

export interface ApiBusinessLicenceApplicationLicenceAppIdFilesPost$Params {
  licenceAppId: string;
      body?: {
'Documents'?: Array<Blob>;
'LicenceDocumentTypeCode'?: LicenceDocumentTypeCode;
}
}

export function apiBusinessLicenceApplicationLicenceAppIdFilesPost(http: HttpClient, rootUrl: string, params: ApiBusinessLicenceApplicationLicenceAppIdFilesPost$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<LicenceAppDocumentResponse>>> {
  const rb = new RequestBuilder(rootUrl, apiBusinessLicenceApplicationLicenceAppIdFilesPost.PATH, 'post');
  if (params) {
    rb.path('licenceAppId', params.licenceAppId, {});
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

apiBusinessLicenceApplicationLicenceAppIdFilesPost.PATH = '/api/business-licence-application/{licenceAppId}/files';
