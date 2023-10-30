/* tslint:disable */
/* eslint-disable */
import { Documents } from './documents';
import { PoliceOfficerRoleCode } from './police-officer-role-code';
export interface PoliceBackgroundUpsertRequest {
  documents?: Documents;
  isPoliceOrPeaceOfficer?: boolean;
  licenceApplicationId?: string;
  otherOfficerRole?: null | string;
  policeOfficerRoleCode?: PoliceOfficerRoleCode;
}
