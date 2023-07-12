/* tslint:disable */
/* eslint-disable */
import { ApplicationCreateResult } from './application-create-result';
import { BulkAppsCreateResultCode } from './bulk-apps-create-result-code';
export interface BulkAppsCreateResponse {
  bulkAppsCreateCode?: BulkAppsCreateResultCode;
  createAppResults?: null | Array<ApplicationCreateResult>;
}
