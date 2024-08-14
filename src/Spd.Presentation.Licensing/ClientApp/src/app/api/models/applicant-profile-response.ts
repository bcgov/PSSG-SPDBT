/* tslint:disable */
/* eslint-disable */
import { Address } from '../models/address';
import { Alias } from '../models/alias';
import { Document } from '../models/document';
import { GenderCode } from '../models/gender-code';
import { IdentityProviderTypeCode } from '../models/identity-provider-type-code';
import { PoliceOfficerRoleCode } from '../models/police-officer-role-code';
export interface ApplicantProfileResponse {
  aliases?: Array<Alias> | null;
  applicantId?: string;
  dateOfBirth?: string;
  documentInfos?: Array<Document> | null;
  emailAddress?: string | null;
  genderCode?: GenderCode;
  givenName?: string | null;
  hasCriminalHistory?: boolean | null;
  identityProviderTypeCode?: IdentityProviderTypeCode;
  isPoliceOrPeaceOfficer?: boolean | null;
  isTreatedForMHC?: boolean | null;
  mailingAddress?: Address;
  middleName1?: string | null;
  middleName2?: string | null;
  otherOfficerRole?: string | null;
  phoneNumber?: string | null;
  policeOfficerRoleCode?: PoliceOfficerRoleCode;
  residentialAddress?: Address;
  sub?: string | null;
  surname?: string | null;
}
