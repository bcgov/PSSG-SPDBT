/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { GdsdTeamAppCommandResponse } from '../../models/gdsd-team-app-command-response';
import { GdsdTeamLicenceAppUpsertRequest } from '../../models/gdsd-team-licence-app-upsert-request';

export interface ApiGdsdTeamAppSubmitPost$Params {
      body: GdsdTeamLicenceAppUpsertRequest
}

export function apiGdsdTeamAppSubmitPost(http: HttpClient, rootUrl: string, params: ApiGdsdTeamAppSubmitPost$Params, context?: HttpContext): Observable<StrictHttpResponse<GdsdTeamAppCommandResponse>> {
  const rb = new RequestBuilder(rootUrl, apiGdsdTeamAppSubmitPost.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/*+json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<GdsdTeamAppCommandResponse>;
    })
  );
}

apiGdsdTeamAppSubmitPost.PATH = '/api/gdsd-team-app/submit';
