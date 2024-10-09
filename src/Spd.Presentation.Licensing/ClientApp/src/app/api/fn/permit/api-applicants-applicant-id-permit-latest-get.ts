/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { PermitLicenceAppResponse } from '../../models/permit-licence-app-response';
import { ServiceTypeCode } from '../../models/service-type-code';

export interface ApiApplicantsApplicantIdPermitLatestGet$Params {
  applicantId: string;
  typeCode: ServiceTypeCode;
}

export function apiApplicantsApplicantIdPermitLatestGet(http: HttpClient, rootUrl: string, params: ApiApplicantsApplicantIdPermitLatestGet$Params, context?: HttpContext): Observable<StrictHttpResponse<PermitLicenceAppResponse>> {
  const rb = new RequestBuilder(rootUrl, apiApplicantsApplicantIdPermitLatestGet.PATH, 'get');
  if (params) {
    rb.path('applicantId', params.applicantId, {});
    rb.query('typeCode', params.typeCode, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<PermitLicenceAppResponse>;
    })
  );
}

apiApplicantsApplicantIdPermitLatestGet.PATH = '/api/applicants/{applicantId}/permit-latest';
