/* tslint:disable */
/* eslint-disable */
import { OrgProcess } from './org-process';
export interface OrgRegistrationCreateResponse {
  createSuccess?: boolean;
  duplicateFoundIn?: OrgProcess;
  hasPotentialDuplicate?: null | boolean;
  isDuplicateCheckRequired?: boolean;
}
