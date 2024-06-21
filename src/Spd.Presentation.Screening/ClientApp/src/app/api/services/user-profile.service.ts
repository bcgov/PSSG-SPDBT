/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { apiApplicantsWhoamiGet } from '../fn/user-profile/api-applicants-whoami-get';
import { ApiApplicantsWhoamiGet$Params } from '../fn/user-profile/api-applicants-whoami-get';
import { apiIdirUsersWhoamiGet } from '../fn/user-profile/api-idir-users-whoami-get';
import { ApiIdirUsersWhoamiGet$Params } from '../fn/user-profile/api-idir-users-whoami-get';
import { apiUsersWhoamiGet } from '../fn/user-profile/api-users-whoami-get';
import { ApiUsersWhoamiGet$Params } from '../fn/user-profile/api-users-whoami-get';
import { ApplicantProfileResponse } from '../models/applicant-profile-response';
import { IdirUserProfileResponse } from '../models/idir-user-profile-response';
import { OrgUserProfileResponse } from '../models/org-user-profile-response';

@Injectable({ providedIn: 'root' })
export class UserProfileService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `apiUsersWhoamiGet()` */
  static readonly ApiUsersWhoamiGetPath = '/api/users/whoami';

  /**
   * Org user whoami, for orgPortal.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiUsersWhoamiGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiUsersWhoamiGet$Response(params?: ApiUsersWhoamiGet$Params, context?: HttpContext): Observable<StrictHttpResponse<OrgUserProfileResponse>> {
    return apiUsersWhoamiGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Org user whoami, for orgPortal.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiUsersWhoamiGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiUsersWhoamiGet(params?: ApiUsersWhoamiGet$Params, context?: HttpContext): Observable<OrgUserProfileResponse> {
    return this.apiUsersWhoamiGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<OrgUserProfileResponse>): OrgUserProfileResponse => r.body)
    );
  }

  /** Path part for operation `apiApplicantsWhoamiGet()` */
  static readonly ApiApplicantsWhoamiGetPath = '/api/applicants/whoami';

  /**
   * Applicant whoami, for applicantPortal.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiApplicantsWhoamiGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsWhoamiGet$Response(params?: ApiApplicantsWhoamiGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ApplicantProfileResponse>> {
    return apiApplicantsWhoamiGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Applicant whoami, for applicantPortal.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiApplicantsWhoamiGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsWhoamiGet(params?: ApiApplicantsWhoamiGet$Params, context?: HttpContext): Observable<ApplicantProfileResponse> {
    return this.apiApplicantsWhoamiGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<ApplicantProfileResponse>): ApplicantProfileResponse => r.body)
    );
  }

  /** Path part for operation `apiIdirUsersWhoamiGet()` */
  static readonly ApiIdirUsersWhoamiGetPath = '/api/idir-users/whoami';

  /**
   * Idir user whoami, for PSSO portal.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiIdirUsersWhoamiGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiIdirUsersWhoamiGet$Response(params?: ApiIdirUsersWhoamiGet$Params, context?: HttpContext): Observable<StrictHttpResponse<IdirUserProfileResponse>> {
    return apiIdirUsersWhoamiGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Idir user whoami, for PSSO portal.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiIdirUsersWhoamiGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiIdirUsersWhoamiGet(params?: ApiIdirUsersWhoamiGet$Params, context?: HttpContext): Observable<IdirUserProfileResponse> {
    return this.apiIdirUsersWhoamiGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<IdirUserProfileResponse>): IdirUserProfileResponse => r.body)
    );
  }

}
