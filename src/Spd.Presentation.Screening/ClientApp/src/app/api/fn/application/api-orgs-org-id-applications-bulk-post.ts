/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { BulkUploadCreateResponse } from '../../models/bulk-upload-create-response';

export interface ApiOrgsOrgIdApplicationsBulkPost$Params {
  orgId: string;
      body?: {
'File'?: Blob;
'RequireDuplicateCheck'?: boolean;
}
}

export function apiOrgsOrgIdApplicationsBulkPost(http: HttpClient, rootUrl: string, params: ApiOrgsOrgIdApplicationsBulkPost$Params, context?: HttpContext): Observable<StrictHttpResponse<BulkUploadCreateResponse>> {
  const rb = new RequestBuilder(rootUrl, apiOrgsOrgIdApplicationsBulkPost.PATH, 'post');
  if (params) {
    rb.path('orgId', params.orgId, {});
    rb.body(params.body, 'multipart/form-data');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<BulkUploadCreateResponse>;
    })
  );
}

apiOrgsOrgIdApplicationsBulkPost.PATH = '/api/orgs/{orgId}/applications/bulk';
