/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ApiConfiguration } from '../api-configuration';
import { BaseService } from '../base-service';
import { RequestBuilder } from '../request-builder';
import { StrictHttpResponse } from '../strict-http-response';

import { OrgRegistrationCreateRequest } from '../models/org-registration-create-request';

@Injectable({
	providedIn: 'root',
})
export class OrgRegistrationService extends BaseService {
	constructor(config: ApiConfiguration, http: HttpClient) {
		super(config, http);
	}

	/**
	 * Path part for operation apiOrgRegistrationsPost
	 */
	static readonly ApiOrgRegistrationsPostPath = '/api/org-registrations';

	/**
	 * This method provides access to the full `HttpResponse`, allowing access to response headers.
	 * To access only the response body, use `apiOrgRegistrationsPost()` instead.
	 *
	 * This method sends `application/*+json` and handles request body of type `application/*+json`.
	 */
	apiOrgRegistrationsPost$Response(params: {
		context?: HttpContext;
		body: OrgRegistrationCreateRequest;
	}): Observable<StrictHttpResponse<void>> {
		const rb = new RequestBuilder(this.rootUrl, OrgRegistrationService.ApiOrgRegistrationsPostPath, 'post');
		if (params) {
			rb.body(params.body, 'application/*+json');
		}

		return this.http
			.request(
				rb.build({
					responseType: 'text',
					accept: '*/*',
					context: params?.context,
				})
			)
			.pipe(
				filter((r: any) => r instanceof HttpResponse),
				map((r: HttpResponse<any>) => {
					return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
				})
			);
	}

	/**
	 * This method provides access to only to the response body.
	 * To access the full response (for headers, for example), `apiOrgRegistrationsPost$Response()` instead.
	 *
	 * This method sends `application/*+json` and handles request body of type `application/*+json`.
	 */
	apiOrgRegistrationsPost(params: { context?: HttpContext; body: OrgRegistrationCreateRequest }): Observable<void> {
		return this.apiOrgRegistrationsPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
	}
}
