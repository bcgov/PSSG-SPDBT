/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { DogTrainerAppCommandResponse } from '../../models/dog-trainer-app-command-response';
import { DogTrainerChangeRequest } from '../../models/dog-trainer-change-request';

export interface ApiDogTrainerAppAnonymousChangePost$Params {
  
    /**
     * DogTrainerChangeRequest data
     */
    body?: DogTrainerChangeRequest
}

export function apiDogTrainerAppAnonymousChangePost(http: HttpClient, rootUrl: string, params?: ApiDogTrainerAppAnonymousChangePost$Params, context?: HttpContext): Observable<StrictHttpResponse<DogTrainerAppCommandResponse>> {
  const rb = new RequestBuilder(rootUrl, apiDogTrainerAppAnonymousChangePost.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/*+json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<DogTrainerAppCommandResponse>;
    })
  );
}

apiDogTrainerAppAnonymousChangePost.PATH = '/api/dog-trainer-app/anonymous/change';
