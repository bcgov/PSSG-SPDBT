/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { OrgProcess } from '../models/org-process';
export interface OrgRegistrationCreateResponse {
  createSuccess?: boolean;
  duplicateFoundIn?: OrgProcess;
  hasPotentialDuplicate?: boolean | null;
  isDuplicateCheckRequired?: boolean;
}
