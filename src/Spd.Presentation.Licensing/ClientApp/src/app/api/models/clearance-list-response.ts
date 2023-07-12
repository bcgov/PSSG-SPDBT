/* tslint:disable */
/* eslint-disable */
import { ClearanceResponse } from './clearance-response';
import { PaginationResponse } from './pagination-response';
export interface ClearanceListResponse {
  clearances?: null | Array<ClearanceResponse>;
  pagination?: PaginationResponse;
}
