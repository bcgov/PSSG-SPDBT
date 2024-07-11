/* tslint:disable */
/* eslint-disable */
import { ApplicationCreateResult } from '../models/application-create-result';
import { BulkAppsCreateResultCode } from '../models/bulk-apps-create-result-code';
export interface BulkAppsCreateResponse {
  bulkAppsCreateCode?: BulkAppsCreateResultCode;
  createAppResults?: Array<ApplicationCreateResult> | null;
}
