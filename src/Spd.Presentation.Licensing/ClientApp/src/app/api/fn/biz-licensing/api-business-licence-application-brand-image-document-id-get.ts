/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';


export interface ApiBusinessLicenceApplicationBrandImageDocumentIdGet$Params {
  documentId: string;
}

export function apiBusinessLicenceApplicationBrandImageDocumentIdGet(http: HttpClient, rootUrl: string, params: ApiBusinessLicenceApplicationBrandImageDocumentIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Blob>> {
  const rb = new RequestBuilder(rootUrl, apiBusinessLicenceApplicationBrandImageDocumentIdGet.PATH, 'get');
  if (params) {
    rb.path('documentId', params.documentId, {});
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

apiBusinessLicenceApplicationBrandImageDocumentIdGet.PATH = '/api/business-licence-application/brand-image/{documentId}';
