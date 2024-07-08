/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { LicenceFeeListResponse } from '../../models/licence-fee-list-response';
import { WorkerLicenceTypeCode } from '../../models/worker-licence-type-code';

export interface ApiLicenceFeeGet$Params {
  workerLicenceTypeCode?: WorkerLicenceTypeCode;
}

export function apiLicenceFeeGet(http: HttpClient, rootUrl: string, params?: ApiLicenceFeeGet$Params, context?: HttpContext): Observable<StrictHttpResponse<LicenceFeeListResponse>> {
  const rb = new RequestBuilder(rootUrl, apiLicenceFeeGet.PATH, 'get');
  if (params) {
    rb.query('workerLicenceTypeCode', params.workerLicenceTypeCode, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<LicenceFeeListResponse>;
    })
  );
}

apiLicenceFeeGet.PATH = '/api/licence-fee';
