/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { PermitLicenceAppResponse } from '../../models/permit-licence-app-response';

export interface ApiPermitApplicationGet$Params {
}

export function apiPermitApplicationGet(http: HttpClient, rootUrl: string, params?: ApiPermitApplicationGet$Params, context?: HttpContext): Observable<StrictHttpResponse<PermitLicenceAppResponse>> {
  const rb = new RequestBuilder(rootUrl, apiPermitApplicationGet.PATH, 'get');
  if (params) {
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

apiPermitApplicationGet.PATH = '/api/permit-application';
