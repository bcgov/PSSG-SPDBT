/* tslint:disable */
/* eslint-disable */
export interface DuplicateCheckResult {
  firstName?: string | null;
  hasPotentialDuplicate?: boolean;
  hasPotentialDuplicateInDb?: boolean;
  hasPotentialDuplicateInTsv?: boolean;
  lastName?: string | null;
  lineNumber?: number;
  msg?: string | null;
}
