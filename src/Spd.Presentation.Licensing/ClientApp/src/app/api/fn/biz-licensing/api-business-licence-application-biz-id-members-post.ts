/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ActionResult } from '../../models/action-result';
import { MembersRequest } from '../../models/members-request';

export interface ApiBusinessLicenceApplicationBizIdMembersPost$Params {
  bizId: string;
      body?: MembersRequest
}

export function apiBusinessLicenceApplicationBizIdMembersPost(http: HttpClient, rootUrl: string, params: ApiBusinessLicenceApplicationBizIdMembersPost$Params, context?: HttpContext): Observable<StrictHttpResponse<ActionResult>> {
  const rb = new RequestBuilder(rootUrl, apiBusinessLicenceApplicationBizIdMembersPost.PATH, 'post');
  if (params) {
    rb.path('bizId', params.bizId, {});
    rb.body(params.body, 'application/*+json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<ActionResult>;
    })
  );
}

apiBusinessLicenceApplicationBizIdMembersPost.PATH = '/api/business-licence-application/{bizId}/members';
