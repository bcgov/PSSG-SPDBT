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

import { MentalHealthUpsertRequest } from '../models/mental-health-upsert-request';
import { PhotographOfYourselfUpsertRequest } from '../models/photograph-of-yourself-upsert-request';
import { PoliceBackgroundUpsertRequest } from '../models/police-background-upsert-request';
import { ProofOfFingerprintUpsertRequest } from '../models/proof-of-fingerprint-upsert-request';
import { WorkerLicenceResponse } from '../models/worker-licence-response';
import { WorkerLicenceUpsertRequest } from '../models/worker-licence-upsert-request';
import { WorkerLicenceUpsertResponse } from '../models/worker-licence-upsert-response';

@Injectable({
  providedIn: 'root',
})
export class WorkerLicensingService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation apiWorkerLicenceApplicationsPost
   */
  static readonly ApiWorkerLicenceApplicationsPostPath = '/api/worker-licence-applications';

  /**
   * Create Security Worker Licence Application.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiWorkerLicenceApplicationsPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiWorkerLicenceApplicationsPost$Response(params: {
    body: WorkerLicenceUpsertRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<WorkerLicenceUpsertResponse>> {

    const rb = new RequestBuilder(this.rootUrl, WorkerLicensingService.ApiWorkerLicenceApplicationsPostPath, 'post');
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
        return r as StrictHttpResponse<WorkerLicenceUpsertResponse>;
      })
    );
  }

  /**
   * Create Security Worker Licence Application.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiWorkerLicenceApplicationsPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiWorkerLicenceApplicationsPost(params: {
    body: WorkerLicenceUpsertRequest
  },
  context?: HttpContext

): Observable<WorkerLicenceUpsertResponse> {

    return this.apiWorkerLicenceApplicationsPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<WorkerLicenceUpsertResponse>) => r.body as WorkerLicenceUpsertResponse)
    );
  }

  /**
   * Path part for operation apiWorkerLicenceApplicationsIdGet
   */
  static readonly ApiWorkerLicenceApplicationsIdGetPath = '/api/worker-licence-applications/{id}';

  /**
   * Create Security Worker Licence Application.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiWorkerLicenceApplicationsIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiWorkerLicenceApplicationsIdGet$Response(params: {
    id: string;
  },
  context?: HttpContext

): Observable<StrictHttpResponse<WorkerLicenceResponse>> {

    const rb = new RequestBuilder(this.rootUrl, WorkerLicensingService.ApiWorkerLicenceApplicationsIdGetPath, 'get');
    if (params) {
      rb.path('id', params.id, {"style":"simple"});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<WorkerLicenceResponse>;
      })
    );
  }

  /**
   * Create Security Worker Licence Application.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiWorkerLicenceApplicationsIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiWorkerLicenceApplicationsIdGet(params: {
    id: string;
  },
  context?: HttpContext

): Observable<WorkerLicenceResponse> {

    return this.apiWorkerLicenceApplicationsIdGet$Response(params,context).pipe(
      map((r: StrictHttpResponse<WorkerLicenceResponse>) => r.body as WorkerLicenceResponse)
    );
  }

  /**
   * Path part for operation apiWorkerLicencesPoliceBackgroungPost
   */
  static readonly ApiWorkerLicencesPoliceBackgroungPostPath = '/api/worker-licences-police-backgroung';

  /**
   * Create Security Worker Licence Application police background.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiWorkerLicencesPoliceBackgroungPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiWorkerLicencesPoliceBackgroungPost$Response(params: {
    body: PoliceBackgroundUpsertRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<WorkerLicenceUpsertResponse>> {

    const rb = new RequestBuilder(this.rootUrl, WorkerLicensingService.ApiWorkerLicencesPoliceBackgroungPostPath, 'post');
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
        return r as StrictHttpResponse<WorkerLicenceUpsertResponse>;
      })
    );
  }

  /**
   * Create Security Worker Licence Application police background.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiWorkerLicencesPoliceBackgroungPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiWorkerLicencesPoliceBackgroungPost(params: {
    body: PoliceBackgroundUpsertRequest
  },
  context?: HttpContext

): Observable<WorkerLicenceUpsertResponse> {

    return this.apiWorkerLicencesPoliceBackgroungPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<WorkerLicenceUpsertResponse>) => r.body as WorkerLicenceUpsertResponse)
    );
  }

  /**
   * Path part for operation apiWorkerLicencesMentalHealthPost
   */
  static readonly ApiWorkerLicencesMentalHealthPostPath = '/api/worker-licences-mental-health';

  /**
   * Create Security Worker Licence Application mental health.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiWorkerLicencesMentalHealthPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiWorkerLicencesMentalHealthPost$Response(params: {
    body: MentalHealthUpsertRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<WorkerLicenceUpsertResponse>> {

    const rb = new RequestBuilder(this.rootUrl, WorkerLicensingService.ApiWorkerLicencesMentalHealthPostPath, 'post');
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
        return r as StrictHttpResponse<WorkerLicenceUpsertResponse>;
      })
    );
  }

  /**
   * Create Security Worker Licence Application mental health.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiWorkerLicencesMentalHealthPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiWorkerLicencesMentalHealthPost(params: {
    body: MentalHealthUpsertRequest
  },
  context?: HttpContext

): Observable<WorkerLicenceUpsertResponse> {

    return this.apiWorkerLicencesMentalHealthPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<WorkerLicenceUpsertResponse>) => r.body as WorkerLicenceUpsertResponse)
    );
  }

  /**
   * Path part for operation apiWorkerLicencesFingerprintPost
   */
  static readonly ApiWorkerLicencesFingerprintPostPath = '/api/worker-licences-fingerprint';

  /**
   * Create Security Worker Licence Application fingerprint.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiWorkerLicencesFingerprintPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiWorkerLicencesFingerprintPost$Response(params: {
    body: ProofOfFingerprintUpsertRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<WorkerLicenceUpsertResponse>> {

    const rb = new RequestBuilder(this.rootUrl, WorkerLicensingService.ApiWorkerLicencesFingerprintPostPath, 'post');
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
        return r as StrictHttpResponse<WorkerLicenceUpsertResponse>;
      })
    );
  }

  /**
   * Create Security Worker Licence Application fingerprint.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiWorkerLicencesFingerprintPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiWorkerLicencesFingerprintPost(params: {
    body: ProofOfFingerprintUpsertRequest
  },
  context?: HttpContext

): Observable<WorkerLicenceUpsertResponse> {

    return this.apiWorkerLicencesFingerprintPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<WorkerLicenceUpsertResponse>) => r.body as WorkerLicenceUpsertResponse)
    );
  }

  /**
   * Path part for operation apiWorkerLicencesPhotographOfYourselfPost
   */
  static readonly ApiWorkerLicencesPhotographOfYourselfPostPath = '/api/worker-licences-photograph-of-yourself';

  /**
   * Create Security Worker Licence Application PhotographOfYourself.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiWorkerLicencesPhotographOfYourselfPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiWorkerLicencesPhotographOfYourselfPost$Response(params: {
    body: PhotographOfYourselfUpsertRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<WorkerLicenceUpsertResponse>> {

    const rb = new RequestBuilder(this.rootUrl, WorkerLicensingService.ApiWorkerLicencesPhotographOfYourselfPostPath, 'post');
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
        return r as StrictHttpResponse<WorkerLicenceUpsertResponse>;
      })
    );
  }

  /**
   * Create Security Worker Licence Application PhotographOfYourself.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiWorkerLicencesPhotographOfYourselfPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiWorkerLicencesPhotographOfYourselfPost(params: {
    body: PhotographOfYourselfUpsertRequest
  },
  context?: HttpContext

): Observable<WorkerLicenceUpsertResponse> {

    return this.apiWorkerLicencesPhotographOfYourselfPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<WorkerLicenceUpsertResponse>) => r.body as WorkerLicenceUpsertResponse)
    );
  }

  /**
   * Path part for operation apiAnonymousWorkerLicencesPost
   */
  static readonly ApiAnonymousWorkerLicencesPostPath = '/api/anonymous-worker-licences';

  /**
   * Create Security Worker Licence Application Anonymously.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiAnonymousWorkerLicencesPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiAnonymousWorkerLicencesPost$Response(params: {
    body: WorkerLicenceUpsertRequest
  },
  context?: HttpContext

): Observable<StrictHttpResponse<WorkerLicenceUpsertResponse>> {

    const rb = new RequestBuilder(this.rootUrl, WorkerLicensingService.ApiAnonymousWorkerLicencesPostPath, 'post');
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
        return r as StrictHttpResponse<WorkerLicenceUpsertResponse>;
      })
    );
  }

  /**
   * Create Security Worker Licence Application Anonymously.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiAnonymousWorkerLicencesPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  apiAnonymousWorkerLicencesPost(params: {
    body: WorkerLicenceUpsertRequest
  },
  context?: HttpContext

): Observable<WorkerLicenceUpsertResponse> {

    return this.apiAnonymousWorkerLicencesPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<WorkerLicenceUpsertResponse>) => r.body as WorkerLicenceUpsertResponse)
    );
  }

}
