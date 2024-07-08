/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { PermitAppCommandResponse } from '../../models/permit-app-command-response';
import { PermitAppUpsertRequest } from '../../models/permit-app-upsert-request';

export interface ApiPermitApplicationsPost$Params {
      body: PermitAppUpsertRequest
}

export function apiPermitApplicationsPost(http: HttpClient, rootUrl: string, params: ApiPermitApplicationsPost$Params, context?: HttpContext): Observable<StrictHttpResponse<PermitAppCommandResponse>> {
  const rb = new RequestBuilder(rootUrl, apiPermitApplicationsPost.PATH, 'post');
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

apiPermitApplicationsPost.PATH = '/api/permit-applications';
