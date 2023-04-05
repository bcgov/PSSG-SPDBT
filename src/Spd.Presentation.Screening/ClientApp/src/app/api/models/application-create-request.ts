/* tslint:disable */
/* eslint-disable */
import { AliasCreateRequest } from './alias-create-request';
import { ApplicationOriginTypeCode } from './application-origin-type-code';
export interface ApplicationCreateRequest {
  addressLine1?: null | string;
  addressLine2?: null | string;
  agreeToCompleteAndAccurate?: null | boolean;
  aliases?: null | Array<AliasCreateRequest>;
  birthPlace?: null | string;
  city?: null | string;
  country?: null | string;
  dateOfBirth?: null | string;
  driversLicense?: null | string;
  emailAddress?: null | string;
  givenName?: null | string;
  haveVerifiedIdentity?: null | boolean;
  jobTitle?: null | string;
  middleName1?: null | string;
  middleName2?: null | string;
  oneLegalName?: null | boolean;
  orgId?: string;
  originTypeCode?: ApplicationOriginTypeCode;
  phoneNumber?: null | string;
  postalCode?: null | string;
  province?: null | string;
  surname?: null | string;
}
