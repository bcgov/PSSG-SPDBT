/* tslint:disable */
/* eslint-disable */
import { ApplicationResponse } from './application-response';
import { PaginationResponse } from './pagination-response';
export interface ApplicationListResponse {
  applications?: null | Array<ApplicationResponse>;
  followUpBusinessDays?: null | number;
  pagination?: PaginationResponse;
}
