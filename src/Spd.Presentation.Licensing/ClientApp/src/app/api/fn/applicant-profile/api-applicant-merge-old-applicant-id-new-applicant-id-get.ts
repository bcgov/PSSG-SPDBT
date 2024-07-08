/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { IActionResult } from '../../models/i-action-result';

export interface ApiApplicantMergeOldApplicantIdNewApplicantIdGet$Params {
  oldApplicantId: string;
  newApplicantId: string;
}

export function apiApplicantMergeOldApplicantIdNewApplicantIdGet(http: HttpClient, rootUrl: string, params: ApiApplicantMergeOldApplicantIdNewApplicantIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<IActionResult>> {
  const rb = new RequestBuilder(rootUrl, apiApplicantMergeOldApplicantIdNewApplicantIdGet.PATH, 'get');
  if (params) {
    rb.path('oldApplicantId', params.oldApplicantId, {});
    rb.path('newApplicantId', params.newApplicantId, {});
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

apiApplicantMergeOldApplicantIdNewApplicantIdGet.PATH = '/api/applicant/merge/{oldApplicantId}/{newApplicantId}';
