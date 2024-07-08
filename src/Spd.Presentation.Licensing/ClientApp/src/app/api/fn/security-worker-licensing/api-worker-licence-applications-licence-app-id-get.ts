/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { WorkerLicenceAppResponse } from '../../models/worker-licence-app-response';

export interface ApiWorkerLicenceApplicationsLicenceAppIdGet$Params {
  licenceAppId: string;
}

export function apiWorkerLicenceApplicationsLicenceAppIdGet(http: HttpClient, rootUrl: string, params: ApiWorkerLicenceApplicationsLicenceAppIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<WorkerLicenceAppResponse>> {
  const rb = new RequestBuilder(rootUrl, apiWorkerLicenceApplicationsLicenceAppIdGet.PATH, 'get');
  if (params) {
    rb.path('licenceAppId', params.licenceAppId, {});
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

apiWorkerLicenceApplicationsLicenceAppIdGet.PATH = '/api/worker-licence-applications/{licenceAppId}';
