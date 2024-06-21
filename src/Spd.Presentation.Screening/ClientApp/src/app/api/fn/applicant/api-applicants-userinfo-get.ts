/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ApplicantUserInfo } from '../../models/applicant-user-info';

export interface ApiApplicantsUserinfoGet$Params {
}

export function apiApplicantsUserinfoGet(http: HttpClient, rootUrl: string, params?: ApiApplicantsUserinfoGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ApplicantUserInfo>> {
  const rb = new RequestBuilder(rootUrl, apiApplicantsUserinfoGet.PATH, 'get');
  if (params) {
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<ApplicantUserInfo>;
    })
  );
}

apiApplicantsUserinfoGet.PATH = '/api/applicants/userinfo';
