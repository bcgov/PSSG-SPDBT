/* tslint:disable */
/* eslint-disable */
import { Documents } from './documents';
import { PoliceOfficerRoleCode } from './police-officer-role-code';
export interface PoliceBackgroundData {
  documents?: Documents;
  isPoliceOrPeaceOfficer?: boolean;
  otherOfficerRole?: null | string;
  policeOfficerRoleCode?: PoliceOfficerRoleCode;
}
