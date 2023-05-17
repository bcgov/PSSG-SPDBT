/* tslint:disable */
/* eslint-disable */
import { DuplicateCheckResult } from './duplicate-check-result';
import { ValidationErr } from './validation-err';
export interface BulkUploadCreateResponse {
  duplicateCheckResponses?: null | Array<DuplicateCheckResult>;
  validationErrs?: null | Array<ValidationErr>;
}
