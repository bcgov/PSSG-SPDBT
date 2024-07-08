/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { BizLicAppResponse } from '../../models/biz-lic-app-response';

export interface ApiBusinessBizIdAppLatestGet$Params {
  bizId: string;
}

export function apiBusinessBizIdAppLatestGet(http: HttpClient, rootUrl: string, params: ApiBusinessBizIdAppLatestGet$Params, context?: HttpContext): Observable<StrictHttpResponse<BizLicAppResponse>> {
  const rb = new RequestBuilder(rootUrl, apiBusinessBizIdAppLatestGet.PATH, 'get');
  if (params) {
    rb.path('bizId', params.bizId, {});
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

apiBusinessBizIdAppLatestGet.PATH = '/api/business/{bizId}/app-latest';
