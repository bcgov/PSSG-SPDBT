/* tslint:disable */
/* eslint-disable */
import { Address } from '../models/address';
import { Alias } from '../models/alias';
import { ApplicationOriginTypeCode } from '../models/application-origin-type-code';
import { ApplicationTypeCode } from '../models/application-type-code';
import { Document } from '../models/document';
import { DocumentExpiredInfo } from '../models/document-expired-info';
import { GenderCode } from '../models/gender-code';
import { PoliceOfficerRoleCode } from '../models/police-officer-role-code';
import { WorkerLicenceTypeCode } from '../models/worker-licence-type-code';
export interface ControllingMemberCrcAppUpsertRequest {
  agreeToCompleteAndAccurate?: boolean | null;
  aliases?: Array<Alias> | null;
  applicantId?: string | null;
  applicationOriginTypeCode?: ApplicationOriginTypeCode;
  applicationTypeCode?: ApplicationTypeCode;
  bankruptcyHistoryDetail?: string | null;
  bcDriversLicenceNumber?: string | null;
  bizContactId?: string;
  controllingMemberAppId?: string | null;
  criminalHistoryDetail?: string | null;
  dateOfBirth?: string;
  documentExpiredInfos?: Array<DocumentExpiredInfo> | null;
  documentInfos?: Array<Document> | null;
  emailAddress?: string | null;
  genderCode?: GenderCode;
  givenName?: string | null;
  hasBankruptcyHistory?: boolean | null;
  hasBcDriversLicence?: boolean | null;
  hasCriminalHistory?: boolean | null;
  hasPreviousName?: boolean | null;
  inviteId?: string;
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
