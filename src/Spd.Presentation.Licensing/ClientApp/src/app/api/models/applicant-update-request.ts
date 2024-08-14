/* tslint:disable */
/* eslint-disable */
import { Address } from '../models/address';
import { Alias } from '../models/alias';
import { ApplicationTypeCode } from '../models/application-type-code';
import { GenderCode } from '../models/gender-code';
import { PoliceOfficerRoleCode } from '../models/police-officer-role-code';
export interface ApplicantUpdateRequest {
  aliases?: Array<Alias> | null;
  applicationTypeCode?: ApplicationTypeCode;
  criminalChargeDescription?: string | null;
  dateOfBirth?: string;
  documentKeyCodes?: Array<string> | null;
  emailAddress?: string | null;
  genderCode?: GenderCode;
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
  policeOfficerRoleCode?: PoliceOfficerRoleCode;
  previousDocumentIds?: Array<string> | null;
  residentialAddress?: Address;
  surname?: string | null;
}
