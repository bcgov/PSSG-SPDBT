/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { RetiredDogAppCommandResponse } from '../../models/retired-dog-app-command-response';
import { RetiredDogLicenceAppChangeRequest } from '../../models/retired-dog-licence-app-change-request';

export interface ApiRetiredDogAppChangePost$Params {
  
    /**
     * RetiredDogLicenceAppChangeRequest data
     */
    body?: RetiredDogLicenceAppChangeRequest
}

export function apiRetiredDogAppChangePost(http: HttpClient, rootUrl: string, params?: ApiRetiredDogAppChangePost$Params, context?: HttpContext): Observable<StrictHttpResponse<RetiredDogAppCommandResponse>> {
  const rb = new RequestBuilder(rootUrl, apiRetiredDogAppChangePost.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/*+json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<RetiredDogAppCommandResponse>;
    })
  );
}

apiRetiredDogAppChangePost.PATH = '/api/retired-dog-app/change';
