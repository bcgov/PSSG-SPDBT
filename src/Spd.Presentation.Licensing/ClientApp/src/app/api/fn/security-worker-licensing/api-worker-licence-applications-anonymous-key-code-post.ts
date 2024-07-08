/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { GoogleRecaptcha } from '../../models/google-recaptcha';
import { IActionResult } from '../../models/i-action-result';

export interface ApiWorkerLicenceApplicationsAnonymousKeyCodePost$Params {
      body?: GoogleRecaptcha
}

export function apiWorkerLicenceApplicationsAnonymousKeyCodePost(http: HttpClient, rootUrl: string, params?: ApiWorkerLicenceApplicationsAnonymousKeyCodePost$Params, context?: HttpContext): Observable<StrictHttpResponse<IActionResult>> {
  const rb = new RequestBuilder(rootUrl, apiWorkerLicenceApplicationsAnonymousKeyCodePost.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/*+json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<IActionResult>;
    })
  );
}

apiWorkerLicenceApplicationsAnonymousKeyCodePost.PATH = '/api/worker-licence-applications/anonymous/keyCode';
