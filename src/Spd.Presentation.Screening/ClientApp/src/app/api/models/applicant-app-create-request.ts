/* tslint:disable */
/* eslint-disable */
import { AliasCreateRequest } from './alias-create-request';
import { ApplicationOriginTypeCode } from './application-origin-type-code';
import { GenderCode } from './gender-code';
import { PayerPreferenceTypeCode } from './payer-preference-type-code';
import { ScreeningTypeCode } from './screening-type-code';
import { ServiceTypeCode } from './service-type-code';
export interface ApplicantAppCreateRequest {
  addressLine1?: null | string;
  addressLine2?: null | string;
  agreeToCompleteAndAccurate?: null | boolean;
  agreeToCriminalCheck?: null | boolean;
  agreeToShareCrc?: null | boolean;
  agreeToVulnerableSectorSearch?: null | boolean;
  aliases?: null | Array<AliasCreateRequest>;
  appInviteId?: null | string;
  birthPlace?: null | string;
  city?: null | string;
  consentToCompletedCrc?: null | boolean;
  consentToNotifyNoCrc?: null | boolean;
  consentToNotifyRisk?: null | boolean;
  consentToShareResultCrc?: null | boolean;
  contractedCompanyName?: null | string;
  country?: null | string;
  dateOfBirth?: null | string;
  driversLicense?: null | string;
  emailAddress?: null | string;
  employeeId?: null | string;
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
  requireDuplicateCheck?: boolean;
  screeningType?: ScreeningTypeCode;
  serviceType?: ServiceTypeCode;
  sharedClearanceId?: null | string;
  surname?: null | string;
}
