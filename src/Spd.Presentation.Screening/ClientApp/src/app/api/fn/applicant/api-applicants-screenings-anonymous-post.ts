/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { AnonymousApplicantAppCreateRequest } from '../../models/anonymous-applicant-app-create-request';
import { ApplicationCreateResponse } from '../../models/application-create-response';

export interface ApiApplicantsScreeningsAnonymousPost$Params {
      body?: AnonymousApplicantAppCreateRequest
}

export function apiApplicantsScreeningsAnonymousPost(http: HttpClient, rootUrl: string, params?: ApiApplicantsScreeningsAnonymousPost$Params, context?: HttpContext): Observable<StrictHttpResponse<ApplicationCreateResponse>> {
  const rb = new RequestBuilder(rootUrl, apiApplicantsScreeningsAnonymousPost.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/*+json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<ApplicationCreateResponse>;
    })
  );
}

apiApplicantsScreeningsAnonymousPost.PATH = '/api/applicants/screenings/anonymous';
