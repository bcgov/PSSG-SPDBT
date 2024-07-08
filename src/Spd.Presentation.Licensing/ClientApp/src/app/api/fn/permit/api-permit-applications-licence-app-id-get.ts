/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { PermitLicenceAppResponse } from '../../models/permit-licence-app-response';

export interface ApiPermitApplicationsLicenceAppIdGet$Params {
  licenceAppId: string;
}

export function apiPermitApplicationsLicenceAppIdGet(http: HttpClient, rootUrl: string, params: ApiPermitApplicationsLicenceAppIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<PermitLicenceAppResponse>> {
  const rb = new RequestBuilder(rootUrl, apiPermitApplicationsLicenceAppIdGet.PATH, 'get');
  if (params) {
    rb.path('licenceAppId', params.licenceAppId, {});
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

apiPermitApplicationsLicenceAppIdGet.PATH = '/api/permit-applications/{licenceAppId}';
