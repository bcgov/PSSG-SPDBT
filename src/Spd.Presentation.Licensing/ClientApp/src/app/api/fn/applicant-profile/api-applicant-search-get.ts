/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ApplicantListResponse } from '../../models/applicant-list-response';

export interface ApiApplicantSearchGet$Params {
}

export function apiApplicantSearchGet(http: HttpClient, rootUrl: string, params?: ApiApplicantSearchGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<ApplicantListResponse>>> {
  const rb = new RequestBuilder(rootUrl, apiApplicantSearchGet.PATH, 'get');
  if (params) {
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<ApplicantListResponse>>;
    })
  );
}

apiApplicantSearchGet.PATH = '/api/applicant/search';
