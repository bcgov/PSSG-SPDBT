/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { apiControllingMemberCrcApplicationsAnonymousSubmitPost } from '../fn/controlling-member-crc-app/api-controlling-member-crc-applications-anonymous-submit-post';
import { ApiControllingMemberCrcApplicationsAnonymousSubmitPost$Params } from '../fn/controlling-member-crc-app/api-controlling-member-crc-applications-anonymous-submit-post';
import { ControllingMemberCrcAppCommandResponse } from '../models/controlling-member-crc-app-command-response';

@Injectable({ providedIn: 'root' })
export class ControllingMemberCrcAppService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `apiControllingMemberCrcApplicationsAnonymousSubmitPost()` */
  static readonly ApiControllingMemberCrcApplicationsAnonymousSubmitPostPath = '/api/controlling-member-crc-applications/anonymous/submit';

  /**
   * Save New Licence Crc Controlling Member.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiControllingMemberCrcApplicationsAnonymousSubmitPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiControllingMemberCrcApplicationsAnonymousSubmitPost$Response(params: ApiControllingMemberCrcApplicationsAnonymousSubmitPost$Params, context?: HttpContext): Observable<StrictHttpResponse<ControllingMemberCrcAppCommandResponse>> {
    return apiControllingMemberCrcApplicationsAnonymousSubmitPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Save New Licence Crc Controlling Member.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiControllingMemberCrcApplicationsAnonymousSubmitPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiControllingMemberCrcApplicationsAnonymousSubmitPost(params: ApiControllingMemberCrcApplicationsAnonymousSubmitPost$Params, context?: HttpContext): Observable<ControllingMemberCrcAppCommandResponse> {
    return this.apiControllingMemberCrcApplicationsAnonymousSubmitPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<ControllingMemberCrcAppCommandResponse>): ControllingMemberCrcAppCommandResponse => r.body)
    );
  }

}
