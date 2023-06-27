/* tslint:disable */
/* eslint-disable */
import { AliasCreateRequest } from './alias-create-request';
import { ApplicationOriginTypeCode } from './application-origin-type-code';
import { GenderCode } from './gender-code';
import { PayerPreferenceTypeCode } from './payer-preference-type-code';
import { ScreeningTypeCode } from './screening-type-code';
import { ServiceTypeCode } from './service-type-code';

/**
 * for Anonymous Applicant Application submission
 */
export interface AnonymousApplicantAppCreateRequest {
  addressLine1?: null | string;
  addressLine2?: null | string;
  agreeToCompleteAndAccurate?: null | boolean;
  agreeToCriminalCheck?: null | boolean;
  agreeToShare?: boolean;
  agreeToVulnerableSectorSearch?: null | boolean;
  aliases?: null | Array<AliasCreateRequest>;
  appInviteId?: null | string;
  birthPlace?: null | string;
  city?: null | string;
  contractedCompanyName?: null | string;
  country?: null | string;
  dateOfBirth?: null | string;
  driversLicense?: null | string;
  emailAddress?: null | string;
  genderCode?: GenderCode;
  givenName?: null | string;
  haveVerifiedIdentity?: null | boolean;
  jobTitle?: null | string;
  middleName1?: null | string;
  middleName2?: null | string;
  oneLegalName?: null | boolean;
  orgId?: string;
  originTypeCode?: ApplicationOriginTypeCode;
  payeeType?: PayerPreferenceTypeCode;
  phoneNumber?: null | string;
  postalCode?: null | string;
  province?: null | string;
  recaptcha?: null | string;
  requireDuplicateCheck?: boolean;
  screeningType?: ScreeningTypeCode;
  serviceType?: ServiceTypeCode;
  sharedClearanceId?: null | string;
  surname?: null | string;
}
