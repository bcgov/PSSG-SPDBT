/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { Alias } from './alias';
import { GenderEnum } from './gender-enum';
import { PoliceOfficerRoleEnum } from './police-officer-role-enum';
export interface ApplicantUpdateRequest {
  aliases?: null | Array<Alias>;
  birthDate?: string;
  criminalChargeDescription?: null | string;
  documentKeyCodes?: null | Array<string>;
  emailAddress?: null | string;
  firstName?: null | string;
  gender?: GenderEnum;
  hasCriminalHistory?: null | boolean;
  isPoliceOrPeaceOfficer?: null | boolean;
  isTreatedForMHC?: null | boolean;
  lastName?: null | string;
  mailingAddress?: Address;
  middleName1?: null | string;
  middleName2?: null | string;
  otherOfficerRole?: null | string;
  phoneNumber?: null | string;
  policeOfficerRoleCode?: PoliceOfficerRoleEnum;
  residentialAddress?: Address;
}
