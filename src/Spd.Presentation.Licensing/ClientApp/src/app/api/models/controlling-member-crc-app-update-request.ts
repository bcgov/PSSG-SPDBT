/* tslint:disable */
/* eslint-disable */
import { Address } from '../models/address';
import { DocumentExpiredInfo } from '../models/document-expired-info';
import { GenderCode } from '../models/gender-code';
import { PoliceOfficerRoleCode } from '../models/police-officer-role-code';
export interface ControllingMemberCrcAppUpdateRequest {
  agreeToCompleteAndAccurate?: boolean | null;
  applicantId?: string | null;
  bizContactId?: string;
  controllingMemberAppId?: string | null;
  criminalHistoryDetail?: string | null;
  documentExpiredInfos?: Array<DocumentExpiredInfo> | null;
  documentKeyCodes?: Array<string> | null;
  emailAddress?: string | null;
  genderCode?: GenderCode;
  givenName?: string | null;
  hasCriminalHistory?: boolean | null;
  hasLegalNameChanged?: boolean | null;
  hasNewCriminalRecordCharge?: boolean | null;
  hasNewMentalHealthCondition?: boolean | null;
  inviteId?: string;
  isPoliceOrPeaceOfficer?: boolean | null;
  isTreatedForMHC?: boolean | null;
  middleName1?: string | null;
  middleName2?: string | null;
  otherOfficerRole?: string | null;
  parentBizLicApplicationId?: string | null;
  phoneNumber?: string | null;
  policeOfficerRoleCode?: PoliceOfficerRoleCode;
  previousDocumentIds?: Array<string> | null;
  residentialAddress?: Address;
  surname?: string | null;
}
