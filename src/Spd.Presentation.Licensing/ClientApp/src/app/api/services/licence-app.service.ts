/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { apiApplicantsApplicantIdLicenceApplicationsGet } from '../fn/licence-app/api-applicants-applicant-id-licence-applications-get';
import { ApiApplicantsApplicantIdLicenceApplicationsGet$Params } from '../fn/licence-app/api-applicants-applicant-id-licence-applications-get';
import { apiBizsBizIdLicenceApplicationsGet } from '../fn/licence-app/api-bizs-biz-id-licence-applications-get';
import { ApiBizsBizIdLicenceApplicationsGet$Params } from '../fn/licence-app/api-bizs-biz-id-licence-applications-get';
import { LicenceAppListResponse } from '../models/licence-app-list-response';

@Injectable({ providedIn: 'root' })
export class LicenceAppService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `apiApplicantsApplicantIdLicenceApplicationsGet()` */
  static readonly ApiApplicantsApplicantIdLicenceApplicationsGetPath = '/api/applicants/{applicantId}/licence-applications';

  /**
   * Get List of draft or InProgress Security Worker Licence Application or Permit Application.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiApplicantsApplicantIdLicenceApplicationsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsApplicantIdLicenceApplicationsGet$Response(params: ApiApplicantsApplicantIdLicenceApplicationsGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<LicenceAppListResponse>>> {
    return apiApplicantsApplicantIdLicenceApplicationsGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Get List of draft or InProgress Security Worker Licence Application or Permit Application.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiApplicantsApplicantIdLicenceApplicationsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsApplicantIdLicenceApplicationsGet(params: ApiApplicantsApplicantIdLicenceApplicationsGet$Params, context?: HttpContext): Observable<Array<LicenceAppListResponse>> {
    return this.apiApplicantsApplicantIdLicenceApplicationsGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<LicenceAppListResponse>>): Array<LicenceAppListResponse> => r.body)
    );
  }

  /** Path part for operation `apiBizsBizIdLicenceApplicationsGet()` */
  static readonly ApiBizsBizIdLicenceApplicationsGetPath = '/api/bizs/{bizId}/licence-applications';

  /**
   * Get List of draft or InProgress Security Business Licence Application.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBizsBizIdLicenceApplicationsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBizsBizIdLicenceApplicationsGet$Response(params: ApiBizsBizIdLicenceApplicationsGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<LicenceAppListResponse>>> {
    return apiBizsBizIdLicenceApplicationsGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Get List of draft or InProgress Security Business Licence Application.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBizsBizIdLicenceApplicationsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBizsBizIdLicenceApplicationsGet(params: ApiBizsBizIdLicenceApplicationsGet$Params, context?: HttpContext): Observable<Array<LicenceAppListResponse>> {
    return this.apiBizsBizIdLicenceApplicationsGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<LicenceAppListResponse>>): Array<LicenceAppListResponse> => r.body)
    );
  }

}
