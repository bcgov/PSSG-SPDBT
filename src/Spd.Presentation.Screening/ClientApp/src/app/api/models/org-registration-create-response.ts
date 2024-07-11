/* tslint:disable */
/* eslint-disable */
import { OrgProcess } from '../models/org-process';
export interface OrgRegistrationCreateResponse {
  createSuccess?: boolean;
  duplicateFoundIn?: OrgProcess;
  hasPotentialDuplicate?: boolean | null;
  isDuplicateCheckRequired?: boolean;
}
