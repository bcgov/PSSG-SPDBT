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
import { apiBusinessBizIdAppLatestGet } from '../fn/biz-licensing/api-business-biz-id-app-latest-get';
import { ApiBusinessBizIdAppLatestGet$Params } from '../fn/biz-licensing/api-business-biz-id-app-latest-get';
import { apiBusinessLicenceApplicationBizIdMembersGet } from '../fn/biz-licensing/api-business-licence-application-biz-id-members-get';
import { ApiBusinessLicenceApplicationBizIdMembersGet$Params } from '../fn/biz-licensing/api-business-licence-application-biz-id-members-get';
import { apiBusinessLicenceApplicationBizIdMembersPost } from '../fn/biz-licensing/api-business-licence-application-biz-id-members-post';
import { ApiBusinessLicenceApplicationBizIdMembersPost$Params } from '../fn/biz-licensing/api-business-licence-application-biz-id-members-post';
import { apiBusinessLicenceApplicationBrandImageDocumentIdGet } from '../fn/biz-licensing/api-business-licence-application-brand-image-document-id-get';
import { ApiBusinessLicenceApplicationBrandImageDocumentIdGet$Params } from '../fn/biz-licensing/api-business-licence-application-brand-image-document-id-get';
import { apiBusinessLicenceApplicationChangePost } from '../fn/biz-licensing/api-business-licence-application-change-post';
import { ApiBusinessLicenceApplicationChangePost$Params } from '../fn/biz-licensing/api-business-licence-application-change-post';
import { apiBusinessLicenceApplicationFilesPost } from '../fn/biz-licensing/api-business-licence-application-files-post';
import { ApiBusinessLicenceApplicationFilesPost$Params } from '../fn/biz-licensing/api-business-licence-application-files-post';
import { apiBusinessLicenceApplicationLicenceAppIdFilesPost } from '../fn/biz-licensing/api-business-licence-application-licence-app-id-files-post';
import { ApiBusinessLicenceApplicationLicenceAppIdFilesPost$Params } from '../fn/biz-licensing/api-business-licence-application-licence-app-id-files-post';
import { apiBusinessLicenceApplicationLicenceAppIdGet } from '../fn/biz-licensing/api-business-licence-application-licence-app-id-get';
import { ApiBusinessLicenceApplicationLicenceAppIdGet$Params } from '../fn/biz-licensing/api-business-licence-application-licence-app-id-get';
import { apiBusinessLicenceApplicationPost } from '../fn/biz-licensing/api-business-licence-application-post';
import { ApiBusinessLicenceApplicationPost$Params } from '../fn/biz-licensing/api-business-licence-application-post';
import { apiBusinessLicenceApplicationSubmitPost } from '../fn/biz-licensing/api-business-licence-application-submit-post';
import { ApiBusinessLicenceApplicationSubmitPost$Params } from '../fn/biz-licensing/api-business-licence-application-submit-post';
import { BizLicAppCommandResponse } from '../models/biz-lic-app-command-response';
import { BizLicAppResponse } from '../models/biz-lic-app-response';
import { LicenceAppDocumentResponse } from '../models/licence-app-document-response';
import { Members } from '../models/members';

@Injectable({ providedIn: 'root' })
export class BizLicensingService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `apiBusinessLicenceApplicationLicenceAppIdGet()` */
  static readonly ApiBusinessLicenceApplicationLicenceAppIdGetPath = '/api/business-licence-application/{licenceAppId}';

  /**
   * Get Business Licence Application.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBusinessLicenceApplicationLicenceAppIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBusinessLicenceApplicationLicenceAppIdGet$Response(params: ApiBusinessLicenceApplicationLicenceAppIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<BizLicAppResponse>> {
    return apiBusinessLicenceApplicationLicenceAppIdGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Get Business Licence Application.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBusinessLicenceApplicationLicenceAppIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBusinessLicenceApplicationLicenceAppIdGet(params: ApiBusinessLicenceApplicationLicenceAppIdGet$Params, context?: HttpContext): Observable<BizLicAppResponse> {
    return this.apiBusinessLicenceApplicationLicenceAppIdGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<BizLicAppResponse>): BizLicAppResponse => r.body)
    );
  }

  /** Path part for operation `apiBusinessBizIdAppLatestGet()` */
  static readonly ApiBusinessBizIdAppLatestGetPath = '/api/business/{bizId}/app-latest';

  /**
   * Get Lastest Security Business Licence Application.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBusinessBizIdAppLatestGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBusinessBizIdAppLatestGet$Response(params: ApiBusinessBizIdAppLatestGet$Params, context?: HttpContext): Observable<StrictHttpResponse<BizLicAppResponse>> {
    return apiBusinessBizIdAppLatestGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Get Lastest Security Business Licence Application.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBusinessBizIdAppLatestGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBusinessBizIdAppLatestGet(params: ApiBusinessBizIdAppLatestGet$Params, context?: HttpContext): Observable<BizLicAppResponse> {
    return this.apiBusinessBizIdAppLatestGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<BizLicAppResponse>): BizLicAppResponse => r.body)
    );
  }

  /** Path part for operation `apiBusinessLicenceApplicationPost()` */
  static readonly ApiBusinessLicenceApplicationPostPath = '/api/business-licence-application';

  /**
   * Save Business Licence Application.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBusinessLicenceApplicationPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiBusinessLicenceApplicationPost$Response(params: ApiBusinessLicenceApplicationPost$Params, context?: HttpContext): Observable<StrictHttpResponse<BizLicAppCommandResponse>> {
    return apiBusinessLicenceApplicationPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Save Business Licence Application.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBusinessLicenceApplicationPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiBusinessLicenceApplicationPost(params: ApiBusinessLicenceApplicationPost$Params, context?: HttpContext): Observable<BizLicAppCommandResponse> {
    return this.apiBusinessLicenceApplicationPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<BizLicAppCommandResponse>): BizLicAppCommandResponse => r.body)
    );
  }

  /** Path part for operation `apiBusinessLicenceApplicationLicenceAppIdFilesPost()` */
  static readonly ApiBusinessLicenceApplicationLicenceAppIdFilesPostPath = '/api/business-licence-application/{licenceAppId}/files';

  /**
   * Upload business licence application files to transient storage.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBusinessLicenceApplicationLicenceAppIdFilesPost()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiBusinessLicenceApplicationLicenceAppIdFilesPost$Response(params: ApiBusinessLicenceApplicationLicenceAppIdFilesPost$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<LicenceAppDocumentResponse>>> {
    return apiBusinessLicenceApplicationLicenceAppIdFilesPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Upload business licence application files to transient storage.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBusinessLicenceApplicationLicenceAppIdFilesPost$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiBusinessLicenceApplicationLicenceAppIdFilesPost(params: ApiBusinessLicenceApplicationLicenceAppIdFilesPost$Params, context?: HttpContext): Observable<Array<LicenceAppDocumentResponse>> {
    return this.apiBusinessLicenceApplicationLicenceAppIdFilesPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<LicenceAppDocumentResponse>>): Array<LicenceAppDocumentResponse> => r.body)
    );
  }

  /** Path part for operation `apiBusinessLicenceApplicationChangePost()` */
  static readonly ApiBusinessLicenceApplicationChangePostPath = '/api/business-licence-application/change';

  /**
   * Submit Biz licence update, renew and replace
   * After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBusinessLicenceApplicationChangePost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiBusinessLicenceApplicationChangePost$Response(params?: ApiBusinessLicenceApplicationChangePost$Params, context?: HttpContext): Observable<StrictHttpResponse<BizLicAppCommandResponse>> {
    return apiBusinessLicenceApplicationChangePost(this.http, this.rootUrl, params, context);
  }

  /**
   * Submit Biz licence update, renew and replace
   * After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBusinessLicenceApplicationChangePost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiBusinessLicenceApplicationChangePost(params?: ApiBusinessLicenceApplicationChangePost$Params, context?: HttpContext): Observable<BizLicAppCommandResponse> {
    return this.apiBusinessLicenceApplicationChangePost$Response(params, context).pipe(
      map((r: StrictHttpResponse<BizLicAppCommandResponse>): BizLicAppCommandResponse => r.body)
    );
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

  /** Path part for operation `apiBusinessLicenceApplicationFilesPost()` */
  static readonly ApiBusinessLicenceApplicationFilesPostPath = '/api/business-licence-application/files';

  /**
   * Uploading file only save files in cache, the files are not connected to the biz and application yet.
   * this is used for uploading member files or update, renew, replace.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBusinessLicenceApplicationFilesPost()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiBusinessLicenceApplicationFilesPost$Response(params?: ApiBusinessLicenceApplicationFilesPost$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
    return apiBusinessLicenceApplicationFilesPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Uploading file only save files in cache, the files are not connected to the biz and application yet.
   * this is used for uploading member files or update, renew, replace.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBusinessLicenceApplicationFilesPost$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiBusinessLicenceApplicationFilesPost(params?: ApiBusinessLicenceApplicationFilesPost$Params, context?: HttpContext): Observable<string> {
    return this.apiBusinessLicenceApplicationFilesPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<string>): string => r.body)
    );
  }

  /** Path part for operation `apiBusinessLicenceApplicationSubmitPost()` */
  static readonly ApiBusinessLicenceApplicationSubmitPostPath = '/api/business-licence-application/submit';

  /**
   * Submit Business Licence Application.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBusinessLicenceApplicationSubmitPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiBusinessLicenceApplicationSubmitPost$Response(params: ApiBusinessLicenceApplicationSubmitPost$Params, context?: HttpContext): Observable<StrictHttpResponse<BizLicAppCommandResponse>> {
    return apiBusinessLicenceApplicationSubmitPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Submit Business Licence Application.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBusinessLicenceApplicationSubmitPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiBusinessLicenceApplicationSubmitPost(params: ApiBusinessLicenceApplicationSubmitPost$Params, context?: HttpContext): Observable<BizLicAppCommandResponse> {
    return this.apiBusinessLicenceApplicationSubmitPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<BizLicAppCommandResponse>): BizLicAppCommandResponse => r.body)
    );
  }

  /** Path part for operation `apiBusinessLicenceApplicationBrandImageDocumentIdGet()` */
  static readonly ApiBusinessLicenceApplicationBrandImageDocumentIdGetPath = '/api/business-licence-application/brand-image/{documentId}';

  /**
   * Get biz brand image from its documentId.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBusinessLicenceApplicationBrandImageDocumentIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBusinessLicenceApplicationBrandImageDocumentIdGet$Response(params: ApiBusinessLicenceApplicationBrandImageDocumentIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Blob>> {
    return apiBusinessLicenceApplicationBrandImageDocumentIdGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Get biz brand image from its documentId.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBusinessLicenceApplicationBrandImageDocumentIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBusinessLicenceApplicationBrandImageDocumentIdGet(params: ApiBusinessLicenceApplicationBrandImageDocumentIdGet$Params, context?: HttpContext): Observable<Blob> {
    return this.apiBusinessLicenceApplicationBrandImageDocumentIdGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Blob>): Blob => r.body)
    );
  }

}
