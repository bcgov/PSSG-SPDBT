/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { LicenceBasicResponse } from '../../models/licence-basic-response';

export interface ApiBizsBizIdLicencesGet$Params {
  bizId: string;
}

export function apiBizsBizIdLicencesGet(http: HttpClient, rootUrl: string, params: ApiBizsBizIdLicencesGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<LicenceBasicResponse>>> {
  const rb = new RequestBuilder(rootUrl, apiBizsBizIdLicencesGet.PATH, 'get');
  if (params) {
    rb.path('bizId', params.bizId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<LicenceBasicResponse>>;
    })
  );
}

apiBizsBizIdLicencesGet.PATH = '/api/bizs/{bizId}/licences';
