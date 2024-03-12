/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { Alias } from './alias';
import { Document } from './document';
import { GenderEnum } from './gender-enum';
import { IdentityProviderTypeCode } from './identity-provider-type-code';
import { PoliceOfficerRoleEnum } from './police-officer-role-enum';
export interface ApplicantProfileResponse {
  aliases?: null | Array<Alias>;
  applicantId?: string;
  criminalChargeDescription?: null | string;
  dateOfBirth?: string;
  documentInfos?: null | Array<Document>;
  emailAddress?: null | string;
  genderCode?: GenderEnum;
  givenName?: null | string;
  hasCriminalHistory?: null | boolean;
  hasNewCriminalRecordCharge?: null | boolean;
  identityProviderTypeCode?: IdentityProviderTypeCode;
  isPoliceOrPeaceOfficer?: null | boolean;
  isTreatedForMHC?: null | boolean;
  mailingAddress?: Address;
  middleName1?: null | string;
  middleName2?: null | string;
  otherOfficerRole?: null | string;
  phoneNumber?: null | string;
  policeOfficerRoleCode?: PoliceOfficerRoleEnum;
  residentialAddress?: Address;
  sub?: null | string;
  surname?: null | string;
}
