/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { LicenceResponse } from '../../models/licence-response';

export interface ApiLicencesLicenceIdGet$Params {
  licenceId: string;
}

export function apiLicencesLicenceIdGet(http: HttpClient, rootUrl: string, params: ApiLicencesLicenceIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<LicenceResponse>> {
  const rb = new RequestBuilder(rootUrl, apiLicencesLicenceIdGet.PATH, 'get');
  if (params) {
    rb.path('licenceId', params.licenceId, {});
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

apiLicencesLicenceIdGet.PATH = '/api/licences/{licenceId}';
