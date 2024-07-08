/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { GoogleRecaptcha } from '../../models/google-recaptcha';
import { LicenceResponse } from '../../models/licence-response';

export interface ApiLicenceLookupAnonymousLicenceNumberPost$Params {
  licenceNumber: string;
  accessCode?: string;
  isLatestInactive?: boolean;
      body?: GoogleRecaptcha
}

export function apiLicenceLookupAnonymousLicenceNumberPost(http: HttpClient, rootUrl: string, params: ApiLicenceLookupAnonymousLicenceNumberPost$Params, context?: HttpContext): Observable<StrictHttpResponse<LicenceResponse>> {
  const rb = new RequestBuilder(rootUrl, apiLicenceLookupAnonymousLicenceNumberPost.PATH, 'post');
  if (params) {
    rb.path('licenceNumber', params.licenceNumber, {});
    rb.query('accessCode', params.accessCode, {});
    rb.query('isLatestInactive', params.isLatestInactive, {});
    rb.body(params.body, 'application/*+json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<LicenceResponse>;
    })
  );
}

apiLicenceLookupAnonymousLicenceNumberPost.PATH = '/api/licence-lookup/anonymous/{licenceNumber}';
