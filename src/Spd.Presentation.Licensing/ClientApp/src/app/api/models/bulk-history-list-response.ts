/* tslint:disable */
/* eslint-disable */
import { BulkHistoryResponse } from './bulk-history-response';
import { PaginationResponse } from './pagination-response';
export interface BulkHistoryListResponse {
  bulkUploadHistorys?: null | Array<BulkHistoryResponse>;
  pagination?: PaginationResponse;
}
