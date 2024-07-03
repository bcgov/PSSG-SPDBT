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
import { BizLicAppCommandResponse } from '../models/biz-lic-app-command-response';
import { BizLicAppResponse } from '../models/biz-lic-app-response';
import { BizLicAppSubmitRequest } from '../models/biz-lic-app-submit-request';
import { BizLicAppUpsertRequest } from '../models/biz-lic-app-upsert-request';
import { LicenceAppDocumentResponse } from '../models/licence-app-document-response';
import { LicenceDocumentTypeCode } from '../models/licence-document-type-code';
import { Members } from '../models/members';
import { MembersRequest } from '../models/members-request';

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
   * Path part for operation apiBusinessLicenceApplicationLicenceAppIdGet
   */
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
  apiBusinessLicenceApplicationLicenceAppIdGet$Response(params: {
    licenceAppId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<BizLicAppResponse>> {

    const rb = new RequestBuilder(this.rootUrl, BizLicensingService.ApiBusinessLicenceApplicationLicenceAppIdGetPath, 'get');
    if (params) {
      rb.path('licenceAppId', params.licenceAppId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<BizLicAppResponse>;
      })
    );
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
  apiBusinessLicenceApplicationLicenceAppIdGet(params: {
    licenceAppId: string;
  },
  context?: HttpContext

): Observable<BizLicAppResponse> {

    return this.apiBusinessLicenceApplicationLicenceAppIdGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<BizLicAppResponse>) => r.body as BizLicAppResponse)
    );
  }

  /**
   * Path part for operation apiBusinessBizIdAppLatestGet
   */
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
  apiBusinessBizIdAppLatestGet$Response(params: {
    bizId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<BizLicAppResponse>> {

    const rb = new RequestBuilder(this.rootUrl, BizLicensingService.ApiBusinessBizIdAppLatestGetPath, 'get');
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
        return r as StrictHttpResponse<BizLicAppResponse>;
      })
    );
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
  apiBusinessBizIdAppLatestGet(params: {
    bizId: string;
  },
  context?: HttpContext

): Observable<BizLicAppResponse> {

    return this.apiBusinessBizIdAppLatestGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<BizLicAppResponse>) => r.body as BizLicAppResponse)
    );
  }

  /**
   * Path part for operation apiBusinessLicenceApplicationPost
   */
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
  apiBusinessLicenceApplicationPost$Response(params: {
    body: BizLicAppUpsertRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<BizLicAppCommandResponse>> {

    const rb = new RequestBuilder(this.rootUrl, BizLicensingService.ApiBusinessLicenceApplicationPostPath, 'post');
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
   * To access the full response (for headers, for example), `apiBusinessLicenceApplicationPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiBusinessLicenceApplicationPost(params: {
    body: BizLicAppUpsertRequest
  },
  context?: HttpContext

): Observable<BizLicAppCommandResponse> {

    return this.apiBusinessLicenceApplicationPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<BizLicAppCommandResponse>) => r.body as BizLicAppCommandResponse)
    );
  }

  /**
   * Path part for operation apiBusinessLicenceApplicationLicenceAppIdFilesPost
   */
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
  apiBusinessLicenceApplicationLicenceAppIdFilesPost$Response(params: {
    licenceAppId: string;
    body?: {
'Documents'?: Array<Blob>;
'LicenceDocumentTypeCode'?: LicenceDocumentTypeCode;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Array<LicenceAppDocumentResponse>>> {

    const rb = new RequestBuilder(this.rootUrl, BizLicensingService.ApiBusinessLicenceApplicationLicenceAppIdFilesPostPath, 'post');
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
   * To access the full response (for headers, for example), `apiBusinessLicenceApplicationLicenceAppIdFilesPost$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiBusinessLicenceApplicationLicenceAppIdFilesPost(params: {
    licenceAppId: string;
    body?: {
'Documents'?: Array<Blob>;
'LicenceDocumentTypeCode'?: LicenceDocumentTypeCode;
}
  },
  context?: HttpContext

): Observable<Array<LicenceAppDocumentResponse>> {

    return this.apiBusinessLicenceApplicationLicenceAppIdFilesPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<Array<LicenceAppDocumentResponse>>) => r.body as Array<LicenceAppDocumentResponse>)
    );
  }

  /**
   * Path part for operation apiBusinessLicenceApplicationChangePost
   */
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
  apiBusinessLicenceApplicationChangePost$Response(params?: {

    /**
     * BizLicAppSubmitRequest data
     */
    body?: BizLicAppSubmitRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<BizLicAppCommandResponse>> {

    const rb = new RequestBuilder(this.rootUrl, BizLicensingService.ApiBusinessLicenceApplicationChangePostPath, 'post');
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
   * To access the full response (for headers, for example), `apiBusinessLicenceApplicationChangePost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiBusinessLicenceApplicationChangePost(params?: {

    /**
     * BizLicAppSubmitRequest data
     */
    body?: BizLicAppSubmitRequest
  },
  context?: HttpContext

): Observable<BizLicAppCommandResponse> {

    return this.apiBusinessLicenceApplicationChangePost$Response(params,context).pipe(
      map((r: StrictHttpResponse<BizLicAppCommandResponse>) => r.body as BizLicAppCommandResponse)
    );
  }

  /**
   * Path part for operation apiBusinessLicenceApplicationBizIdMembersGet
   */
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
  apiBusinessLicenceApplicationBizIdMembersGet$Response(params: {
    bizId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Members>> {

    const rb = new RequestBuilder(this.rootUrl, BizLicensingService.ApiBusinessLicenceApplicationBizIdMembersGetPath, 'get');
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
        return r as StrictHttpResponse<Members>;
      })
    );
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
  apiBusinessLicenceApplicationBizIdMembersGet(params: {
    bizId: string;
  },
  context?: HttpContext

): Observable<Members> {

    return this.apiBusinessLicenceApplicationBizIdMembersGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<Members>) => r.body as Members)
    );
  }

  /**
   * Path part for operation apiBusinessLicenceApplicationBizIdMembersPost
   */
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
  apiBusinessLicenceApplicationBizIdMembersPost$Response(params: {
    bizId: string;
    body?: MembersRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<ActionResult>> {

    const rb = new RequestBuilder(this.rootUrl, BizLicensingService.ApiBusinessLicenceApplicationBizIdMembersPostPath, 'post');
    if (params) {
      rb.path('bizId', params.bizId, {});
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
   * To access the full response (for headers, for example), `apiBusinessLicenceApplicationBizIdMembersPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiBusinessLicenceApplicationBizIdMembersPost(params: {
    bizId: string;
    body?: MembersRequest
  },
  context?: HttpContext

): Observable<ActionResult> {

    return this.apiBusinessLicenceApplicationBizIdMembersPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<ActionResult>) => r.body as ActionResult)
    );
  }

  /**
   * Path part for operation apiBusinessLicenceApplicationFilesPost
   */
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
  apiBusinessLicenceApplicationFilesPost$Response(params?: {
    body?: {
'Documents'?: Array<Blob>;
'LicenceDocumentTypeCode'?: LicenceDocumentTypeCode;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<string>> {

    const rb = new RequestBuilder(this.rootUrl, BizLicensingService.ApiBusinessLicenceApplicationFilesPostPath, 'post');
    if (params) {
      rb.body(params.body, 'multipart/form-data');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<string>;
      })
    );
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
  apiBusinessLicenceApplicationFilesPost(params?: {
    body?: {
'Documents'?: Array<Blob>;
'LicenceDocumentTypeCode'?: LicenceDocumentTypeCode;
}
  },
  context?: HttpContext

): Observable<string> {

    return this.apiBusinessLicenceApplicationFilesPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<string>) => r.body as string)
    );
  }

  /**
   * Path part for operation apiBusinessLicenceApplicationSubmitPost
   */
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
  apiBusinessLicenceApplicationSubmitPost$Response(params: {
    body: BizLicAppUpsertRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<BizLicAppCommandResponse>> {

    const rb = new RequestBuilder(this.rootUrl, BizLicensingService.ApiBusinessLicenceApplicationSubmitPostPath, 'post');
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
   * Submit Business Licence Application.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBusinessLicenceApplicationSubmitPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiBusinessLicenceApplicationSubmitPost(params: {
    body: BizLicAppUpsertRequest
  },
  context?: HttpContext

): Observable<BizLicAppCommandResponse> {

    return this.apiBusinessLicenceApplicationSubmitPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<BizLicAppCommandResponse>) => r.body as BizLicAppCommandResponse)
    );
  }

  /**
   * Path part for operation apiBusinessLicenceApplicationBrandImageDocumentIdGet
   */
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
  apiBusinessLicenceApplicationBrandImageDocumentIdGet$Response(params: {
    documentId: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<Blob>> {

    const rb = new RequestBuilder(this.rootUrl, BizLicensingService.ApiBusinessLicenceApplicationBrandImageDocumentIdGetPath, 'get');
    if (params) {
      rb.path('documentId', params.documentId, {});
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
   * Get biz brand image from its documentId.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiBusinessLicenceApplicationBrandImageDocumentIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiBusinessLicenceApplicationBrandImageDocumentIdGet(params: {
    documentId: string;
  },
  context?: HttpContext

): Observable<Blob> {

    return this.apiBusinessLicenceApplicationBrandImageDocumentIdGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<Blob>) => r.body as Blob)
    );
  }

}
