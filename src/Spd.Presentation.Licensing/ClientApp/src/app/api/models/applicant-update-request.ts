/* tslint:disable */
/* eslint-disable */
import { Address } from '../models/address';
import { Alias } from '../models/alias';
import { ApplicationTypeCode } from '../models/application-type-code';
import { GenderEnum } from '../models/gender-enum';
import { PoliceOfficerRoleEnum } from '../models/police-officer-role-enum';
export interface ApplicantUpdateRequest {
  aliases?: Array<Alias> | null;
  applicationTypeCode?: ApplicationTypeCode;
  criminalChargeDescription?: string | null;
  dateOfBirth?: string;
  documentKeyCodes?: Array<string> | null;
  emailAddress?: string | null;
  genderCode?: GenderEnum;
  givenName?: string | null;
  hasCriminalHistory?: boolean | null;
  hasNewCriminalRecordCharge?: boolean | null;
  hasNewMentalHealthCondition?: boolean | null;
  isPoliceOrPeaceOfficer?: boolean | null;
  isTreatedForMHC?: boolean | null;
  licenceId?: string | null;
  mailingAddress?: Address;
  middleName1?: string | null;
  middleName2?: string | null;
  otherOfficerRole?: string | null;
  phoneNumber?: string | null;
  policeOfficerRoleCode?: PoliceOfficerRoleEnum;
  previousDocumentIds?: Array<string> | null;
  residentialAddress?: Address;
  surname?: string | null;
}
