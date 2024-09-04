/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { ActionResult } from '../models/action-result';
import { apiBusinessLicenceApplicationBizIdMembersGet } from '../fn/biz-members/api-business-licence-application-biz-id-members-get';
import { ApiBusinessLicenceApplicationBizIdMembersGet$Params } from '../fn/biz-members/api-business-licence-application-biz-id-members-get';
import { apiBusinessLicenceApplicationBizIdMembersPost } from '../fn/biz-members/api-business-licence-application-biz-id-members-post';
import { ApiBusinessLicenceApplicationBizIdMembersPost$Params } from '../fn/biz-members/api-business-licence-application-biz-id-members-post';
import { apiBusinessLicenceApplicationControllingMemberInvitationBizContactIdGet } from '../fn/biz-members/api-business-licence-application-controlling-member-invitation-biz-contact-id-get';
import { ApiBusinessLicenceApplicationControllingMemberInvitationBizContactIdGet$Params } from '../fn/biz-members/api-business-licence-application-controlling-member-invitation-biz-contact-id-get';
import { ControllingMemberInvitesCreateResponse } from '../models/controlling-member-invites-create-response';
import { Members } from '../models/members';

@Injectable({ providedIn: 'root' })
export class BizMembersService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `apiBusinessLicenceApplicationBizIdMembersGet()` */
  static readonly ApiBusinessLicenceApplicationBizIdMembersGetPath = '/api/business-licence-application/{bizId}/members';

  /**
   * Get Biz controlling members and employees, controlling member includes swl and non-swl
   * This is the latest active biz controlling members and employees, irrelevent to application.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBusinessLicenceApplicationBizIdMembersGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBusinessLicenceApplicationBizIdMembersGet$Response(params: ApiBusinessLicenceApplicationBizIdMembersGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Members>> {
    return apiBusinessLicenceApplicationBizIdMembersGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Get Biz controlling members and employees, controlling member includes swl and non-swl
   * This is the latest active biz controlling members and employees, irrelevent to application.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBusinessLicenceApplicationBizIdMembersGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBusinessLicenceApplicationBizIdMembersGet(params: ApiBusinessLicenceApplicationBizIdMembersGet$Params, context?: HttpContext): Observable<Members> {
    return this.apiBusinessLicenceApplicationBizIdMembersGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Members>): Members => r.body)
    );
  }

  /** Path part for operation `apiBusinessLicenceApplicationBizIdMembersPost()` */
  static readonly ApiBusinessLicenceApplicationBizIdMembersPostPath = '/api/business-licence-application/{bizId}/members';

  /**
   * Upsert Biz Application controlling members and employees, controlling members include swl and non-swl.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBusinessLicenceApplicationBizIdMembersPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiBusinessLicenceApplicationBizIdMembersPost$Response(params: ApiBusinessLicenceApplicationBizIdMembersPost$Params, context?: HttpContext): Observable<StrictHttpResponse<ActionResult>> {
    return apiBusinessLicenceApplicationBizIdMembersPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Upsert Biz Application controlling members and employees, controlling members include swl and non-swl.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBusinessLicenceApplicationBizIdMembersPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiBusinessLicenceApplicationBizIdMembersPost(params: ApiBusinessLicenceApplicationBizIdMembersPost$Params, context?: HttpContext): Observable<ActionResult> {
    return this.apiBusinessLicenceApplicationBizIdMembersPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<ActionResult>): ActionResult => r.body)
    );
  }

  /** Path part for operation `apiBusinessLicenceApplicationControllingMemberInvitationBizContactIdGet()` */
  static readonly ApiBusinessLicenceApplicationControllingMemberInvitationBizContactIdGetPath = '/api/business-licence-application/controlling-member-invitation/{bizContactId}';

  /**
   * Create controlling member crc invitation for this biz contact.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBusinessLicenceApplicationControllingMemberInvitationBizContactIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBusinessLicenceApplicationControllingMemberInvitationBizContactIdGet$Response(params: ApiBusinessLicenceApplicationControllingMemberInvitationBizContactIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ControllingMemberInvitesCreateResponse>> {
    return apiBusinessLicenceApplicationControllingMemberInvitationBizContactIdGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Create controlling member crc invitation for this biz contact.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBusinessLicenceApplicationControllingMemberInvitationBizContactIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBusinessLicenceApplicationControllingMemberInvitationBizContactIdGet(params: ApiBusinessLicenceApplicationControllingMemberInvitationBizContactIdGet$Params, context?: HttpContext): Observable<ControllingMemberInvitesCreateResponse> {
    return this.apiBusinessLicenceApplicationControllingMemberInvitationBizContactIdGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<ControllingMemberInvitesCreateResponse>): ControllingMemberInvitesCreateResponse => r.body)
    );
  }

}
