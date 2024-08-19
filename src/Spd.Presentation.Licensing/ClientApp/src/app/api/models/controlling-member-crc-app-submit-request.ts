/* tslint:disable */
/* eslint-disable */
import { Address } from '../models/address';
import { Alias } from '../models/alias';
import { GenderCode } from '../models/gender-code';
import { PoliceOfficerRoleCode } from '../models/police-officer-role-code';
export interface ControllingMemberCrcAppSubmitRequest {
  accessCode?: string | null;
  aliases?: Array<Alias> | null;
  bankruptcyHistoryDetail?: string | null;
  bcDriverLicenceNumber?: string | null;
  citizenshipProofExpiryDate?: string | null;
  criminalHistoryDetail?: string | null;
  dateOfBirth?: string;
  dateSigned?: string;
  emailAddress?: string | null;
  genderCode?: GenderCode;
  givenName?: string | null;
  hasBankruptcyHistory?: boolean | null;
  hasBcDriverLicence?: boolean | null;
  hasCriminalHistory?: boolean | null;
  hasMentalCondition?: boolean | null;
  hasPreviousNames?: boolean | null;
  isCanadianCitizen?: boolean | null;
  isPoliceOrPeaceOfficer?: boolean | null;
  isTermsOfUseAccepted?: boolean | null;
  middleName1?: string | null;
  middleName2?: string | null;
  phoneNumber?: string | null;
  policeOfficerRoleCode?: PoliceOfficerRoleCode;
  residentialAddress?: Address;
  surname?: string | null;
}
