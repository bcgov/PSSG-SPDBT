/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { BizLicAppResponse } from '../../models/biz-lic-app-response';

export interface ApiBusinessLicenceApplicationLicenceAppIdGet$Params {
  licenceAppId: string;
}

export function apiBusinessLicenceApplicationLicenceAppIdGet(http: HttpClient, rootUrl: string, params: ApiBusinessLicenceApplicationLicenceAppIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<BizLicAppResponse>> {
  const rb = new RequestBuilder(rootUrl, apiBusinessLicenceApplicationLicenceAppIdGet.PATH, 'get');
  if (params) {
    rb.path('licenceAppId', params.licenceAppId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<BizLicAppResponse>;
    })
  );
}

apiBusinessLicenceApplicationLicenceAppIdGet.PATH = '/api/business-licence-application/{licenceAppId}';
