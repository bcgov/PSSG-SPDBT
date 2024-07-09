/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { apiApplicantsApplicantIdLicencesGet } from '../fn/licence/api-applicants-applicant-id-licences-get';
import { ApiApplicantsApplicantIdLicencesGet$Params } from '../fn/licence/api-applicants-applicant-id-licences-get';
import { apiBizsBizIdLicencesGet } from '../fn/licence/api-bizs-biz-id-licences-get';
import { ApiBizsBizIdLicencesGet$Params } from '../fn/licence/api-bizs-biz-id-licences-get';
import { apiLicenceLookupAnonymousLicenceNumberPost } from '../fn/licence/api-licence-lookup-anonymous-licence-number-post';
import { ApiLicenceLookupAnonymousLicenceNumberPost$Params } from '../fn/licence/api-licence-lookup-anonymous-licence-number-post';
import { apiLicenceLookupLicenceNumberGet } from '../fn/licence/api-licence-lookup-licence-number-get';
import { ApiLicenceLookupLicenceNumberGet$Params } from '../fn/licence/api-licence-lookup-licence-number-get';
import { apiLicencesLicenceIdGet } from '../fn/licence/api-licences-licence-id-get';
import { ApiLicencesLicenceIdGet$Params } from '../fn/licence/api-licences-licence-id-get';
import { apiLicencesLicencePhotoGet } from '../fn/licence/api-licences-licence-photo-get';
import { ApiLicencesLicencePhotoGet$Params } from '../fn/licence/api-licences-licence-photo-get';
import { apiLicencesLicencePhotoLicenceIdGet } from '../fn/licence/api-licences-licence-photo-licence-id-get';
import { ApiLicencesLicencePhotoLicenceIdGet$Params } from '../fn/licence/api-licences-licence-photo-licence-id-get';
import { LicenceBasicResponse } from '../models/licence-basic-response';
import { LicenceResponse } from '../models/licence-response';

@Injectable({ providedIn: 'root' })
export class LicenceService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `apiBizsBizIdLicencesGet()` */
  static readonly ApiBizsBizIdLicencesGetPath = '/api/bizs/{bizId}/licences';

  /**
   * Get licences for login biz , only return active and Expired ones. 
   * Example: http://localhost:5114/api/bizs/xxxx/licences.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBizsBizIdLicencesGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBizsBizIdLicencesGet$Response(params: ApiBizsBizIdLicencesGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<LicenceBasicResponse>>> {
    return apiBizsBizIdLicencesGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Get licences for login biz , only return active and Expired ones. 
   * Example: http://localhost:5114/api/bizs/xxxx/licences.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBizsBizIdLicencesGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBizsBizIdLicencesGet(params: ApiBizsBizIdLicencesGet$Params, context?: HttpContext): Observable<Array<LicenceBasicResponse>> {
    return this.apiBizsBizIdLicencesGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<LicenceBasicResponse>>): Array<LicenceBasicResponse> => r.body)
    );
  }

  /** Path part for operation `apiApplicantsApplicantIdLicencesGet()` */
  static readonly ApiApplicantsApplicantIdLicencesGetPath = '/api/applicants/{applicantId}/licences';

  /**
   * Get licences for login user , only return active and Expired ones. 
   * Example: http://localhost:5114/api/applicants/xxxx/licences.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiApplicantsApplicantIdLicencesGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsApplicantIdLicencesGet$Response(params: ApiApplicantsApplicantIdLicencesGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<LicenceBasicResponse>>> {
    return apiApplicantsApplicantIdLicencesGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Get licences for login user , only return active and Expired ones. 
   * Example: http://localhost:5114/api/applicants/xxxx/licences.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiApplicantsApplicantIdLicencesGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiApplicantsApplicantIdLicencesGet(params: ApiApplicantsApplicantIdLicencesGet$Params, context?: HttpContext): Observable<Array<LicenceBasicResponse>> {
    return this.apiApplicantsApplicantIdLicencesGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<LicenceBasicResponse>>): Array<LicenceBasicResponse> => r.body)
    );
  }

  /** Path part for operation `apiLicenceLookupLicenceNumberGet()` */
  static readonly ApiLicenceLookupLicenceNumberGetPath = '/api/licence-lookup/{licenceNumber}';

  /**
   * Get latest licence by licence number.
   * There should be only one active licence for each licenceNumber.
   * Example: http://localhost:5114/api/licence-lookup/TEST-02?accessCode=TEST.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiLicenceLookupLicenceNumberGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiLicenceLookupLicenceNumberGet$Response(params: ApiLicenceLookupLicenceNumberGet$Params, context?: HttpContext): Observable<StrictHttpResponse<LicenceResponse>> {
    return apiLicenceLookupLicenceNumberGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Get latest licence by licence number.
   * There should be only one active licence for each licenceNumber.
   * Example: http://localhost:5114/api/licence-lookup/TEST-02?accessCode=TEST.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiLicenceLookupLicenceNumberGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiLicenceLookupLicenceNumberGet(params: ApiLicenceLookupLicenceNumberGet$Params, context?: HttpContext): Observable<LicenceResponse> {
    return this.apiLicenceLookupLicenceNumberGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<LicenceResponse>): LicenceResponse => r.body)
    );
  }

  /** Path part for operation `apiLicenceLookupAnonymousLicenceNumberPost()` */
  static readonly ApiLicenceLookupAnonymousLicenceNumberPostPath = '/api/licence-lookup/anonymous/{licenceNumber}';

  /**
   * Get latest licence by licence number with google recaptcha for anonymous
   * Example: http://localhost:5114/api/licence-lookup/TEST-02?accessCode=TEST.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiLicenceLookupAnonymousLicenceNumberPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiLicenceLookupAnonymousLicenceNumberPost$Response(params: ApiLicenceLookupAnonymousLicenceNumberPost$Params, context?: HttpContext): Observable<StrictHttpResponse<LicenceResponse>> {
    return apiLicenceLookupAnonymousLicenceNumberPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Get latest licence by licence number with google recaptcha for anonymous
   * Example: http://localhost:5114/api/licence-lookup/TEST-02?accessCode=TEST.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiLicenceLookupAnonymousLicenceNumberPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiLicenceLookupAnonymousLicenceNumberPost(params: ApiLicenceLookupAnonymousLicenceNumberPost$Params, context?: HttpContext): Observable<LicenceResponse> {
    return this.apiLicenceLookupAnonymousLicenceNumberPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<LicenceResponse>): LicenceResponse => r.body)
    );
  }

  /** Path part for operation `apiLicencesLicencePhotoLicenceIdGet()` */
  static readonly ApiLicencesLicencePhotoLicenceIdGetPath = '/api/licences/licence-photo/{licenceId}';

  /**
   * Get licence photo by licenceId.
   * Example: api/licences/licence-photo/10000000-0000-0000-0000-000000000000.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiLicencesLicencePhotoLicenceIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiLicencesLicencePhotoLicenceIdGet$Response(params: ApiLicencesLicencePhotoLicenceIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Blob>> {
    return apiLicencesLicencePhotoLicenceIdGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Get licence photo by licenceId.
   * Example: api/licences/licence-photo/10000000-0000-0000-0000-000000000000.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiLicencesLicencePhotoLicenceIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiLicencesLicencePhotoLicenceIdGet(params: ApiLicencesLicencePhotoLicenceIdGet$Params, context?: HttpContext): Observable<Blob> {
    return this.apiLicencesLicencePhotoLicenceIdGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Blob>): Blob => r.body)
    );
  }

  /** Path part for operation `apiLicencesLicencePhotoGet()` */
  static readonly ApiLicencesLicencePhotoGetPath = '/api/licences/licence-photo';

  /**
   * Get licence photo by licenceId, the licenceId is put into cookie and encoded.
   * Example: http://localhost:5114/api/licences/image.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiLicencesLicencePhotoGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiLicencesLicencePhotoGet$Response(params?: ApiLicencesLicencePhotoGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Blob>> {
    return apiLicencesLicencePhotoGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Get licence photo by licenceId, the licenceId is put into cookie and encoded.
   * Example: http://localhost:5114/api/licences/image.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiLicencesLicencePhotoGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiLicencesLicencePhotoGet(params?: ApiLicencesLicencePhotoGet$Params, context?: HttpContext): Observable<Blob> {
    return this.apiLicencesLicencePhotoGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Blob>): Blob => r.body)
    );
  }

  /** Path part for operation `apiLicencesLicenceIdGet()` */
  static readonly ApiLicencesLicenceIdGetPath = '/api/licences/{licenceId}';

  /**
   * Get licence info by licenceId.
   * Example: api/licences/10000000-0000-0000-0000-000000000000.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiLicencesLicenceIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiLicencesLicenceIdGet$Response(params: ApiLicencesLicenceIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<LicenceResponse>> {
    return apiLicencesLicenceIdGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Get licence info by licenceId.
   * Example: api/licences/10000000-0000-0000-0000-000000000000.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiLicencesLicenceIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiLicencesLicenceIdGet(params: ApiLicencesLicenceIdGet$Params, context?: HttpContext): Observable<LicenceResponse> {
    return this.apiLicencesLicenceIdGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<LicenceResponse>): LicenceResponse => r.body)
    );
  }

}
