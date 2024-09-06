/* tslint:disable */
/* eslint-disable */
import { Address } from '../models/address';
import { Alias } from '../models/alias';
import { ApplicationTypeCode } from '../models/application-type-code';
import { DocumentExpiredInfo } from '../models/document-expired-info';
import { GenderCode } from '../models/gender-code';
import { PoliceOfficerRoleCode } from '../models/police-officer-role-code';
import { WorkerLicenceTypeCode } from '../models/worker-licence-type-code';
export interface ControllingMemberCrcAppSubmitRequest {
  agreeToCompleteAndAccurate?: boolean | null;
  aliases?: Array<Alias> | null;
  applicationTypeCode?: ApplicationTypeCode;
  bankruptcyHistoryDetail?: string | null;
  bcDriversLicenceNumber?: string | null;
  bizContactId?: string;
  criminalHistoryDetail?: string | null;
  dateOfBirth?: string;
  documentExpiredInfos?: Array<DocumentExpiredInfo> | null;
  documentKeyCodes?: Array<string> | null;
  emailAddress?: string | null;
  genderCode?: GenderCode;
  givenName?: string | null;
  hasBankruptcyHistory?: boolean | null;
  hasBcDriversLicence?: boolean | null;
  hasCriminalHistory?: boolean | null;
  hasPreviousNames?: boolean | null;
  isCanadianCitizen?: boolean | null;
  isPoliceOrPeaceOfficer?: boolean | null;
  isTreatedForMHC?: boolean | null;
  middleName1?: string | null;
  middleName2?: string | null;
  otherOfficerRole?: string | null;
  parentBizLicApplicationId?: string | null;
  phoneNumber?: string | null;
  policeOfficerRoleCode?: PoliceOfficerRoleCode;
  residentialAddress?: Address;
  surname?: string | null;
  workerLicenceTypeCode?: WorkerLicenceTypeCode;
}
