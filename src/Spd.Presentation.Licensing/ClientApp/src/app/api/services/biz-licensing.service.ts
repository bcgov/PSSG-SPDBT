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

import { BizLicAppChangeRequest } from '../models/biz-lic-app-change-request';
import { BizLicAppCommandResponse } from '../models/biz-lic-app-command-response';
import { BizLicAppUpsertRequest } from '../models/biz-lic-app-upsert-request';
import { LicenceAppDocumentResponse } from '../models/licence-app-document-response';
import { LicenceDocumentTypeCode } from '../models/licence-document-type-code';
import { Unit } from '../models/unit';

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

): Observable<StrictHttpResponse<Unit>> {

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
        return r as StrictHttpResponse<Unit>;
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

): Observable<Unit> {

    return this.apiBusinessLicencePost$Response(params,context).pipe(
      map((r: StrictHttpResponse<Unit>) => r.body as Unit)
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

}
