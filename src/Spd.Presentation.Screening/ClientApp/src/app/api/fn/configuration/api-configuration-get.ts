/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ConfigurationResponse } from '../../models/configuration-response';

export interface ApiConfigurationGet$Params {
}

export function apiConfigurationGet(http: HttpClient, rootUrl: string, params?: ApiConfigurationGet$Params, context?: HttpContext): Observable<StrictHttpResponse<ConfigurationResponse>> {
  const rb = new RequestBuilder(rootUrl, apiConfigurationGet.PATH, 'get');
  if (params) {
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<ConfigurationResponse>;
    })
  );
}

apiConfigurationGet.PATH = '/api/configuration';
