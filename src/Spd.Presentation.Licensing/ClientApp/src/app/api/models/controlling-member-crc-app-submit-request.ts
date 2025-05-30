/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { Address } from '../models/address';
import { Alias } from '../models/alias';
import { ApplicationOriginTypeCode } from '../models/application-origin-type-code';
import { ApplicationTypeCode } from '../models/application-type-code';
import { DocumentRelatedInfo } from '../models/document-related-info';
import { GenderCode } from '../models/gender-code';
import { PoliceOfficerRoleCode } from '../models/police-officer-role-code';
import { ServiceTypeCode } from '../models/service-type-code';
export interface ControllingMemberCrcAppSubmitRequest {
  agreeToCompleteAndAccurate?: boolean | null;
  aliases?: Array<Alias> | null;
  applicationOriginTypeCode?: ApplicationOriginTypeCode;
  applicationTypeCode?: ApplicationTypeCode;
  bankruptcyHistoryDetail?: string | null;
  bcDriversLicenceNumber?: string | null;
  bizContactId?: string;
  controllingMemberAppId?: string | null;
  criminalHistoryDetail?: string | null;
  dateOfBirth?: string;
  documentKeyCodes?: Array<string> | null;
  documentRelatedInfos?: Array<DocumentRelatedInfo> | null;
  emailAddress?: string | null;
  genderCode?: GenderCode;
  givenName?: string | null;
  hasBankruptcyHistory?: boolean | null;
  hasBcDriversLicence?: boolean | null;
  hasCourtJudgement?: boolean | null;
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
  serviceTypeCode?: ServiceTypeCode;
  surname?: string | null;
}
