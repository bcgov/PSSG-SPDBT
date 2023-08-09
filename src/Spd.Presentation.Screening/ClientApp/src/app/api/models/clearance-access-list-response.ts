/* tslint:disable */
/* eslint-disable */
import { ClearanceAccessResponse } from './clearance-access-response';
import { PaginationResponse } from './pagination-response';
export interface ClearanceAccessListResponse {
  clearances?: null | Array<ClearanceAccessResponse>;
  pagination?: PaginationResponse;
}
