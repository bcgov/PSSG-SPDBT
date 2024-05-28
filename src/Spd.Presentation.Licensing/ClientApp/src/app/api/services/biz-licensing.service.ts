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

import { ActionResult } from '../models/action-result';
import { BizLicAppChangeRequest } from '../models/biz-lic-app-change-request';
import { BizLicAppCommandResponse } from '../models/biz-lic-app-command-response';
import { BizLicAppUpsertRequest } from '../models/biz-lic-app-upsert-request';
import { LicenceAppDocumentResponse } from '../models/licence-app-document-response';
import { LicenceDocumentTypeCode } from '../models/licence-document-type-code';
import { Members } from '../models/members';

@Injectable({
  providedIn: 'root',
})
export class BizLicensingService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation apiBusinessLicencePost
   */
  static readonly ApiBusinessLicencePostPath = '/api/business-licence';

  /**
   * Save Business Licence Application.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBusinessLicencePost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiBusinessLicencePost$Response(params: {
    body: BizLicAppUpsertRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<BizLicAppCommandResponse>> {

    const rb = new RequestBuilder(this.rootUrl, BizLicensingService.ApiBusinessLicencePostPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<BizLicAppCommandResponse>;
      })
    );
  }

  /**
   * Save Business Licence Application.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBusinessLicencePost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiBusinessLicencePost(params: {
    body: BizLicAppUpsertRequest
  },
  context?: HttpContext

): Observable<BizLicAppCommandResponse> {

    return this.apiBusinessLicencePost$Response(params,context).pipe(
      map((r: StrictHttpResponse<BizLicAppCommandResponse>) => r.body as BizLicAppCommandResponse)
    );
  }

  /**
   * Path part for operation apiBusinessLicenceLicenceAppIdFilesPost
   */
  static readonly ApiBusinessLicenceLicenceAppIdFilesPostPath = '/api/business-licence/{licenceAppId}/files';

  /**
   * Upload business licence application files to transient storage.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBusinessLicenceLicenceAppIdFilesPost()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiBusinessLicenceLicenceAppIdFilesPost$Response(params: {
    licenceAppId: string;
    body?: {
'Documents'?: Array<Blob>;
'LicenceDocumentTypeCode'?: LicenceDocumentTypeCode;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Array<LicenceAppDocumentResponse>>> {

    const rb = new RequestBuilder(this.rootUrl, BizLicensingService.ApiBusinessLicenceLicenceAppIdFilesPostPath, 'post');
    if (params) {
      rb.path('licenceAppId', params.licenceAppId, {});
      rb.body(params.body, 'multipart/form-data');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<LicenceAppDocumentResponse>>;
      })
    );
  }

  /**
   * Upload business licence application files to transient storage.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBusinessLicenceLicenceAppIdFilesPost$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiBusinessLicenceLicenceAppIdFilesPost(params: {
    licenceAppId: string;
    body?: {
'Documents'?: Array<Blob>;
'LicenceDocumentTypeCode'?: LicenceDocumentTypeCode;
}
  },
  context?: HttpContext

): Observable<Array<LicenceAppDocumentResponse>> {

    return this.apiBusinessLicenceLicenceAppIdFilesPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<Array<LicenceAppDocumentResponse>>) => r.body as Array<LicenceAppDocumentResponse>)
    );
  }

  /**
   * Path part for operation apiBusinessLicenceChangePost
   */
  static readonly ApiBusinessLicenceChangePostPath = '/api/business-licence/change';

  /**
   * Submit Biz licence update, renew and replace
   * After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBusinessLicenceChangePost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiBusinessLicenceChangePost$Response(params?: {

    /**
     * BizLicAppSubmitRequest data
     */
    body?: BizLicAppChangeRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<BizLicAppCommandResponse>> {

    const rb = new RequestBuilder(this.rootUrl, BizLicensingService.ApiBusinessLicenceChangePostPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<BizLicAppCommandResponse>;
      })
    );
  }

  /**
   * Submit Biz licence update, renew and replace
   * After fe done with the uploading files, then fe do post with json payload, inside payload, it needs to contain an array of keycode for the files.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBusinessLicenceChangePost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiBusinessLicenceChangePost(params?: {

    /**
     * BizLicAppSubmitRequest data
     */
    body?: BizLicAppChangeRequest
  },
  context?: HttpContext

): Observable<BizLicAppCommandResponse> {

    return this.apiBusinessLicenceChangePost$Response(params,context).pipe(
      map((r: StrictHttpResponse<BizLicAppCommandResponse>) => r.body as BizLicAppCommandResponse)
    );
  }

  /**
   * Path part for operation apiBusinessLicenceBizIdApplicationIdMembersGet
   */
  static readonly ApiBusinessLicenceBizIdApplicationIdMembersGetPath = '/api/business-licence/{bizId}/{applicationId}/members';

  /**
   * Get Biz Application controlling members and employees, controlling member includes swl and non-swl.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBusinessLicenceBizIdApplicationIdMembersGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBusinessLicenceBizIdApplicationIdMembersGet$Response(params: {
    bizId: string;
    applicationId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Members>> {

    const rb = new RequestBuilder(this.rootUrl, BizLicensingService.ApiBusinessLicenceBizIdApplicationIdMembersGetPath, 'get');
    if (params) {
      rb.path('bizId', params.bizId, {});
      rb.path('applicationId', params.applicationId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Members>;
      })
    );
  }

  /**
   * Get Biz Application controlling members and employees, controlling member includes swl and non-swl.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBusinessLicenceBizIdApplicationIdMembersGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBusinessLicenceBizIdApplicationIdMembersGet(params: {
    bizId: string;
    applicationId: string;
  },
  context?: HttpContext

): Observable<Members> {

    return this.apiBusinessLicenceBizIdApplicationIdMembersGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<Members>) => r.body as Members)
    );
  }

  /**
   * Path part for operation apiBusinessLicenceBizIdApplicationIdMembersPost
   */
  static readonly ApiBusinessLicenceBizIdApplicationIdMembersPostPath = '/api/business-licence/{bizId}/{applicationId}/members';

  /**
   * Upsert Biz Application controlling members and employees, controlling members include swl and non-swl.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiBusinessLicenceBizIdApplicationIdMembersPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiBusinessLicenceBizIdApplicationIdMembersPost$Response(params: {
    bizId: string;
    applicationId: string;
    body?: Members
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ActionResult>> {

    const rb = new RequestBuilder(this.rootUrl, BizLicensingService.ApiBusinessLicenceBizIdApplicationIdMembersPostPath, 'post');
    if (params) {
      rb.path('bizId', params.bizId, {});
      rb.path('applicationId', params.applicationId, {});
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ActionResult>;
      })
    );
  }

  /**
   * Upsert Biz Application controlling members and employees, controlling members include swl and non-swl.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBusinessLicenceBizIdApplicationIdMembersPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiBusinessLicenceBizIdApplicationIdMembersPost(params: {
    bizId: string;
    applicationId: string;
    body?: Members
  },
  context?: HttpContext

): Observable<ActionResult> {

    return this.apiBusinessLicenceBizIdApplicationIdMembersPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<ActionResult>) => r.body as ActionResult)
    );
  }

}
