/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { FileTemplateTypeCode } from '../../models/file-template-type-code';

export interface ApiApplicantsScreeningsApplicationIdFileTemplatesGet$Params {
  applicationId: string;
  fileTemplateType: FileTemplateTypeCode;
}

export function apiApplicantsScreeningsApplicationIdFileTemplatesGet(http: HttpClient, rootUrl: string, params: ApiApplicantsScreeningsApplicationIdFileTemplatesGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Blob>> {
  const rb = new RequestBuilder(rootUrl, apiApplicantsScreeningsApplicationIdFileTemplatesGet.PATH, 'get');
  if (params) {
    rb.path('applicationId', params.applicationId, {});
    rb.query('fileTemplateType', params.fileTemplateType, {});
  }

  return http.request(
    rb.build({ responseType: 'blob', accept: 'application/pdf', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Blob>;
    })
  );
}

apiApplicantsScreeningsApplicationIdFileTemplatesGet.PATH = '/api/applicants/screenings/{applicationId}/file-templates';
