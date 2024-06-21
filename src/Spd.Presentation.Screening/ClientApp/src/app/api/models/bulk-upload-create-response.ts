/* tslint:disable */
/* eslint-disable */
import { BulkAppsCreateResponse } from '../models/bulk-apps-create-response';
import { DuplicateCheckResult } from '../models/duplicate-check-result';
import { ValidationErr } from '../models/validation-err';
export interface BulkUploadCreateResponse {
  createResponse?: BulkAppsCreateResponse;
  duplicateCheckResponses?: Array<DuplicateCheckResult> | null;
  validationErrs?: Array<ValidationErr> | null;
}
