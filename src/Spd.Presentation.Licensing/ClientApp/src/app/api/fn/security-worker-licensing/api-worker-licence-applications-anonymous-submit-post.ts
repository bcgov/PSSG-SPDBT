/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { WorkerLicenceAppSubmitRequest } from '../../models/worker-licence-app-submit-request';
import { WorkerLicenceCommandResponse } from '../../models/worker-licence-command-response';

export interface ApiWorkerLicenceApplicationsAnonymousSubmitPost$Params {
  
    /**
     * WorkerLicenceAppAnonymousSubmitRequestJson data
     */
    body?: WorkerLicenceAppSubmitRequest
}

export function apiWorkerLicenceApplicationsAnonymousSubmitPost(http: HttpClient, rootUrl: string, params?: ApiWorkerLicenceApplicationsAnonymousSubmitPost$Params, context?: HttpContext): Observable<StrictHttpResponse<WorkerLicenceCommandResponse>> {
  const rb = new RequestBuilder(rootUrl, apiWorkerLicenceApplicationsAnonymousSubmitPost.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/*+json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<WorkerLicenceCommandResponse>;
    })
  );
}

apiWorkerLicenceApplicationsAnonymousSubmitPost.PATH = '/api/worker-licence-applications/anonymous/submit';
