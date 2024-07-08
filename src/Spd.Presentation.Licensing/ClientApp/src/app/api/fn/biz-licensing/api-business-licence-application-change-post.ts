/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { BizLicAppCommandResponse } from '../../models/biz-lic-app-command-response';
import { BizLicAppSubmitRequest } from '../../models/biz-lic-app-submit-request';

export interface ApiBusinessLicenceApplicationChangePost$Params {
  
    /**
     * BizLicAppSubmitRequest data
     */
    body?: BizLicAppSubmitRequest
}

export function apiBusinessLicenceApplicationChangePost(http: HttpClient, rootUrl: string, params?: ApiBusinessLicenceApplicationChangePost$Params, context?: HttpContext): Observable<StrictHttpResponse<BizLicAppCommandResponse>> {
  const rb = new RequestBuilder(rootUrl, apiBusinessLicenceApplicationChangePost.PATH, 'post');
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

apiBusinessLicenceApplicationChangePost.PATH = '/api/business-licence-application/change';
