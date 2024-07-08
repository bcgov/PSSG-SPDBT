/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { LicenceAppListResponse } from '../../models/licence-app-list-response';

export interface ApiBizsBizIdLicenceApplicationsGet$Params {
  bizId: string;
}

export function apiBizsBizIdLicenceApplicationsGet(http: HttpClient, rootUrl: string, params: ApiBizsBizIdLicenceApplicationsGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<LicenceAppListResponse>>> {
  const rb = new RequestBuilder(rootUrl, apiBizsBizIdLicenceApplicationsGet.PATH, 'get');
  if (params) {
    rb.path('bizId', params.bizId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<LicenceAppListResponse>>;
    })
  );
}

apiBizsBizIdLicenceApplicationsGet.PATH = '/api/bizs/{bizId}/licence-applications';
