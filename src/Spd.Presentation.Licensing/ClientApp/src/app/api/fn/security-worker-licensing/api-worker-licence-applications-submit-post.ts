/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { WorkerLicenceAppUpsertRequest } from '../../models/worker-licence-app-upsert-request';
import { WorkerLicenceCommandResponse } from '../../models/worker-licence-command-response';

export interface ApiWorkerLicenceApplicationsSubmitPost$Params {
      body: WorkerLicenceAppUpsertRequest
}

export function apiWorkerLicenceApplicationsSubmitPost(http: HttpClient, rootUrl: string, params: ApiWorkerLicenceApplicationsSubmitPost$Params, context?: HttpContext): Observable<StrictHttpResponse<WorkerLicenceCommandResponse>> {
  const rb = new RequestBuilder(rootUrl, apiWorkerLicenceApplicationsSubmitPost.PATH, 'post');
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

apiWorkerLicenceApplicationsSubmitPost.PATH = '/api/worker-licence-applications/submit';
