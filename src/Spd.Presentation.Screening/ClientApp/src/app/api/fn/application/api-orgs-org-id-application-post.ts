/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ApplicationCreateResponse } from '../../models/application-create-response';

export interface ApiOrgsOrgIdApplicationPost$Params {

/**
 * organizationId
 */
  orgId: string;
      body: {

/**
 * PDF, Microsoft Word .docx/.doc files only
 */
'ConsentFormFile'?: Blob;

/**
 * See ApplicationCreateRequest schema
 */
'ApplicationCreateRequestJson'?: {
'orgId'?: string;
'givenName'?: string | null;
'middleName1'?: string | null;
'middleName2'?: string | null;
'surname'?: string | null;
'emailAddress'?: string | null;
'jobTitle'?: string | null;
'genderCode'?: string | null;
'dateOfBirth'?: string | null;
'contractedCompanyName'?: string | null;
'phoneNumber'?: string | null;
'driversLicense'?: string | null;
'birthPlace'?: string | null;
'addressLine1'?: string | null;
'addressLine2'?: string | null;
'city'?: string | null;
'postalCode'?: string | null;
'province'?: string | null;
'country'?: string | null;
'oneLegalName'?: boolean | null;
'agreeToCompleteAndAccurate'?: boolean | null;
'haveVerifiedIdentity'?: boolean | null;
'requireDuplicateCheck'?: boolean;
'aliases'?: Array<{
'givenName'?: string | null;
'middleName1'?: string | null;
'middleName2'?: string | null;
'surname'?: string | null;
}>;
'originTypeCode'?: string;
'payeeType'?: string;
'screeningType'?: string;
'serviceType'?: string;
'employeeId'?: string | null;
};
}
}

export function apiOrgsOrgIdApplicationPost(http: HttpClient, rootUrl: string, params: ApiOrgsOrgIdApplicationPost$Params, context?: HttpContext): Observable<StrictHttpResponse<ApplicationCreateResponse>> {
  const rb = new RequestBuilder(rootUrl, apiOrgsOrgIdApplicationPost.PATH, 'post');
  if (params) {
    rb.path('orgId', params.orgId, {});
    rb.body(params.body, 'multipart/form-data');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<ApplicationCreateResponse>;
    })
  );
}

apiOrgsOrgIdApplicationPost.PATH = '/api/orgs/{orgId}/application';
