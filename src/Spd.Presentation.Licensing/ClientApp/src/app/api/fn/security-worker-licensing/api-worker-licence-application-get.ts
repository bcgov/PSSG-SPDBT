/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { WorkerLicenceAppResponse } from '../../models/worker-licence-app-response';

export interface ApiWorkerLicenceApplicationGet$Params {
}

export function apiWorkerLicenceApplicationGet(http: HttpClient, rootUrl: string, params?: ApiWorkerLicenceApplicationGet$Params, context?: HttpContext): Observable<StrictHttpResponse<WorkerLicenceAppResponse>> {
  const rb = new RequestBuilder(rootUrl, apiWorkerLicenceApplicationGet.PATH, 'get');
  if (params) {
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<WorkerLicenceAppResponse>;
    })
  );
}

apiWorkerLicenceApplicationGet.PATH = '/api/worker-licence-application';
