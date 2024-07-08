/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { LicenceResponse } from '../../models/licence-response';

export interface ApiLicenceLookupLicenceNumberGet$Params {
  licenceNumber: string;
  accessCode?: string;
}

export function apiLicenceLookupLicenceNumberGet(http: HttpClient, rootUrl: string, params: ApiLicenceLookupLicenceNumberGet$Params, context?: HttpContext): Observable<StrictHttpResponse<LicenceResponse>> {
  const rb = new RequestBuilder(rootUrl, apiLicenceLookupLicenceNumberGet.PATH, 'get');
  if (params) {
    rb.path('licenceNumber', params.licenceNumber, {});
    rb.query('accessCode', params.accessCode, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<LicenceResponse>;
    })
  );
}

apiLicenceLookupLicenceNumberGet.PATH = '/api/licence-lookup/{licenceNumber}';
