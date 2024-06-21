/* tslint:disable */
/* eslint-disable */
import { ApplicationResponse } from '../models/application-response';
import { PaginationResponse } from '../models/pagination-response';
export interface ApplicationListResponse {
  applications?: Array<ApplicationResponse> | null;
  pagination?: PaginationResponse;
}
