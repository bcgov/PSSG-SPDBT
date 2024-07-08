/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { BizLicAppCommandResponse } from '../../models/biz-lic-app-command-response';
import { BizLicAppUpsertRequest } from '../../models/biz-lic-app-upsert-request';

export interface ApiBusinessLicenceApplicationSubmitPost$Params {
      body: BizLicAppUpsertRequest
}

export function apiBusinessLicenceApplicationSubmitPost(http: HttpClient, rootUrl: string, params: ApiBusinessLicenceApplicationSubmitPost$Params, context?: HttpContext): Observable<StrictHttpResponse<BizLicAppCommandResponse>> {
  const rb = new RequestBuilder(rootUrl, apiBusinessLicenceApplicationSubmitPost.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/*+json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<BizLicAppCommandResponse>;
    })
  );
}

apiBusinessLicenceApplicationSubmitPost.PATH = '/api/business-licence-application/submit';
