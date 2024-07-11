/* tslint:disable */
/* eslint-disable */
import { ClearanceAccessResponse } from '../models/clearance-access-response';
import { PaginationResponse } from '../models/pagination-response';
export interface ClearanceAccessListResponse {
  clearances?: Array<ClearanceAccessResponse> | null;
  pagination?: PaginationResponse;
}
