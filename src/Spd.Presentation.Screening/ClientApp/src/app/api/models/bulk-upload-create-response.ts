/* tslint:disable */
/* eslint-disable */
import { BulkAppsCreateResponse } from './bulk-apps-create-response';
import { DuplicateCheckResult } from './duplicate-check-result';
import { ValidationErr } from './validation-err';
export interface BulkUploadCreateResponse {
  createResponse?: BulkAppsCreateResponse;
  duplicateCheckResponses?: null | Array<DuplicateCheckResult>;
  validationErrs?: null | Array<ValidationErr>;
}
