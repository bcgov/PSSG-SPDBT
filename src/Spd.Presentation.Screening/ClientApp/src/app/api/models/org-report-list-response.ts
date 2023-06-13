/* tslint:disable */
/* eslint-disable */
import { OrgReportResponse } from './org-report-response';
import { PaginationResponse } from './pagination-response';
export interface OrgReportListResponse {
  pagination?: PaginationResponse;
  reports?: null | Array<OrgReportResponse>;
}
