/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { PermitAppCommandResponse } from '../../models/permit-app-command-response';
import { PermitAppSubmitRequest } from '../../models/permit-app-submit-request';

export interface ApiPermitApplicationsAuthenticatedSubmitPost$Params {
  
    /**
     * WorkerLicenceAppAnonymousSubmitRequestJson data
     */
    body?: PermitAppSubmitRequest
}

export function apiPermitApplicationsAuthenticatedSubmitPost(http: HttpClient, rootUrl: string, params?: ApiPermitApplicationsAuthenticatedSubmitPost$Params, context?: HttpContext): Observable<StrictHttpResponse<PermitAppCommandResponse>> {
  const rb = new RequestBuilder(rootUrl, apiPermitApplicationsAuthenticatedSubmitPost.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/*+json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<PermitAppCommandResponse>;
    })
  );
}

apiPermitApplicationsAuthenticatedSubmitPost.PATH = '/api/permit-applications/authenticated/submit';
