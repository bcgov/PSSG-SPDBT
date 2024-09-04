/* tslint:disable */
/* eslint-disable */
import { Address } from '../models/address';
import { Alias } from '../models/alias';
import { ApplicationTypeCode } from '../models/application-type-code';
import { BizTypeCode } from '../models/biz-type-code';
import { Document } from '../models/document';
import { GenderCode } from '../models/gender-code';
import { LicenceTermCode } from '../models/licence-term-code';
import { PoliceOfficerRoleCode } from '../models/police-officer-role-code';
import { WorkerLicenceTypeCode } from '../models/worker-licence-type-code';
export interface ControllingMemberCrcAppUpsertRequest {
  agreeToCompleteAndAccurate?: boolean | null;
  aliases?: Array<Alias> | null;
  applicantId?: string;
  applicationTypeCode?: ApplicationTypeCode;
  bankruptcyHistoryDetail?: string | null;
  bcDriversLicenceNumber?: string | null;
  bizContactId?: string;
  bizTypeCode?: BizTypeCode;
  controllingMemberAppId?: string | null;
  criminalHistoryDetail?: string | null;
  dateOfBirth?: string;
  documentInfos?: Array<Document> | null;
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
  licenceTermCode?: LicenceTermCode;
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
