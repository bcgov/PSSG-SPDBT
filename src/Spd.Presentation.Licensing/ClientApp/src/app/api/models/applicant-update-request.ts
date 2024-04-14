/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { AliasResponse } from './alias-response';
import { ApplicationTypeCode } from './application-type-code';
import { GenderEnum } from './gender-enum';
import { PoliceOfficerRoleEnum } from './police-officer-role-enum';
export interface ApplicantUpdateRequest {
  aliases?: null | Array<AliasResponse>;
  applicationTypeCode?: ApplicationTypeCode;
  criminalChargeDescription?: null | string;
  dateOfBirth?: string;
  documentKeyCodes?: null | Array<string>;
  emailAddress?: null | string;
  genderCode?: GenderEnum;
  givenName?: null | string;
  hasCriminalHistory?: null | boolean;
  hasNewCriminalRecordCharge?: null | boolean;
  hasNewMentalHealthCondition?: null | boolean;
  isPoliceOrPeaceOfficer?: null | boolean;
  isTreatedForMHC?: null | boolean;
  licenceId?: null | string;
  mailingAddress?: Address;
  middleName1?: null | string;
  middleName2?: null | string;
  otherOfficerRole?: null | string;
  phoneNumber?: null | string;
  policeOfficerRoleCode?: PoliceOfficerRoleEnum;
  previousDocumentIds?: null | Array<string>;
  residentialAddress?: Address;
  surname?: null | string;
}
