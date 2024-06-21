/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ServiceTypeCode } from '../../models/service-type-code';
import { ShareableClearanceResponse } from '../../models/shareable-clearance-response';

export interface ApiApplicantsClearancesShareableGet$Params {
  withOrgId?: string;
  serviceType?: ServiceTypeCode;
}

export function apiApplicantsClearancesShareableGet(http: HttpClient, rootUrl: string, params?: ApiApplicantsClearancesShareableGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ShareableClearanceResponse>> {
  const rb = new RequestBuilder(rootUrl, apiApplicantsClearancesShareableGet.PATH, 'get');
  if (params) {
    rb.query('withOrgId', params.withOrgId, {});
    rb.query('serviceType', params.serviceType, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<ShareableClearanceResponse>;
    })
  );
}

apiApplicantsClearancesShareableGet.PATH = '/api/applicants/clearances/shareable';
