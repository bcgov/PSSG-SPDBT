/* tslint:disable */
/* eslint-disable */
import { BulkHistoryResponse } from '../models/bulk-history-response';
import { PaginationResponse } from '../models/pagination-response';
export interface BulkHistoryListResponse {
  bulkUploadHistorys?: Array<BulkHistoryResponse> | null;
  pagination?: PaginationResponse;
}
