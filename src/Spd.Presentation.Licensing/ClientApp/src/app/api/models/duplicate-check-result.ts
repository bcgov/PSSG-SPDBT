/* tslint:disable */
/* eslint-disable */
export interface DuplicateCheckResult {
  firstName?: null | string;
  hasPotentialDuplicate?: boolean;
  hasPotentialDuplicateInDb?: boolean;
  hasPotentialDuplicateInTsv?: boolean;
  lastName?: null | string;
  lineNumber?: number;
  msg?: null | string;
}
