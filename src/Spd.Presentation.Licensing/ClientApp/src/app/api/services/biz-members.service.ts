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
import { apiBusinessBizIdEmployeesPost } from '../fn/biz-members/api-business-biz-id-employees-post';
import { ApiBusinessBizIdEmployeesPost$Params } from '../fn/biz-members/api-business-biz-id-employees-post';
import { apiBusinessBizIdMembersBizContactIdDelete } from '../fn/biz-members/api-business-biz-id-members-biz-contact-id-delete';
import { ApiBusinessBizIdMembersBizContactIdDelete$Params } from '../fn/biz-members/api-business-biz-id-members-biz-contact-id-delete';
import { apiBusinessBizIdMembersGet } from '../fn/biz-members/api-business-biz-id-members-get';
import { ApiBusinessBizIdMembersGet$Params } from '../fn/biz-members/api-business-biz-id-members-get';
import { apiBusinessBizIdMembersPost } from '../fn/biz-members/api-business-biz-id-members-post';
import { ApiBusinessBizIdMembersPost$Params } from '../fn/biz-members/api-business-biz-id-members-post';
import { apiBusinessBizIdNonSwlControllingMembersBizContactIdGet } from '../fn/biz-members/api-business-biz-id-non-swl-controlling-members-biz-contact-id-get';
import { ApiBusinessBizIdNonSwlControllingMembersBizContactIdGet$Params } from '../fn/biz-members/api-business-biz-id-non-swl-controlling-members-biz-contact-id-get';
import { apiBusinessBizIdNonSwlControllingMembersBizContactIdPut } from '../fn/biz-members/api-business-biz-id-non-swl-controlling-members-biz-contact-id-put';
import { ApiBusinessBizIdNonSwlControllingMembersBizContactIdPut$Params } from '../fn/biz-members/api-business-biz-id-non-swl-controlling-members-biz-contact-id-put';
import { apiBusinessBizIdNonSwlControllingMembersPost } from '../fn/biz-members/api-business-biz-id-non-swl-controlling-members-post';
import { ApiBusinessBizIdNonSwlControllingMembersPost$Params } from '../fn/biz-members/api-business-biz-id-non-swl-controlling-members-post';
import { apiBusinessBizIdSwlControllingMembersPost } from '../fn/biz-members/api-business-biz-id-swl-controlling-members-post';
import { ApiBusinessBizIdSwlControllingMembersPost$Params } from '../fn/biz-members/api-business-biz-id-swl-controlling-members-post';
import { apiBusinessLicenceApplicationControllingMemberInvitationBizContactIdGet } from '../fn/biz-members/api-business-licence-application-controlling-member-invitation-biz-contact-id-get';
import { ApiBusinessLicenceApplicationControllingMemberInvitationBizContactIdGet$Params } from '../fn/biz-members/api-business-licence-application-controlling-member-invitation-biz-contact-id-get';
import { apiControllingMembersInvitesPost } from '../fn/biz-members/api-controlling-members-invites-post';
import { ApiControllingMembersInvitesPost$Params } from '../fn/biz-members/api-controlling-members-invites-post';
import { BizMemberResponse } from '../models/biz-member-response';
import { ControllingMemberAppInviteVerifyResponse } from '../models/controlling-member-app-invite-verify-response';
import { ControllingMemberInvitesCreateResponse } from '../models/controlling-member-invites-create-response';
import { Members } from '../models/members';
import { NonSwlContactInfo } from '../models/non-swl-contact-info';

@Injectable({ providedIn: 'root' })
export class BizMembersService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `apiBusinessBizIdMembersGet()` */
  static readonly ApiBusinessBizIdMembersGetPath = '/api/business/{bizId}/members';

  /**
   * Get Biz controlling members and employees, controlling member includes swl and non-swl
   * This is the latest active biz controlling members and employees, irrelevent to application.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBusinessBizIdMembersGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBusinessBizIdMembersGet$Response(params: ApiBusinessBizIdMembersGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Members>> {
    return apiBusinessBizIdMembersGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Get Biz controlling members and employees, controlling member includes swl and non-swl
   * This is the latest active biz controlling members and employees, irrelevent to application.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBusinessBizIdMembersGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBusinessBizIdMembersGet(params: ApiBusinessBizIdMembersGet$Params, context?: HttpContext): Observable<Members> {
    return this.apiBusinessBizIdMembersGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Members>): Members => r.body)
    );
  }

  /** Path part for operation `apiBusinessBizIdMembersPost()` */
  static readonly ApiBusinessBizIdMembersPostPath = '/api/business/{bizId}/members';

  /**
   * Deprecated. Upsert Biz Application controlling members and employees, controlling members include swl and non-swl.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBusinessBizIdMembersPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiBusinessBizIdMembersPost$Response(params: ApiBusinessBizIdMembersPost$Params, context?: HttpContext): Observable<StrictHttpResponse<ActionResult>> {
    return apiBusinessBizIdMembersPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Deprecated. Upsert Biz Application controlling members and employees, controlling members include swl and non-swl.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBusinessBizIdMembersPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiBusinessBizIdMembersPost(params: ApiBusinessBizIdMembersPost$Params, context?: HttpContext): Observable<ActionResult> {
    return this.apiBusinessBizIdMembersPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<ActionResult>): ActionResult => r.body)
    );
  }

  /** Path part for operation `apiBusinessBizIdEmployeesPost()` */
  static readonly ApiBusinessBizIdEmployeesPostPath = '/api/business/{bizId}/employees';

  /**
   * Create Biz employee.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBusinessBizIdEmployeesPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiBusinessBizIdEmployeesPost$Response(params: ApiBusinessBizIdEmployeesPost$Params, context?: HttpContext): Observable<StrictHttpResponse<BizMemberResponse>> {
    return apiBusinessBizIdEmployeesPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Create Biz employee.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBusinessBizIdEmployeesPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiBusinessBizIdEmployeesPost(params: ApiBusinessBizIdEmployeesPost$Params, context?: HttpContext): Observable<BizMemberResponse> {
    return this.apiBusinessBizIdEmployeesPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<BizMemberResponse>): BizMemberResponse => r.body)
    );
  }

  /** Path part for operation `apiBusinessBizIdSwlControllingMembersPost()` */
  static readonly ApiBusinessBizIdSwlControllingMembersPostPath = '/api/business/{bizId}/swl-controlling-members';

  /**
   * Create Biz swl controlling member.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBusinessBizIdSwlControllingMembersPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiBusinessBizIdSwlControllingMembersPost$Response(params: ApiBusinessBizIdSwlControllingMembersPost$Params, context?: HttpContext): Observable<StrictHttpResponse<BizMemberResponse>> {
    return apiBusinessBizIdSwlControllingMembersPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Create Biz swl controlling member.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBusinessBizIdSwlControllingMembersPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiBusinessBizIdSwlControllingMembersPost(params: ApiBusinessBizIdSwlControllingMembersPost$Params, context?: HttpContext): Observable<BizMemberResponse> {
    return this.apiBusinessBizIdSwlControllingMembersPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<BizMemberResponse>): BizMemberResponse => r.body)
    );
  }

  /** Path part for operation `apiBusinessBizIdNonSwlControllingMembersPost()` */
  static readonly ApiBusinessBizIdNonSwlControllingMembersPostPath = '/api/business/{bizId}/non-swl-controlling-members';

  /**
   * Create Biz swl controlling member.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBusinessBizIdNonSwlControllingMembersPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiBusinessBizIdNonSwlControllingMembersPost$Response(params: ApiBusinessBizIdNonSwlControllingMembersPost$Params, context?: HttpContext): Observable<StrictHttpResponse<BizMemberResponse>> {
    return apiBusinessBizIdNonSwlControllingMembersPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Create Biz swl controlling member.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBusinessBizIdNonSwlControllingMembersPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiBusinessBizIdNonSwlControllingMembersPost(params: ApiBusinessBizIdNonSwlControllingMembersPost$Params, context?: HttpContext): Observable<BizMemberResponse> {
    return this.apiBusinessBizIdNonSwlControllingMembersPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<BizMemberResponse>): BizMemberResponse => r.body)
    );
  }

  /** Path part for operation `apiBusinessBizIdNonSwlControllingMembersBizContactIdGet()` */
  static readonly ApiBusinessBizIdNonSwlControllingMembersBizContactIdGetPath = '/api/business/{bizId}/non-swl-controlling-members/{bizContactId}';

  /**
   * Get non-swl Biz controlling members.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBusinessBizIdNonSwlControllingMembersBizContactIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBusinessBizIdNonSwlControllingMembersBizContactIdGet$Response(params: ApiBusinessBizIdNonSwlControllingMembersBizContactIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<NonSwlContactInfo>> {
    return apiBusinessBizIdNonSwlControllingMembersBizContactIdGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Get non-swl Biz controlling members.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBusinessBizIdNonSwlControllingMembersBizContactIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBusinessBizIdNonSwlControllingMembersBizContactIdGet(params: ApiBusinessBizIdNonSwlControllingMembersBizContactIdGet$Params, context?: HttpContext): Observable<NonSwlContactInfo> {
    return this.apiBusinessBizIdNonSwlControllingMembersBizContactIdGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<NonSwlContactInfo>): NonSwlContactInfo => r.body)
    );
  }

  /** Path part for operation `apiBusinessBizIdNonSwlControllingMembersBizContactIdPut()` */
  static readonly ApiBusinessBizIdNonSwlControllingMembersBizContactIdPutPath = '/api/business/{bizId}/non-swl-controlling-members/{bizContactId}';

  /**
   * Update Non swl biz controlling member.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBusinessBizIdNonSwlControllingMembersBizContactIdPut()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiBusinessBizIdNonSwlControllingMembersBizContactIdPut$Response(params: ApiBusinessBizIdNonSwlControllingMembersBizContactIdPut$Params, context?: HttpContext): Observable<StrictHttpResponse<BizMemberResponse>> {
    return apiBusinessBizIdNonSwlControllingMembersBizContactIdPut(this.http, this.rootUrl, params, context);
  }

  /**
   * Update Non swl biz controlling member.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBusinessBizIdNonSwlControllingMembersBizContactIdPut$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiBusinessBizIdNonSwlControllingMembersBizContactIdPut(params: ApiBusinessBizIdNonSwlControllingMembersBizContactIdPut$Params, context?: HttpContext): Observable<BizMemberResponse> {
    return this.apiBusinessBizIdNonSwlControllingMembersBizContactIdPut$Response(params, context).pipe(
      map((r: StrictHttpResponse<BizMemberResponse>): BizMemberResponse => r.body)
    );
  }

  /** Path part for operation `apiBusinessBizIdMembersBizContactIdDelete()` */
  static readonly ApiBusinessBizIdMembersBizContactIdDeletePath = '/api/business/{bizId}/members/{bizContactId}';

  /**
   * Delete Biz swl controlling member.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBusinessBizIdMembersBizContactIdDelete()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBusinessBizIdMembersBizContactIdDelete$Response(params: ApiBusinessBizIdMembersBizContactIdDelete$Params, context?: HttpContext): Observable<StrictHttpResponse<ActionResult>> {
    return apiBusinessBizIdMembersBizContactIdDelete(this.http, this.rootUrl, params, context);
  }

  /**
   * Delete Biz swl controlling member.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBusinessBizIdMembersBizContactIdDelete$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBusinessBizIdMembersBizContactIdDelete(params: ApiBusinessBizIdMembersBizContactIdDelete$Params, context?: HttpContext): Observable<ActionResult> {
    return this.apiBusinessBizIdMembersBizContactIdDelete$Response(params, context).pipe(
      map((r: StrictHttpResponse<ActionResult>): ActionResult => r.body)
    );
  }

  /** Path part for operation `apiBusinessLicenceApplicationControllingMemberInvitationBizContactIdGet()` */
  static readonly ApiBusinessLicenceApplicationControllingMemberInvitationBizContactIdGetPath = '/api/business-licence-application/controlling-member-invitation/{bizContactId}';

  /**
   * Create controlling member crc invitation for this biz contact
   * Example: http://localhost:5114/api/business-licence-application/controlling-member-invitation/123?inviteType=Update.
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
   * Create controlling member crc invitation for this biz contact
   * Example: http://localhost:5114/api/business-licence-application/controlling-member-invitation/123?inviteType=Update.
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

  /** Path part for operation `apiControllingMembersInvitesPost()` */
  static readonly ApiControllingMembersInvitesPostPath = '/api/controlling-members/invites';

  /**
   * Verify if the current controlling member crc application invite is correct, and return needed info.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiControllingMembersInvitesPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiControllingMembersInvitesPost$Response(params: ApiControllingMembersInvitesPost$Params, context?: HttpContext): Observable<StrictHttpResponse<ControllingMemberAppInviteVerifyResponse>> {
    return apiControllingMembersInvitesPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Verify if the current controlling member crc application invite is correct, and return needed info.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiControllingMembersInvitesPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiControllingMembersInvitesPost(params: ApiControllingMembersInvitesPost$Params, context?: HttpContext): Observable<ControllingMemberAppInviteVerifyResponse> {
    return this.apiControllingMembersInvitesPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<ControllingMemberAppInviteVerifyResponse>): ControllingMemberAppInviteVerifyResponse => r.body)
    );
  }

}
