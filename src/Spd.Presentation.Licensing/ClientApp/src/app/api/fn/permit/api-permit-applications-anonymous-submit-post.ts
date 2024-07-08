/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { PermitAppCommandResponse } from '../../models/permit-app-command-response';
import { PermitAppSubmitRequest } from '../../models/permit-app-submit-request';

export interface ApiPermitApplicationsAnonymousSubmitPost$Params {
  
    /**
     * PermitAppAnonymousSubmitRequest data
     */
    body?: PermitAppSubmitRequest
}

export function apiPermitApplicationsAnonymousSubmitPost(http: HttpClient, rootUrl: string, params?: ApiPermitApplicationsAnonymousSubmitPost$Params, context?: HttpContext): Observable<StrictHttpResponse<PermitAppCommandResponse>> {
  const rb = new RequestBuilder(rootUrl, apiPermitApplicationsAnonymousSubmitPost.PATH, 'post');
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

apiPermitApplicationsAnonymousSubmitPost.PATH = '/api/permit-applications/anonymous/submit';
