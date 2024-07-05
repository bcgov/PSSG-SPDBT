/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpContext } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { GoogleRecaptcha } from '../models/google-recaptcha';
import { LicenceBasicResponse } from '../models/licence-basic-response';
import { LicenceResponse } from '../models/licence-response';

@Injectable({
  providedIn: 'root',
})
export class LicenceService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation apiBizsBizIdLicencesGet
   */
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
  apiBizsBizIdLicencesGet$Response(params: {
    bizId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Array<LicenceBasicResponse>>> {

    const rb = new RequestBuilder(this.rootUrl, LicenceService.ApiBizsBizIdLicencesGetPath, 'get');
    if (params) {
      rb.path('bizId', params.bizId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<LicenceBasicResponse>>;
      })
    );
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
  apiBizsBizIdLicencesGet(params: {
    bizId: string;
  },
  context?: HttpContext

): Observable<Array<LicenceBasicResponse>> {

    return this.apiBizsBizIdLicencesGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<Array<LicenceBasicResponse>>) => r.body as Array<LicenceBasicResponse>)
    );
  }

  /**
   * Path part for operation apiApplicantsApplicantIdLicencesGet
   */
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
  apiApplicantsApplicantIdLicencesGet$Response(params: {
    applicantId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Array<LicenceBasicResponse>>> {

    const rb = new RequestBuilder(this.rootUrl, LicenceService.ApiApplicantsApplicantIdLicencesGetPath, 'get');
    if (params) {
      rb.path('applicantId', params.applicantId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<LicenceBasicResponse>>;
      })
    );
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
  apiApplicantsApplicantIdLicencesGet(params: {
    applicantId: string;
  },
  context?: HttpContext

): Observable<Array<LicenceBasicResponse>> {

    return this.apiApplicantsApplicantIdLicencesGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<Array<LicenceBasicResponse>>) => r.body as Array<LicenceBasicResponse>)
    );
  }

  /**
   * Path part for operation apiLicenceLookupLicenceNumberGet
   */
  static readonly ApiLicenceLookupLicenceNumberGetPath = '/api/licence-lookup/{licenceNumber}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiLicenceLookupLicenceNumberGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiLicenceLookupLicenceNumberGet$Response(params: {
    licenceNumber: string;
    accessCode?: string;
    isLatestInactive?: boolean;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<LicenceResponse>> {

    const rb = new RequestBuilder(this.rootUrl, LicenceService.ApiLicenceLookupLicenceNumberGetPath, 'get');
    if (params) {
      rb.path('licenceNumber', params.licenceNumber, {});
      rb.query('accessCode', params.accessCode, {});
      rb.query('isLatestInactive', params.isLatestInactive, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<LicenceResponse>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiLicenceLookupLicenceNumberGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiLicenceLookupLicenceNumberGet(params: {
    licenceNumber: string;
    accessCode?: string;
    isLatestInactive?: boolean;
  },
  context?: HttpContext

): Observable<LicenceResponse> {

    return this.apiLicenceLookupLicenceNumberGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<LicenceResponse>) => r.body as LicenceResponse)
    );
  }

  /**
   * Path part for operation apiLicenceLookupAnonymousLicenceNumberPost
   */
  static readonly ApiLicenceLookupAnonymousLicenceNumberPostPath = '/api/licence-lookup/anonymous/{licenceNumber}';

  /**
   * Get licence by licence number with google recaptcha for anonymous
   * If isLatestInactive = true, it means return the latest inactive licence. If isLatestInactive=false, it will return the active licence.
   * There should be only one active licence for each licenceNumber.
   * Example: http://localhost:5114/api/licence-lookup/TEST-02?accessCode=TEST.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiLicenceLookupAnonymousLicenceNumberPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiLicenceLookupAnonymousLicenceNumberPost$Response(params: {
    licenceNumber: string;
    accessCode?: string;
    isLatestInactive?: boolean;
    body?: GoogleRecaptcha
  },
  context?: HttpContext

): Observable<StrictHttpResponse<LicenceResponse>> {

    const rb = new RequestBuilder(this.rootUrl, LicenceService.ApiLicenceLookupAnonymousLicenceNumberPostPath, 'post');
    if (params) {
      rb.path('licenceNumber', params.licenceNumber, {});
      rb.query('accessCode', params.accessCode, {});
      rb.query('isLatestInactive', params.isLatestInactive, {});
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<LicenceResponse>;
      })
    );
  }

  /**
   * Get licence by licence number with google recaptcha for anonymous
   * If isLatestInactive = true, it means return the latest inactive licence. If isLatestInactive=false, it will return the active licence.
   * There should be only one active licence for each licenceNumber.
   * Example: http://localhost:5114/api/licence-lookup/TEST-02?accessCode=TEST.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiLicenceLookupAnonymousLicenceNumberPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiLicenceLookupAnonymousLicenceNumberPost(params: {
    licenceNumber: string;
    accessCode?: string;
    isLatestInactive?: boolean;
    body?: GoogleRecaptcha
  },
  context?: HttpContext

): Observable<LicenceResponse> {

    return this.apiLicenceLookupAnonymousLicenceNumberPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<LicenceResponse>) => r.body as LicenceResponse)
    );
  }

  /**
   * Path part for operation apiLicencesLicencePhotoLicenceIdGet
   */
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
  apiLicencesLicencePhotoLicenceIdGet$Response(params: {
    licenceId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Blob>> {

    const rb = new RequestBuilder(this.rootUrl, LicenceService.ApiLicencesLicencePhotoLicenceIdGetPath, 'get');
    if (params) {
      rb.path('licenceId', params.licenceId, {});
    }

    return this.http.request(rb.build({
      responseType: 'blob',
      accept: 'application/pdf',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Blob>;
      })
    );
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
  apiLicencesLicencePhotoLicenceIdGet(params: {
    licenceId: string;
  },
  context?: HttpContext

): Observable<Blob> {

    return this.apiLicencesLicencePhotoLicenceIdGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<Blob>) => r.body as Blob)
    );
  }

  /**
   * Path part for operation apiLicencesLicencePhotoGet
   */
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
  apiLicencesLicencePhotoGet$Response(params?: {
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Blob>> {

    const rb = new RequestBuilder(this.rootUrl, LicenceService.ApiLicencesLicencePhotoGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'blob',
      accept: 'application/pdf',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Blob>;
      })
    );
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
  apiLicencesLicencePhotoGet(params?: {
  },
  context?: HttpContext

): Observable<Blob> {

    return this.apiLicencesLicencePhotoGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<Blob>) => r.body as Blob)
    );
  }

  /**
   * Path part for operation apiLicencesLicenceIdGet
   */
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
  apiLicencesLicenceIdGet$Response(params: {
    licenceId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<LicenceResponse>> {

    const rb = new RequestBuilder(this.rootUrl, LicenceService.ApiLicencesLicenceIdGetPath, 'get');
    if (params) {
      rb.path('licenceId', params.licenceId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<LicenceResponse>;
      })
    );
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
  apiLicencesLicenceIdGet(params: {
    licenceId: string;
  },
  context?: HttpContext

): Observable<LicenceResponse> {

    return this.apiLicencesLicenceIdGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<LicenceResponse>) => r.body as LicenceResponse)
    );
  }

}
